"""Renderiza en paralelo todas las escenas Manim de una carpeta."""
import json, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
folder = sys.argv[1]
n = len(json.load(open(f'{folder}/escenas.json')))
def run(i):
    r = subprocess.run(['/home/user/tools/manim-venv/bin/python', '../manim_motor.py', '.', str(i)], cwd=folder,
                       capture_output=True, text=True)
    return i, r.returncode, r.stderr[-400:]
with ThreadPoolExecutor(4) as ex:
    for i, code, err in ex.map(run, range(n)):
        if code: print('FALLO', i, err)
print(folder, 'listo', n, 'escenas')
