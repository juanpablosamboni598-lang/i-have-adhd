"""Genera subtítulos ASS con la palabra actual resaltada, más la marca de agua."""
import json, sys, os
folder = sys.argv[1]
tl = json.load(open(f'{folder}/timeline.json'))
marca = json.load(open(f'{folder}/meta.json')).get('marca', '') if os.path.exists(f'{folder}/meta.json') else ''
def ts(t):
    h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60
    return f'{h}:{m:02d}:{s:05.2f}'
lines = ["[Script Info]", "ScriptType: v4.00+", "PlayResX: 1920", "PlayResY: 1080", "",
         "[V4+ Styles]",
         "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
         "Style: Sub,Inter ExtraBold,54,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,3,14,0,2,80,80,70,1",
         "Style: Marca,Inter Medium,24,&H90D8C0B0,&H90D8C0B0,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,3,40,40,30,1",
         "", "[Events]", "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text"]
for sc in tl['scenes']:
    words = sc['words']; st = sc['start']
    for i, (w, t) in enumerate(words):
        a = st + t
        b = st + (words[i + 1][1] if i + 1 < len(words) else sc['dur'] - 0.4)
        blk = i // 6
        seg = words[blk * 6: blk * 6 + 6]
        parts = []
        for j, (ww, _) in enumerate(seg):
            gi = blk * 6 + j
            parts.append('{\\c&H3CC8FF&}' + ww + '{\\c&HFFFFFF&}' if gi == i else ww)
        lines.append(f"Dialogue: 0,{ts(a)},{ts(max(b, a + 0.05))},Sub,,0,0,0,,{' '.join(parts)}")
if marca:
    lines.append(f"Dialogue: 0,{ts(0)},{ts(tl['total'])},Marca,,0,0,0,,{marca}")
open(f'{folder}/subs.ass', 'w').write('\n'.join(lines) + '\n')
print('ok', folder)
