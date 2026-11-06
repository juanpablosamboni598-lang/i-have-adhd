"""Miniatura con Manim: criatura grande a la derecha y texto a la izquierda.
Uso: manim_miniatura.py '<json>' salida.png"""
import json, sys, os, shutil
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from manim import *
import manim_motor as mm
cfg = json.loads(sys.argv[1]); out = os.path.abspath(sys.argv[2])

class Mini(mm.Base):
    sc = {'tipo': 'x', 'kicker': '', 'titulo': ''}
    def construct(self):
        self.camera.background_color = '#04122a'
        for r, o in ((5.5, 0.10), (4.0, 0.16), (2.6, 0.24)):
            self.add(Circle(radius=r, fill_color=cfg.get('glow', '#ff5040'), fill_opacity=o, stroke_width=0).move_to(RIGHT * 3.6))
        crit = getattr(self, cfg['kind'])().scale(cfg.get('escala', 1.25)).move_to(RIGHT * cfg.get('x', 3.6) + DOWN * 0.2)
        crit.clear_updaters()
        for m in crit.get_family(): m.clear_updaters()
        self.add(crit)
        y = 3.0
        for txt, size, col in cfg['lineas']:
            t = mm.fit(mm.T(txt, size, col, HEAVY), 7.0)
            t.set_stroke(BLACK, width=10, background=True)
            t.move_to([-6.8, y, 0], aligned_edge=LEFT + UP)
            self.add(t); y -= t.height + 0.25
        if cfg.get('caja'):
            tx = mm.T(cfg['caja'], 64, WHITE, HEAVY)
            bx = SurroundingRectangle(tx, color='#e61e28', fill_color='#e61e28', fill_opacity=1, buff=0.25, corner_radius=0.2)
            g = VGroup(bx, tx).move_to([-6.8, y - 0.2, 0], aligned_edge=LEFT + UP)
            self.add(g)

with tempconfig({'pixel_width': 1280, 'pixel_height': 720, 'save_last_frame': True, 'write_to_movie': False,
                 'media_dir': '/tmp/claude-0/-home-user-i-have-adhd/b44a631c-aa93-5a06-8553-5375e2a18dfb/scratchpad/mini_media',
                 'verbosity': 'WARNING', 'output_file': 'mini', 'disable_caching': True}):
    s = Mini(); s.render()
    shutil.copy(s.renderer.file_writer.image_file_path, out)
print('ok', out)
