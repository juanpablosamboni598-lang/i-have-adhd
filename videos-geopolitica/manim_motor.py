"""Motor de escenas con Manim. Uso: manim_motor.py <carpeta> <indice>
Lee escenas.json y timeline.json y escribe <carpeta>/render/eNN.mp4 (sin subtítulos)."""
import json, os, sys, random
import numpy as np
from manim import *

FONT = 'Inter'
NAVY = '#07101e'
RED_ = '#eb404a'
GOLD_ = '#ffc83c'
CYAN_ = '#46c8ff'
SOFT_ = '#b0c0d8'
COLS = {'red': RED_, 'gold': GOLD_, 'cyan': CYAN_, 'white': WHITE}


def T(txt, size=40, color=WHITE, weight=BOLD):
    return Text(txt, font=FONT, font_size=size, color=color, weight=weight)


def fit(mob, maxw):
    if mob.width > maxw:
        mob.scale_to_fit_width(maxw)
    return mob


class Base(Scene):
    sc = None
    dur = 5.0
    idx = 0

    def setup_bg(self):
        self.camera.background_color = NAVY
        plane = NumberPlane(x_range=[-8, 8, 1], y_range=[-5, 5, 1],
                            background_line_style={'stroke_color': '#16304f', 'stroke_width': 1, 'stroke_opacity': 0.6},
                            axis_config={'stroke_opacity': 0})
        self.add(plane)
        rnd = random.Random(self.idx)
        dots = VGroup(*[Dot(point=[rnd.uniform(-7, 7), rnd.uniform(-4, 4), 0], radius=rnd.uniform(0.015, 0.04),
                            color=CYAN_, fill_opacity=rnd.uniform(0.15, 0.45)) for _ in range(60)])
        dots.add_updater(lambda m, dt: m.shift(UP * 0.04 * dt))
        self.add(dots)

    def header(self):
        k = T(self.sc['kicker'].upper(), 24, RED_, HEAVY).to_corner(UL, buff=0.55).shift(RIGHT * 0.2)
        bar = Rectangle(width=0.07, height=0.75, fill_color=RED_, fill_opacity=1, stroke_width=0).next_to(k, LEFT, buff=0.15).align_to(k, UP)
        ti = fit(T(self.sc['titulo'], 44, WHITE, HEAVY), 9).next_to(k, DOWN, aligned_edge=LEFT, buff=0.12)
        self.play(FadeIn(bar, shift=DOWN * 0.2), FadeIn(k, shift=RIGHT * 0.5), run_time=0.4)
        self.play(AddTextLetterByLetter(ti, run_time=0.5))
        return 0.9

    def construct(self):
        self.setup_bg()
        self.used = 0.0
        if self.sc['tipo'] not in ('titulo',):
            self.used += self.header()
        getattr(self, 'do_' + self.sc['tipo'])()
        rest = self.dur - self.used - 0.35
        if rest > 0:
            self.wait(rest)
        self.play(*[FadeOut(m) for m in self.mobjects], run_time=0.35)

    def P(self, *anims, run_time=1.0, **kw):
        self.play(*anims, run_time=run_time, **kw)
        self.used += run_time

    def W(self, t):
        if t > 0.01:
            self.wait(t)
            self.used += t

    def until(self, frac):
        self.W(self.dur * frac - self.used)

    # ------------------------------------------------ escenas
    def do_titulo(self):
        big = fit(T(self.sc['grande'], 150, WHITE, HEAVY), 12.5)
        big.set_stroke(RED_, width=4, background=True)
        sub = fit(T(self.sc['sub'], 40, GOLD_, HEAVY), 12).next_to(big, DOWN, buff=0.45)
        line = Line(LEFT * 3.2, RIGHT * 3.2, color=RED_, stroke_width=8).next_to(sub, DOWN, buff=0.25)
        self.P(LaggedStart(*[FadeIn(ch, shift=DOWN * 1.5, scale=1.6) for ch in big], lag_ratio=0.08), run_time=1.3)
        self.P(Wiggle(big, scale_value=1.04, rotation_angle=0.02), run_time=0.5)
        self.P(FadeIn(sub, shift=UP * 0.3), Create(line), run_time=0.7)
        self.P(big.animate.scale(1.05), run_time=max(0.5, self.dur * 0.5 - self.used))

    def do_contador(self):
        s = self.sc
        dec = s.get('decimales', 0)
        tr = ValueTracker(s['desde'])
        anio = s['desde'] >= 1000 and s['hasta'] <= 2100
        def fmtv(v):
            if anio:
                return str(int(round(v)))
            txt = f'{v:,.{dec}f}'.replace(',', 'X').replace('.', ',').replace('X', '.')
            return txt.replace('-', '−')
        def mk():
            n = T(fmtv(tr.get_value()), 150, WHITE, HEAVY)
            sf = T(s.get('sufijo', '').strip() or ' ', 90, GOLD_, HEAVY)
            g = VGroup(n, sf).arrange(RIGHT, buff=0.25, aligned_edge=DOWN).move_to(UP * 0.4)
            return g
        num = always_redraw(mk)
        suf = VGroup()
        ring = Circle(radius=2.6, color=CYAN_, stroke_width=6).move_to(UP * 0.4)
        lab = fit(T(s['etiqueta'], 38, GOLD_, HEAVY), 12).move_to(DOWN * 2.4)
        self.add(num, suf)
        self.P(Create(ring), tr.animate.set_value(s['hasta']), run_time=min(4.0, self.dur * 0.45), rate_func=rush_from)
        self.P(Indicate(VGroup(num, suf), color=GOLD_, scale_factor=1.12), FadeIn(lab, shift=UP * 0.4), run_time=0.8)
        self.P(ring.animate.scale(1.12).set_stroke(opacity=0.2), run_time=1.0)

    def do_lista(self):
        items = self.sc['items']
        rows = VGroup()
        for i, it in enumerate(items):
            c = Circle(radius=0.38, color=RED_, fill_color=RED_, fill_opacity=1, stroke_width=0)
            n = T(str(i + 1), 34, WHITE, HEAVY).move_to(c)
            tx = fit(T(it, 44, WHITE, BOLD), 10.5).next_to(c, RIGHT, buff=0.4)
            rows.add(VGroup(VGroup(c, n), tx))
        rows.arrange(DOWN, aligned_edge=LEFT, buff=0.75).move_to(DOWN * 0.3).to_edge(LEFT, buff=1.2)
        for i, r in enumerate(rows):
            self.until(0.12 + 0.6 * i / max(1, len(rows) - 1))
            self.P(GrowFromCenter(r[0]), FadeIn(r[1], shift=RIGHT * 0.8), run_time=0.6)
        self.P(Circumscribe(rows[-1], color=GOLD_, buff=0.15), run_time=1.0)

    def do_barras(self):
        rows = self.sc['barras']
        y = 1.2
        for k, (name, frac, c) in enumerate(rows):
            lab = T(name, 32, WHITE, HEAVY).move_to([-6.2, y + 0.55, 0], aligned_edge=LEFT)
            bar = Rectangle(width=max(0.05, 12 * frac), height=0.8, fill_color=COLS[c], fill_opacity=1, stroke_width=0)
            bar.move_to([-6.2, y - 0.2, 0], aligned_edge=LEFT)
            self.P(FadeIn(lab, shift=RIGHT * 0.4), GrowFromEdge(bar, LEFT), run_time=1.4)
            y -= 2.0
        if self.sc.get('ilustrativo'):
            self.add(T('Ilustrativo', 18, SOFT_, NORMAL).to_corner(DR, buff=1.6))

    def do_suscribete(self):
        btn = RoundedRectangle(width=5.2, height=1.3, corner_radius=0.3, fill_color='#e61e28', fill_opacity=1, stroke_width=0).move_to(UP * 1.1)
        lab = T('SUSCRÍBETE', 52, WHITE, HEAVY).move_to(btn)
        self.P(GrowFromCenter(btn), FadeIn(lab), run_time=0.6)
        self.W(1.0)
        self.P(VGroup(btn, lab).animate.scale(0.9), run_time=0.15)
        lab2 = T('SUSCRITO ✓', 52, WHITE, HEAVY).move_to(btn)
        self.P(VGroup(btn, lab).animate.scale(1 / 0.9), btn.animate.set_fill('#5a5a5a'), Transform(lab, lab2), run_time=0.3)
        bell = VGroup(Triangle(fill_color=GOLD_, fill_opacity=1, stroke_width=0).scale(0.45), Dot(color=GOLD_).shift(DOWN * 0.45)).next_to(btn, RIGHT, buff=0.6)
        self.P(FadeIn(bell), run_time=0.3)
        self.P(Wiggle(bell, rotation_angle=0.25 * TAU, n_wiggles=6), run_time=1.0)
        k = T(self.sc['kicker'].upper(), 30, SOFT_, HEAVY).move_to(DOWN * 1.0)
        p = fit(T(self.sc['proximo'], 46, GOLD_, HEAVY), 12.5).move_to(DOWN * 1.8)
        self.P(FadeIn(k, shift=UP * 0.3), Write(p), run_time=1.2)

    # ------------------------------------------------ criaturas
    def tardigrado(self):
        body = Ellipse(width=5.4, height=2.4, fill_color='#d8c7a8', fill_opacity=1, stroke_color='#8a7a60', stroke_width=4)
        segs = VGroup(*[Arc(radius=1.25, start_angle=-PI / 2.6, angle=PI / 1.3, color='#a8977a', stroke_width=3).stretch(0.9, 0).move_to([x, 0, 0]) for x in (-1.3, -0.3, 0.7)])
        head = Circle(radius=0.75, fill_color='#e2d3b6', fill_opacity=1, stroke_color='#8a7a60', stroke_width=4).move_to([2.8, 0.15, 0])
        mouth = Circle(radius=0.14, fill_color='#6b5a44', fill_opacity=1, stroke_width=0).move_to([3.45, 0.05, 0])
        eye = Dot([3.05, 0.45, 0], radius=0.06, color='#222')
        legs = VGroup()
        for i, x in enumerate((-1.9, -0.7, 0.5, 1.7)):
            leg = VGroup(RoundedRectangle(width=0.55, height=0.9, corner_radius=0.25, fill_color='#cbb994', fill_opacity=1, stroke_color='#8a7a60', stroke_width=3),
                         *[Line([0, 0, 0], [dx, -0.25, 0], color='#333', stroke_width=4).shift([dx * 0.3, -0.45, 0]) for dx in (-0.15, 0, 0.15)])
            leg.move_to([x, -1.2, 0])
            leg.phase = i
            legs.add(leg)
        g = VGroup(legs, body, segs, head, mouth, eye)
        t0 = [0.0]

        def wob(m, dt):
            t0[0] += dt
            for lg in legs:
                lg.rotate(0.6 * dt * np.cos(t0[0] * 4 + lg.phase), about_point=lg.get_top())
        legs.add_updater(wob)
        return g

    def mariquita(self):
        legs = VGroup(*[Line([0, 0, 0], [s * 1.9, y, 0], color='#111', stroke_width=7).shift([s * 0.4, y * 0.3, 0]) for s in (-1, 1) for y in (0.7, 0, -0.7)])
        body = Ellipse(width=3.6, height=4.0, fill_color='#e0242c', fill_opacity=1, stroke_color='#111', stroke_width=6).shift(DOWN * 0.2)
        head = Ellipse(width=2.0, height=1.3, fill_color='#111', fill_opacity=1, stroke_width=0).move_to(UP * 2.0)
        eyes = VGroup(*[Dot([x, 2.15, 0], radius=0.14, color=WHITE) for x in (-0.45, 0.45)])
        line = Line(UP * 1.75, DOWN * 2.2, color='#111', stroke_width=6)
        spots = VGroup(*[Dot([x, y, 0], radius=r, color='#111') for x, y, r in ((-0.9, 0.8, 0.32), (0.9, 0.8, 0.32), (-1.0, -0.5, 0.36), (1.0, -0.5, 0.36), (-0.55, -1.5, 0.28), (0.55, -1.5, 0.28), (0, 1.3, 0.3))])
        ant = VGroup(*[CubicBezier([s * 0.4, 2.5, 0], [s * 0.6, 3.2, 0], [s * 1.1, 3.3, 0], [s * 1.3, 3.0, 0], color='#111', stroke_width=6) for s in (-1, 1)])
        g = VGroup(legs, ant, body, line, spots, head, eyes).scale(0.85)
        g.add_updater(lambda m, dt: m.rotate(0.05 * np.sin(self.renderer.time * 2) * dt))
        return g

    def ajolote(self):
        pink = '#f4a6b8'
        tail = Polygon([-1.6, 0.3, 0], [-4.4, 0.05, 0], [-1.6, -0.6, 0], fill_color='#f0b3c2', fill_opacity=1, stroke_color='#d77a92', stroke_width=3)
        body = Ellipse(width=4.0, height=1.5, fill_color=pink, fill_opacity=1, stroke_color='#d77a92', stroke_width=3).shift(LEFT * 0.4 + DOWN * 0.1)
        head = Ellipse(width=2.4, height=1.8, fill_color='#f7b3c3', fill_opacity=1, stroke_color='#d77a92', stroke_width=3).move_to([2.0, 0.2, 0])
        gills = VGroup()
        for s in (1, -1):
            for k, ang in enumerate((0.5, 0.1, -0.3)):
                base = np.array([1.15, 0.35 * s + 0.2, 0])
                tip = base + np.array([-0.55 - 0.25 * k, s * (1.0 + 0.2 * k), 0])
                stem = Line(base, tip, color='#e0466e', stroke_width=7)
                fr = VGroup(*[Line(base + (tip - base) * u, base + (tip - base) * u + np.array([-0.18, 0.18 * s, 0]), color='#ff6f93', stroke_width=4) for u in (0.3, 0.5, 0.7, 0.9)])
                gl = VGroup(stem, fr)
                gl.base = base
                gl.k = k + (0 if s > 0 else 3)
                gills.add(gl)
        eyes = VGroup(*[Dot([2.55, y, 0], radius=0.1, color='#111') for y in (0.45, -0.05)])
        smile = Arc(radius=0.5, start_angle=-PI * 0.75, angle=PI * 0.5, color='#a14e63', stroke_width=5).move_to([2.9, -0.15, 0])
        legs = VGroup(*[Polygon([x, -0.6, 0], [x - 0.3, -1.3, 0], [x + 0.2, -1.3, 0], fill_color=pink, fill_opacity=1, stroke_color='#d77a92', stroke_width=3) for x in (-1.6, 0.8)])
        g = VGroup(tail, legs, body, head, gills, eyes, smile)
        t0 = [0.0]

        def sway(m, dt):
            t0[0] += dt
            for gl in gills:
                gl.rotate(0.35 * dt * np.cos(t0[0] * 3 + gl.k), about_point=gl.base)
        gills.add_updater(sway)
        return g

    def do_criatura(self):
        crit = getattr(self, self.sc['kind'])()
        crit.move_to(RIGHT * 3.2 + DOWN * 0.3)
        self.P(DrawBorderThenFill(crit), run_time=1.6)
        y = 1.2
        boxes = []
        for i, txt in enumerate(self.sc.get('callouts', [])):
            self.until(0.15 + 0.25 * i)
            tx = fit(T(txt, 32, WHITE, HEAVY), 5.6)
            bx = SurroundingRectangle(tx, color=GOLD_, buff=0.22, corner_radius=0.15, fill_color='#14284a', fill_opacity=1)
            grp = VGroup(bx, tx).move_to([-6.6, y, 0], aligned_edge=LEFT)
            arr = Arrow(grp.get_right(), crit.get_center() + np.array([-1.2, (1 - i) * 0.6, 0]), color=GOLD_, stroke_width=4, buff=0.2, max_tip_length_to_length_ratio=0.08)
            self.P(FadeIn(grp, shift=RIGHT * 0.8), GrowArrow(arr), run_time=0.6)
            boxes.append(grp)
            y -= 1.3


def main():
    folder, i = sys.argv[1], int(sys.argv[2])
    esc = json.load(open(os.path.join(folder, 'escenas.json')))
    tl = json.load(open(os.path.join(folder, 'timeline.json')))
    os.makedirs(os.path.join(folder, 'render'), exist_ok=True)
    cls = type(f'E{i:02d}', (Base,), {'sc': esc[i], 'dur': tl['scenes'][i]['dur'], 'idx': i})
    with tempconfig({'pixel_width': 1920, 'pixel_height': 1080, 'frame_rate': 30, 'quality': 'high_quality',
                     'media_dir': os.path.join(folder, 'manim_media', f'e{i:02d}'), 'disable_caching': True,
                     'output_file': f'e{i:02d}', 'verbosity': 'WARNING', 'progress_bar': 'none'}):
        sc = cls()
        sc.render()
        out = sc.renderer.file_writer.movie_file_path
    os.replace(out, os.path.join(folder, 'render', f'e{i:02d}.mp4'))


if __name__ == '__main__':
    main()
