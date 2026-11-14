#!/usr/bin/env python3
"""Voz rápida con edge-tts (gratis) + tiempos exactos por palabra, para pruebas de voz y Shorts.
Herramienta independiente: no la usan los pipeline*.sh (esos usan tts/chatter.py).

Uso:
  edge_cli.py --text "Si pones un tanque..." --output prueba.mp3 [--timeline prueba.json]
  edge_cli.py --input guion.txt --output prueba.wav --voice es-ES-AlvaroNeural --rate +8%
Misma configuración que chatter.py: proxy del contenedor (HTTPS_PROXY) y boundary="WordBoundary".
Si no se da --timeline, se escribe <salida>_timeline.json."""
import argparse, asyncio, json, os, subprocess, sys, tempfile
import edge_tts

DEFAULT_VOICE = 'es-MX-JorgeNeural'  # la misma que chatter.py
PROXY = os.environ.get('HTTPS_PROXY') or os.environ.get('https_proxy')


async def synth(text, mp3, voice, rate, pitch):
    com = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch, boundary='WordBoundary', proxy=PROXY)
    words = []
    with open(mp3, 'wb') as f:
        async for ch in com.stream():
            if ch['type'] == 'audio':
                f.write(ch['data'])
            elif ch['type'] == 'WordBoundary':  # offset/duration en unidades de 100 ns
                st, du = ch['offset'] / 1e7, ch['duration'] / 1e7
                words.append({'word': ch['text'], 'start': round(st, 3), 'end': round(st + du, 3), 'duration': round(du, 3)})
    return words


def main():
    ap = argparse.ArgumentParser(description='Voz edge-tts con tiempos por palabra')
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument('--text', help='texto a leer')
    g.add_argument('--input', '-i', help='archivo .txt (o escenas.json: une los "texto")')
    ap.add_argument('--output', '-o', required=True, help='salida .mp3 o .wav')
    ap.add_argument('--timeline', '-t', default='', help='salida JSON con las palabras')
    ap.add_argument('--voice', '-v', default=DEFAULT_VOICE)
    ap.add_argument('--rate', '-r', default='+0%')
    ap.add_argument('--pitch', default='+0Hz')
    a = ap.parse_args()

    if a.text:
        text = a.text.strip()
    else:
        raw = open(a.input, encoding='utf-8').read().strip()
        if a.input.endswith('.json'):
            d = json.loads(raw)
            items = d.get('escenas', d) if isinstance(d, dict) else d
            text = ' '.join(e.get('texto', '') for e in items) if isinstance(items, list) else str(d.get('text', raw))
        else:
            text = raw
    if not text:
        sys.exit('texto vacío')

    out = os.path.abspath(a.output)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    mp3 = out if out.lower().endswith('.mp3') else tempfile.mktemp(suffix='.mp3')
    words = asyncio.run(synth(text, mp3, a.voice, a.rate, a.pitch))
    if not words:
        sys.exit('edge-tts no devolvió palabras (¿sin red o sin proxy?)')
    if mp3 != out:  # salida .wav (u otra extensión que entienda ffmpeg)
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', mp3, '-ar', '24000', '-ac', '1', out], check=True)
        os.remove(mp3)
    tl = a.timeline or os.path.splitext(out)[0] + '_timeline.json'
    json.dump({'voice': a.voice, 'rate': a.rate, 'duration': words[-1]['end'], 'words': words},
              open(tl, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'[OK] {out} | {len(words)} palabras | {tl}')


if __name__ == '__main__':
    main()
