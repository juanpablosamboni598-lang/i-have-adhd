"""Miniatura 1280x720 con el tiburón caricatura. Uso: miniatura_cartoon.py <carpeta>"""
import sys, os, shutil
sys.argv += [] 
from manim import *
import manim_cartoon as mc

class Mini(mc.Base):
    def construct(self):
        self.used = 0
        self.ocean(top='#2a86c7', bot='#020a18', surface=True)
        seal = mc.Seal().scale(1.1).move_to([4.6, 2.55, 0]); seal.clear_updaters()
        sh = mc.Shark(wag=False).scale(1.2).rotate(PI / 2.6).move_to([4.2, -1.3, 0])
        sh.mouth.set_stroke(width=10)
        teeth = VGroup(*[Triangle(fill_color=WHITE, fill_opacity=1, stroke_width=0).scale(0.09).rotate(PI).move_to(sh.mouth.point_from_proportion(u) + DOWN * 0.05) for u in (0.15, .35, .55, .75, .9)])
        glow = Circle(radius=0.35, fill_color=mc.RED_, fill_opacity=0.35, stroke_width=0).move_to(sh.eye)
        drops = VGroup(*[Dot([4.6 + mc.random.uniform(-2.5, 2.5), 2.5 + mc.random.uniform(0, 2), 0], radius=0.08, color='#e8f7ff') for _ in range(30)])
        t1 = mc.T('ASÍ CAZA', 110, WHITE).set_stroke(BLACK, width=14, background=True)
        t2 = mc.T('EN 2 SEGUNDOS', 82, mc.GOLD_).set_stroke(BLACK, width=14, background=True)
        g = VGroup(t1, t2).arrange(DOWN, aligned_edge=LEFT, buff=0.2).to_edge(LEFT, buff=0.45).shift(DOWN * 0.9)
        arr = Arrow(g.get_right() + RIGHT * 0.1 + UP * 0.3, sh.get_center() + LEFT * 0.6, color=mc.RED_, stroke_width=14, max_tip_length_to_length_ratio=0.25)
        self.add(drops, seal, glow, sh, teeth, g)

folder = sys.argv[1]
with tempconfig({'pixel_width': 1280, 'pixel_height': 720, 'frame_rate': 30, 'media_dir': os.path.join(folder, 'manim_media', 'mini'),
                 'save_last_frame': True, 'write_to_movie': False, 'verbosity': 'WARNING', 'disable_caching': True}):
    s = Mini(); s.render(); p = s.renderer.file_writer.image_file_path
os.system(f'ffmpeg -y -loglevel error -i "{p}" -q:v 2 {folder}/miniatura.jpg')
print('ok')
