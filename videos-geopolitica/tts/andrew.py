"""Voz del canal desde v23: Andrew (edge-tts, gratis) con tiempos exactos por palabra.
Uso (igual que chatter.py): andrew.py <carpeta> [indices...]
Salida por escena: <carpeta>/audio2/aNN.wav (lo que usa prep.py) y aNN.words.json [[palabra, inicio_s, dur_s], ...].
Variables: TTS_VOICE (por defecto en-US-AndrewMultilingualNeural), TTS_RATE (p. ej. +5%), FORCE=1."""
import sys, os, json, asyncio, subprocess, time
import edge_tts

folder = sys.argv[1]
esc = json.load(open(os.path.join(folder, 'escenas.json')))
idx = [int(x) for x in sys.argv[2:]] or range(len(esc))
voice = os.environ.get('TTS_VOICE', 'en-US-AndrewMultilingualNeural')
rate = os.environ.get('TTS_RATE', '+0%')
proxy = os.environ.get('HTTPS_PROXY') or os.environ.get('https_proxy')  # el contenedor solo sale por el proxy
out = os.path.join(folder, 'audio2'); os.makedirs(out, exist_ok=True)


async def synth(text, mp3):
    com = edge_tts.Communicate(text, voice, rate=rate, boundary='WordBoundary', proxy=proxy)  # WordBoundary: tiempos por palabra
    words = []
    with open(mp3, 'wb') as f:
        async for ch in com.stream():
            if ch['type'] == 'audio': f.write(ch['data'])
            elif ch['type'] == 'WordBoundary': words.append([ch['text'], round(ch['offset'] / 1e7, 3), round(ch['duration'] / 1e7, 3)])
    return words


for i in idx:
    base = os.path.join(out, f'a{i:02d}')
    if os.path.exists(base + '.wav') and os.path.exists(base + '.words.json') and os.environ.get('FORCE') != '1':
        continue
    t0 = time.time()
    for k in range(4):
        try:
            words = asyncio.run(synth(esc[i]['texto'], base + '.mp3'))
            if words: break
        except Exception as e:
            print(i, 'reintento', k + 1, type(e).__name__, flush=True)
        time.sleep(2 * (k + 1))
    else:
        sys.exit(f'falló la voz en la escena {i}')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', base + '.mp3', '-ar', '24000', '-ac', '1', base + '.wav'], check=True)
    os.remove(base + '.mp3')
    json.dump(words, open(base + '.words.json', 'w'), ensure_ascii=False)
    print(i, len(words), 'palabras en', round(time.time() - t0, 1), 's', flush=True)
