"""Construye la librería local de efectos CC0 por categoría.
Uso: python3 construir.py <carpeta_raw>   (raw/<pack>/... descargados de OpenGameArt, solo licencia CC0)
Salida: sfx_lib/<categoria>/<pack>__<nombre>.wav (mono 44.1 kHz, sin silencio inicial, máx 3 s, pico -1 dB) + indice.json"""
import os, sys, re, json, subprocess
raw = sys.argv[1]; out = os.path.dirname(os.path.abspath(__file__))
CAT = [  # (categoria, palabras clave en ruta/nombre) — el primero que coincide gana
 ('whoosh', r'whoosh|swoosh|swish|swing|woosh|air'),
 ('agua', r'water|splash|drip|pour|tap-water|spray|liquid|slime|kettle|boil|gulp'),
 ('burbuja', r'bubble'),
 ('pop', r'pop|cork|balloon|fruit'),
 ('electrico', r'electric|zap|spark|buzz|energy'),
 ('mecanico', r'machine|engine|motor|gear|mechan|lock|chain|spring|creak|door|tools|ratchet|crank'),
 ('metal', r'metal|pot|dishes|glass|coin|chips|clamour'),
 ('golpe', r'hit|slam|impact|thud|punch|drop|stone|wood|knock|slap|djembe|step|toaster|break'),
 ('clic', r'click|switch|keypress|key|tick|toggle|snap|tap|button'),
 ('papel', r'paper|book|scroll|card|cloth|scrape|scratch|flip'),
 ('ui', r'ui|interface|select|confirm|error|rollover|minimize|maximize|back|open|close|question|glitch'),
]
idx = {}
for root, _, files in os.walk(raw):
    for f in files:
        if f.startswith('._') or not re.search(r'\.(wav|ogg|mp3|flac)$', f, re.I) or 'preview' in f.lower() or 'prev' in f.lower(): continue
        src = os.path.join(root, f); rel = os.path.relpath(src, raw).lower(); pack = rel.split(os.sep)[0]
        if re.search(r'monster|mnstr|ogre|giant|creature|spell|sword|voice|cough|human|weird|shade', rel): continue  # no sirven para explicativos
        cat = next((c for c, rx in CAT if re.search(rx, rel)), None)
        if not cat: continue
        name = re.sub(r'[^a-z0-9]+', '_', os.path.splitext(f.lower())[0]).strip('_')
        dst = os.path.join(out, cat, f'{pack}__{name}.wav'); os.makedirs(os.path.dirname(dst), exist_ok=True)
        af = 'silenceremove=start_periods=1:start_threshold=-50dB,atrim=0:3,afade=t=out:st=2.6:d=0.4,dynaudnorm=p=0.89:m=100:s=1'
        r = subprocess.run(['ffmpeg','-v','error','-y','-i',src,'-ac','1','-ar','44100','-af',af,'-c:a','pcm_s16le',dst])
        if r.returncode or os.path.getsize(dst) < 2000:
            if os.path.exists(dst): os.remove(dst)
            continue
        idx.setdefault(cat, []).append(os.path.relpath(dst, out))
json.dump({k: sorted(v) for k, v in sorted(idx.items())}, open(os.path.join(out, 'indice.json'), 'w'), indent=1)
print({k: len(v) for k, v in sorted(idx.items())})
