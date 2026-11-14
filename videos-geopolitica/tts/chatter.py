"""Voz para los videos. Motor por defecto: edge-tts (gratis, neuronal) con tiempos exactos por palabra.
Uso (igual que antes): chatter.py <carpeta> [indices...]
Salida por escena: <carpeta>/audio2/aNN.wav (lo que usa prep.py), aNN.mp3 y aNN.words.json [[palabra, inicio_s, dur_s], ...]
Además: <carpeta>/audio2/timeline.json con todas las escenas (tiempos relativos a cada clip).
Variables: TTS_ENGINE=edge|chatterbox (chatterbox = voz clonada anterior, tts/chatter_chatterbox.py),
           TTS_VOICE (por defecto es-MX-JorgeNeural; p. ej. es-ES-AlvaroNeural), TTS_RATE (p. ej. +8%), TTS_PITCH (p. ej. +0Hz), FORCE=1."""
import sys, os, json, asyncio, subprocess, time

here = os.path.dirname(os.path.abspath(__file__))
if os.environ.get('TTS_ENGINE', 'edge') == 'chatterbox':
    os.execv(sys.executable, [sys.executable, os.path.join(here, 'chatter_chatterbox.py')] + sys.argv[1:])

import edge_tts  # noqa: E402

folder = sys.argv[1]
esc = json.load(open(os.path.join(folder, 'escenas.json')))
idx = [int(x) for x in sys.argv[2:]] or range(len(esc))
voice = os.environ.get('TTS_VOICE', 'es-MX-JorgeNeural')
rate = os.environ.get('TTS_RATE', '+0%')
pitch = os.environ.get('TTS_PITCH', '+0Hz')
proxy = os.environ.get('HTTPS_PROXY') or os.environ.get('https_proxy')
out_dir = os.path.join(folder, 'audio2')
os.makedirs(out_dir, exist_ok=True)


async def synth(text, mp3):
    com = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch, boundary='WordBoundary', proxy=proxy)
    words = []
    with open(mp3, 'wb') as f:
        async for ch in com.stream():
            if ch['type'] == 'audio':
                f.write(ch['data'])
            elif ch['type'] == 'WordBoundary':  # offset/duration en unidades de 100 ns
                words.append([ch['text'], round(ch['offset'] / 1e7, 3), round(ch['duration'] / 1e7, 3)])
    return words


for i in idx:
    base = os.path.join(out_dir, f'a{i:02d}')
    if os.path.exists(base + '.wav') and os.path.exists(base + '.words.json') and os.environ.get('FORCE') != '1':
        continue
    t0 = time.time()
    for attempt in range(4):
        try:
            words = asyncio.run(synth(esc[i]['texto'], base + '.mp3'))
            if words and os.path.getsize(base + '.mp3') > 1000:
                break
        except Exception as e:  # red inestable: reintentar
            print(i, 'reintento', attempt + 1, type(e).__name__, flush=True)
        time.sleep(2 * (attempt + 1))
    else:
        sys.exit(f'edge-tts falló en la escena {i}')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', base + '.mp3', '-ar', '24000', '-ac', '1', base + '.wav'], check=True)
    json.dump(words, open(base + '.words.json', 'w'), ensure_ascii=False)
    dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', base + '.wav']))
    print(i, round(dur, 1), 's audio en', round(time.time() - t0, 1), 's', len(words), 'palabras', flush=True)

# timeline de la voz (por escena, tiempos relativos al clip)
tl = []
for i in range(len(esc)):
    p = os.path.join(out_dir, f'a{i:02d}.words.json')
    tl.append({'escena': i, 'words': json.load(open(p)) if os.path.exists(p) else []})
json.dump({'voice': voice, 'rate': rate, 'scenes': tl}, open(os.path.join(out_dir, 'timeline.json'), 'w'), ensure_ascii=False)
