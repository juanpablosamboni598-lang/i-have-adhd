"""Motor de caricatura animada (Manim) para videos largos explicativos.
Uso: manim_cartoon.py <carpeta> <indice>  -> <carpeta>/render/eNN.mp4"""
import json, os, sys, random, math
import numpy as np
from manim import *

FONT = 'Inter'
RED_, GOLD_, CYAN_, SOFT_ = '#eb404a', '#ffc83c', '#46c8ff', '#b0c0d8'
SH_TOP, SH_BELLY, SH_LINE = '#6f8aa3', '#e9eef2', '#22344a'


def T(txt, size=40, color=WHITE, weight=HEAVY):
    return Text(txt, font=FONT, font_size=size, color=color, weight=weight)


def fit(m, w):
    if m.width > w:
        m.scale_to_fit_width(w)
    return m


def smooth(points, color, stroke=SH_LINE, sw=3, op=1):
    v = VMobject()
    pts = [np.array([x, y, 0]) for x, y in points]
    v.set_points_smoothly(pts + [pts[0]])
    v.set_fill(color, opacity=op).set_stroke(stroke, width=sw)
    return v


def poly(points, color, stroke=SH_LINE, sw=3, op=1):
    return Polygon(*[np.array([x, y, 0]) for x, y in points], fill_color=color, fill_opacity=op, stroke_color=stroke, stroke_width=sw)


def pill(txt, color=GOLD_, size=34):
    t = T(txt, size, WHITE)
    b = SurroundingRectangle(t, buff=0.22, corner_radius=0.18, fill_color='#10223f', fill_opacity=0.92, stroke_color=color, stroke_width=4)
    return VGroup(b, t)


# ------------------------------------------------------------ actores
class Shark(VGroup):
    def __init__(self, color=SH_TOP, belly=SH_BELLY, fin_h=1.9, wag=True, orca=False, **kw):
        super().__init__(**kw)
        self.tail = VGroup(poly([(-2.85, 0.05), (-3.9, 1.35), (-3.55, 0.0), (-3.9, -1.1)], color))
        body = smooth([(3, 0), (2.1, 0.55), (0.5, 0.88), (-1.5, 0.6), (-2.9, 0.12), (-2.9, -0.08), (-1.5, -0.48), (0.5, -0.74), (2.1, -0.45)], color)
        bel = smooth([(2.8, -0.12), (1.5, -0.42), (0, -0.6), (-1.8, -0.4), (-2.7, -0.1), (-1, -0.12), (1, -0.08)], belly, sw=0)
        self.dorsal = poly([(0.6, 0.84), (-0.15, fin_h), (-0.65, 0.78)], color)
        self.pectoral = poly([(0.95, -0.55), (0.05, -1.5), (0.45, -0.58)], color)
        self.eye = VGroup(Dot([2.1, 0.22, 0], radius=0.09, color='#0b0f18'), Dot([2.13, 0.25, 0], radius=0.03, color=WHITE))
        self.gills = VGroup(*[Arc(radius=0.32, start_angle=-0.9, angle=1.8, color=SH_LINE, stroke_width=3).move_to([1.15 + 0.14 * k, -0.05, 0]) for k in range(5)])
        self.mouth = ArcBetweenPoints(np.array([2.75, -0.22, 0]), np.array([1.95, -0.34, 0]), angle=-0.4, color=SH_LINE, stroke_width=4)
        self.nostril = Ellipse(width=0.16, height=0.07, fill_color='#1b2532', fill_opacity=1, stroke_width=0).move_to([2.72, 0.02, 0])
        self.lateral = DashedLine([2.2, 0.08, 0], [-2.6, 0.06, 0], dash_length=0.08, color='#9fb7cc', stroke_width=3)
        rnd = random.Random(3)
        self.ampullae = VGroup(*[Dot([rnd.uniform(2.3, 2.95), rnd.uniform(-0.18, 0.2), 0], radius=0.025, color='#1b2532') for _ in range(26)])
        parts = [self.tail, self.pectoral, body, bel, self.dorsal, self.gills, self.mouth, self.lateral, self.ampullae, self.nostril, self.eye]
        if orca:
            patch = smooth([(1.7, 0.42), (1.3, 0.55), (0.9, 0.42), (1.3, 0.35)], WHITE, sw=0)
            parts.insert(5, patch)
            self.lateral.set_opacity(0)
            self.ampullae.set_opacity(0)
        self.add(*parts)
        self.t0 = random.random() * 5
        if wag:
            self.add_updater(Shark._wag)

    @staticmethod
    def _wag(m, dt):
        m.t0 += dt
        piv = m.tail[0].get_vertices()[0]
        m.tail.rotate(0.9 * dt * math.cos(m.t0 * 5.5), about_point=piv)


class Seal(VGroup):
    def __init__(self, **kw):
        super().__init__(**kw)
        c = '#7d6b58'
        body = smooth([(1.0, 0.1), (0.4, 0.35), (-0.6, 0.3), (-1.3, 0.05), (-0.6, -0.25), (0.4, -0.3)], c)
        head = Circle(radius=0.36, fill_color=c, fill_opacity=1, stroke_color='#3b2f24', stroke_width=3).move_to([1.15, 0.15, 0])
        eye = Dot([1.3, 0.28, 0], radius=0.06, color='#111')
        nose = Dot([1.5, 0.12, 0], radius=0.05, color='#222')
        wh = VGroup(*[Line([1.45, 0.08, 0], [1.85, 0.08 + d, 0], color='#ddd', stroke_width=2) for d in (-0.1, 0, 0.1)])
        fl = VGroup(poly([(-1.25, 0.05), (-1.75, 0.35), (-1.65, -0.25)], c, stroke='#3b2f24'), poly([(0.3, -0.25), (0.1, -0.65), (0.55, -0.3)], c, stroke='#3b2f24'))
        self.add(fl, body, head, eye, nose, wh)
        self.t0 = random.random()
        self.add_updater(lambda m, dt: m.shift(UP * 0.06 * math.sin((setattr(m, 't0', m.t0 + dt) or m.t0) * 3) * dt))


class Fish(VGroup):
    def __init__(self, color='#ff9f43', **kw):
        super().__init__(**kw)
        self.add(poly([(-0.35, 0), (-0.65, 0.22), (-0.65, -0.22)], color, sw=2),
                 Ellipse(width=0.8, height=0.36, fill_color=color, fill_opacity=1, stroke_color='#5a3412', stroke_width=2),
                 Dot([0.22, 0.05, 0], radius=0.035, color='#111'))


class Diver(VGroup):
    def __init__(self, **kw):
        super().__init__(**kw)
        suit = '#1d2b3a'
        tank = RoundedRectangle(width=0.35, height=1.0, corner_radius=0.15, fill_color='#f2b705', fill_opacity=1, stroke_width=2).move_to([-0.28, 0.35, 0])
        body = RoundedRectangle(width=0.5, height=1.1, corner_radius=0.22, fill_color=suit, fill_opacity=1, stroke_color='#0b1118', stroke_width=2).move_to([0, 0.3, 0])
        head = Circle(radius=0.28, fill_color='#f0c8a0', fill_opacity=1, stroke_width=2).move_to([0, 1.1, 0])
        mask = RoundedRectangle(width=0.4, height=0.2, corner_radius=0.08, fill_color='#5fd0ff', fill_opacity=0.9, stroke_color='#111', stroke_width=2).move_to([0.06, 1.12, 0])
        legs = VGroup(Line([-0.1, -0.2, 0], [-0.2, -1.0, 0], color=suit, stroke_width=14), Line([0.1, -0.2, 0], [0.2, -1.0, 0], color=suit, stroke_width=14))
        fins = VGroup(poly([(-0.2, -1.0), (-0.55, -1.35), (0.05, -1.25)], '#1fa2ff', sw=2), poly([(0.2, -1.0), (-0.05, -1.3), (0.55, -1.3)], '#1fa2ff', sw=2))
        arms = VGroup(Line([0, 0.65, 0], [0.55, 0.2, 0], color=suit, stroke_width=12), Line([0, 0.65, 0], [-0.45, 0.1, 0], color=suit, stroke_width=12))
        self.add(tank, legs, fins, body, arms, head, mask)


def bubbles(n=24, area=(-8, 8, -5, 5), seed=1):
    rnd = random.Random(seed)
    g = VGroup(*[Circle(radius=rnd.uniform(0.03, 0.09), stroke_color='#bfe9ff', stroke_width=2, stroke_opacity=0.6).move_to(
        [rnd.uniform(area[0], area[1]), rnd.uniform(area[2], area[3]), 0]) for _ in range(n)])

    def up(m, dt):
        for b in m:
            b.shift(UP * 0.6 * dt)
            if b.get_y() > area[3]:
                b.set_y(area[2])
    g.add_updater(up)
    return g


# ------------------------------------------------------------ escena base
class Base(MovingCameraScene):
    sc, dur, idx = None, 5.0, 0

    def P(self, *a, rt=1.0, **kw):
        if getattr(self, 'hdr', None) is not None:
            self.bring_to_front(self.hdr)
        self.play(*a, run_time=rt, **kw)
        self.used += rt

    def W(self, t):
        if t > 0.02:
            self.wait(t)
            self.used += t

    def until(self, f):
        self.W(self.dur * f - self.used)

    def ocean(self, top='#1b6fae', bot='#04162d', rays=True, seabed=False, surface=False, dots=True):
        r = Rectangle(width=40, height=24).set_fill([bot, top], opacity=1).set_stroke(width=0)
        r.set_sheen_direction(UP)
        self.add(r)
        if rays:
            rs = VGroup(*[Polygon([x, 6, 0], [x + 0.8, 6, 0], [x - 2.5, -6, 0], [x - 4.5, -6, 0], fill_color=WHITE, fill_opacity=0.045, stroke_width=0) for x in (-6, -2.5, 1, 4.5, 8)])
            rs.add_updater(lambda m, dt: m.shift(RIGHT * 0.08 * dt))
            self.add(rs)
        if dots:
            rnd = random.Random(self.idx)
            ds = VGroup(*[Dot([rnd.uniform(-9, 9), rnd.uniform(-5, 5), 0], radius=rnd.uniform(0.01, 0.035), color='#cfefff', fill_opacity=rnd.uniform(0.2, 0.5)) for _ in range(70)])
            ds.add_updater(lambda m, dt: m.shift(UP * 0.05 * dt + LEFT * 0.03 * dt))
            self.add(ds)
        if seabed:
            sand = smooth([(-12, -3.2), (-6, -2.9), (0, -3.3), (6, -2.8), (12, -3.1), (12, -8), (-12, -8)], '#c9a86a', stroke='#8b6e3c')
            rocks = VGroup(*[Ellipse(width=w, height=h, fill_color='#5b6470', fill_opacity=1, stroke_color='#2c3138', stroke_width=3).move_to([x, -3.0, 0]) for x, w, h in ((-5, 1.6, 0.9), (4.5, 2.2, 1.2), (6, 1.0, 0.6))])
            weeds = VGroup()
            for x in (-6.2, -4.3, 3.6, 5.3, -1.5):
                wd = VMobject(color='#2fae66', stroke_width=7)
                wd.set_points_smoothly([np.array([x, -3.1, 0]), np.array([x + 0.2, -2.3, 0]), np.array([x - 0.1, -1.5, 0]), np.array([x + 0.15, -0.9, 0])])
                wd.x0 = x
                weeds.add(wd)
            t0 = [0.0]

            def sway(m, dt):
                t0[0] += dt
                for k, wd in enumerate(m):
                    wd.rotate(0.12 * dt * math.cos(t0[0] * 1.6 + k), about_point=np.array([wd.x0, -3.1, 0]))
            weeds.add_updater(sway)
            self.add(sand, rocks, weeds)
        if surface:
            sky = Rectangle(width=40, height=10).set_fill(['#bfe6ff', '#6cc4ff'], opacity=1).set_stroke(width=0).move_to(UP * 7.5)
            sky.set_sheen_direction(DOWN)
            t0 = [0.0]

            def wave():
                return FunctionGraph(lambda x: 2.5 + 0.08 * math.sin(1.6 * x + t0[0] * 2), x_range=[-20, 20], color='#e8f7ff', stroke_width=5)
            wv = always_redraw(wave)
            wv.add_updater(lambda m, dt: t0.__setitem__(0, t0[0] + dt))
            self.add(sky, wv)

    def header(self):
        k = fit(T(self.sc['titulo'].upper(), 30, GOLD_, HEAVY), 7)
        bx = SurroundingRectangle(k, buff=0.18, corner_radius=0.12, fill_color='#000000', fill_opacity=0.45, stroke_width=0)
        g = VGroup(bx, k).to_corner(UL, buff=0.4)
        g.fix_in_frame() if hasattr(g, 'fix_in_frame') else None
        self.add(g)
        self.hdr = g
        self.play(FadeIn(g, shift=RIGHT * 0.4), run_time=0.35)
        self.used += 0.35
        return g

    def construct(self):
        self.used = 0.0
        fr = self.camera.frame
        fr.scale(1.08)
        fr.add_updater(lambda m, dt: m.scale(1 - 0.06 * dt) if m.width > config.frame_width * 1.0005 else None)
        getattr(self, 's_' + self.sc['tipo'])()
        rest = self.dur - self.used - 0.25
        if rest > 0:
            self.wait(rest)
        blk = Rectangle(width=60, height=40, fill_color=BLACK, fill_opacity=1, stroke_width=0).move_to(fr.get_center())
        self.play(FadeIn(blk), run_time=0.25)

    # ============================================================ planos
    def s_caza_superficie(self):
        self.ocean(top='#2a86c7', bot='#020a18', surface=True)
        seal = Seal().scale(0.9).move_to([-6, 2.3, 0])
        sh = Shark().scale(0.8).move_to([3, -3.2, 0]).set_opacity(0.35)
        self.add(sh, seal)
        self.P(seal.animate.move_to([1, 2.3, 0]), sh.animate.shift(LEFT * 1.5), rt=self.dur * 0.45, rate_func=linear)
        self.P(self.camera.frame.animate.move_to(sh).scale(0.7), sh.animate.set_opacity(0.8), rt=self.dur * 0.3)
        self.P(Indicate(sh.eye, color=RED_, scale_factor=3), rt=0.8)

    def s_caza_salto(self):
        self.ocean(top='#2a86c7', bot='#020a18', surface=True)
        seal = Seal().scale(0.9).move_to([1.5, 2.35, 0])
        sh = Shark().scale(0.9).rotate(PI / 2.6).move_to([-1, -6, 0])
        self.add(seal, sh)
        self.P(seal.animate.shift(RIGHT * 0.6), rt=self.dur * 0.15)
        self.P(sh.animate.move_to([1.2, 1.2, 0]), rt=self.dur * 0.15, rate_func=rush_into)
        splash = VGroup(*[Line([1.5, 2.5, 0], [1.5 + math.cos(a) * 2, 2.5 + abs(math.sin(a)) * 2.4, 0], color='#e8f7ff', stroke_width=8) for a in np.linspace(0.3, PI - 0.3, 9)])
        drops = VGroup(*[Dot([1.5 + random.uniform(-2, 2), 2.6 + random.uniform(0, 2.5), 0], radius=0.07, color='#e8f7ff') for _ in range(30)])
        self.remove(seal)
        sh.add(seal.copy().scale(0.7).move_to(sh.get_center() + np.array([0.6, 1.4, 0])))
        self.P(sh.animate.move_to([1.6, 4.6, 0]).rotate(-0.4), Create(splash), FadeIn(drops, scale=0.3), self.camera.frame.animate.shift(UP * 1.2), rt=0.9)
        self.P(Wiggle(self.camera.frame, scale_value=1.02, rotation_angle=0.01), rt=0.5)
        self.P(sh.animate.move_to([2.5, 0.5, 0]).rotate(-1.4), FadeOut(splash), drops.animate.shift(DOWN * 2).set_opacity(0), self.camera.frame.animate.shift(DOWN * 1.2), rt=1.0)

    def s_titulo(self):
        self.ocean(seabed=True)
        sh = Shark().scale(0.8).move_to([-10, -0.5, 0])
        self.add(sh)
        self.P(sh.animate.move_to([10, -0.3, 0]), rt=self.dur * 0.55, rate_func=linear)
        t1 = T('CÓMO CAZA', 90, WHITE)
        t2 = T('EL TIBURÓN BLANCO', 110, GOLD_).next_to(t1, DOWN, buff=0.25)
        g = VGroup(t1, t2).move_to(UP * 0.5)
        fit(g, 12.5)
        for m in g:
            m.set_stroke(BLACK, width=8, background=True)
        self.P(LaggedStart(*[FadeIn(c, shift=DOWN * 0.8, scale=1.5) for c in t1], lag_ratio=0.05), rt=0.8)
        self.P(LaggedStart(*[FadeIn(c, shift=UP * 0.8, scale=1.5) for c in t2], lag_ratio=0.04), rt=0.9)
        self.P(g.animate.scale(1.06), rt=1.0)

    def s_tamano_buzo(self):
        self.ocean(seabed=True)
        self.header()
        d = Diver().scale(0.8).move_to([-5.2, 0, 0])
        sh = Shark(wag=True).scale(1.0).move_to([1.5, 0.3, 0])
        self.add(d)
        self.P(FadeIn(d, shift=UP), rt=0.6)
        self.until(0.25)
        self.P(FadeIn(sh, shift=LEFT * 3), rt=1.0)
        self.until(0.45)
        ruler = DoubleArrow(sh.get_left() + DOWN * 1.7, sh.get_right() + DOWN * 1.7, color=GOLD_, buff=0, stroke_width=6)
        lab = pill('6 METROS').next_to(ruler, DOWN, buff=0.2)
        self.P(GrowFromCenter(ruler), FadeIn(lab, scale=0.5), rt=0.8)
        self.until(0.75)
        kg = pill('≈ 2 TONELADAS', RED_).next_to(sh, UP, buff=0.4)
        self.P(FadeIn(kg, scale=0.5), rt=0.5)

    def s_hidrodinamica(self):
        self.ocean()
        self.header()
        sh = Shark().scale(1.1).move_to([0, 0, 0])
        self.add(sh)
        lines = VGroup()
        for y in np.linspace(-2.5, 2.5, 9):
            ln = VMobject(color='#9fe3ff', stroke_width=3, stroke_opacity=0.7)
            bump = 1.1 * math.exp(-y * y / 1.2) * np.sign(y)
            ln.set_points_smoothly([np.array([8, y, 0]), np.array([3.3, y, 0]), np.array([0, y + bump * 0.6, 0]), np.array([-3.5, y + bump * 0.2, 0]), np.array([-8, y, 0])])
            lines.add(ln)
        self.P(LaggedStart(*[Create(l) for l in lines], lag_ratio=0.08), rt=2.0)
        flow = VGroup(*[Dot(radius=0.05, color=WHITE).move_to(l.point_from_proportion(0)) for l in lines])
        tr = ValueTracker(0)
        flow.add_updater(lambda m: [d.move_to(lines[k].point_from_proportion(tr.get_value() % 1)) for k, d in enumerate(m)])
        self.add(flow)
        lab = pill('EL AGUA SE DESLIZA').to_edge(DOWN, buff=1.6)
        self.P(tr.animate.set_value(3), FadeIn(lab, shift=UP), self.camera.frame.animate.scale(0.9), rt=max(1, self.dur * 0.6), rate_func=linear)

    def s_piel_zoom(self):
        self.ocean()
        self.header()
        sh = Shark().scale(1.1)
        self.add(sh)
        spot = sh.get_center() + np.array([-0.5, 0.3, 0])
        self.until(0.2)
        self.P(self.camera.frame.animate.scale(0.45).move_to(spot), rt=1.4)
        circ = Circle(radius=2.2, fill_color='#53697e', fill_opacity=1, stroke_color=GOLD_, stroke_width=8).move_to(self.camera.frame.get_center() + RIGHT * 0.0)
        circ.scale(0.45)
        den = VGroup()
        for i in range(-3, 4):
            for j in range(-3, 4):
                p = circ.get_center() + np.array([i * 0.13 + (j % 2) * 0.065, j * 0.11, 0])
                if np.linalg.norm(p - circ.get_center()) < 0.9:
                    den.add(Polygon(p + [0.05, 0, 0], p + [-0.04, 0.045, 0], p + [-0.04, -0.045, 0], fill_color='#c8d4de', fill_opacity=1, stroke_color='#22344a', stroke_width=1))
        self.until(0.45)
        self.P(GrowFromCenter(circ), rt=0.6)
        self.P(LaggedStart(*[FadeIn(d, scale=0.2) for d in den], lag_ratio=0.02), rt=1.5)
        lab = T('ESCAMAS EN FORMA DE DIENTE', 14, GOLD_).next_to(circ, DOWN, buff=0.1)
        self.P(FadeIn(lab), rt=0.4)

    def s_branquias(self):
        self.ocean()
        self.header()
        sh = Shark().scale(1.3).move_to([-1, 0, 0])
        self.add(sh)
        self.P(self.camera.frame.animate.scale(0.6).move_to(sh.gills.get_center() + RIGHT * 0.8), rt=1.0)
        self.P(LaggedStart(*[Indicate(g, color=RED_, scale_factor=1.4) for g in sh.gills], lag_ratio=0.15), rt=1.4)
        self.until(0.4)
        arrows = VGroup()
        for k in range(4):
            a = CurvedArrow(sh.mouth.get_start() + RIGHT * 1.2 + UP * 0.1 * k, sh.gills.get_center() + DOWN * 0.1 * k, angle=0.6, color=CYAN_, stroke_width=4)
            arrows.add(a)
        self.P(LaggedStart(*[Create(a) for a in arrows], lag_ratio=0.2), rt=1.6)
        o2 = pill('O₂', CYAN_, 30).next_to(sh.gills, UP, buff=0.4)
        self.P(FadeIn(o2, shift=UP * 0.5), rt=0.5)

    def s_nadar_respirar(self):
        self.ocean(seabed=True)
        self.header()
        sh = Shark().scale(0.8).move_to([-7, 0, 0])
        self.add(sh)
        bar = Rectangle(width=0.5, height=3, stroke_color=WHITE, stroke_width=3).move_to([6, 0.5, 0])
        lvl = ValueTracker(1.0)
        fill = always_redraw(lambda: Rectangle(width=0.44, height=2.94 * lvl.get_value(), fill_color=interpolate_color(ManimColor(RED_), ManimColor(CYAN_), lvl.get_value()), fill_opacity=1, stroke_width=0).move_to(bar).align_to(bar, DOWN).shift(UP * 0.03))
        lab = T('OXÍGENO', 24, WHITE).next_to(bar, DOWN)
        self.add(bar, fill, lab)
        self.P(sh.animate.move_to([1.5, 0, 0]), rt=self.dur * 0.45, rate_func=linear)
        self.until(0.55)
        sh.clear_updaters()
        self.P(lvl.animate.set_value(0.12), sh.animate.rotate(-0.3).shift(DOWN * 0.8), rt=self.dur * 0.25)
        x = T('!', 120, RED_).move_to([6, 2.7, 0])
        self.P(FadeIn(x, scale=2), Flash(bar, color=RED_), rt=0.6)

    def s_calor(self):
        self.ocean(top='#1d5d8f', bot='#04162d')
        self.header()
        sh = Shark(wag=False).scale(1.2)
        self.add(sh)
        heat = VGroup(*[Ellipse(width=w, height=h, fill_color=c, fill_opacity=0.55, stroke_width=0).move_to(sh.get_center() + np.array([0.3, -0.05, 0])) for w, h, c in ((5.2, 1.6, '#ffb347'), (3.8, 1.1, '#ff7b39'), (2.2, 0.7, '#ff3b2f'))])
        self.until(0.25)
        self.P(LaggedStart(*[FadeIn(hh, scale=0.3) for hh in heat], lag_ratio=0.3), rt=2.0)
        th1 = pill('AGUA: 15 °C', CYAN_).move_to([-4.5, 2.6, 0])
        th2 = pill('MÚSCULOS: MÁS CALIENTES', RED_).move_to([3.5, -2.6, 0])
        self.until(0.55)
        self.P(FadeIn(th1, shift=DOWN), rt=0.6)
        self.P(FadeIn(th2, shift=UP), rt=0.6)

    def s_calor_ventaja(self):
        self.ocean(top='#5aa7d6', bot='#0a2440')
        self.header()
        flakes = VGroup(*[T('❄', 30, '#e8f7ff', NORMAL).move_to([random.uniform(-8, 8), random.uniform(-4, 4), 0]).set_opacity(0.5) for _ in range(14)])
        self.add(flakes)
        sh = Shark().scale(0.8).move_to([-9, 0.5, 0])
        slow = Fish('#9aa5b1').scale(1.4).move_to([-8, -2, 0])
        self.add(sh, slow)
        speed = VGroup(*[Line([0, 0, 0], [-2, 0, 0], color=WHITE, stroke_width=3, stroke_opacity=0.6) for _ in range(4)])
        self.P(sh.animate.move_to([9, 0.5, 0]), slow.animate.move_to([-3, -2, 0]), rt=self.dur * 0.6, rate_func=linear)
        lab = pill('MÁS RÁPIDO EN AGUA FRÍA').to_edge(DOWN, buff=1.4)
        self.P(FadeIn(lab, scale=0.6), rt=0.6)

    def s_sentidos_iconos(self):
        self.ocean()
        self.header()
        sh = Shark().scale(0.75)
        self.add(sh)
        names = ['OLFATO', 'OÍDO', 'LÍNEA LATERAL', 'VISTA', 'ELECTRICIDAD']
        cols = [GOLD_, CYAN_, '#7ee081', WHITE, '#b388ff']
        for k, (n, c) in enumerate(zip(names, cols)):
            self.until(0.25 + k * 0.12)
            ang = PI / 2 + k * TAU / 5
            p = pill(n, c, 28).move_to(sh.get_center() + np.array([4.2 * math.cos(ang), 2.6 * math.sin(ang), 0]))
            self.P(FadeIn(p, scale=0.3), rt=0.4)

    def s_olfato_nariz(self):
        self.ocean()
        self.header()
        sh = Shark().scale(1.3).move_to([-2, 0, 0])
        self.add(sh)
        self.P(self.camera.frame.animate.scale(0.45).move_to(sh.nostril.get_center() + RIGHT * 0.6), rt=1.2)
        self.P(Indicate(sh.nostril, color=GOLD_, scale_factor=3), rt=0.8)
        mol = VGroup(*[Dot(radius=0.03, color=GOLD_).move_to(sh.nostril.get_center() + np.array([random.uniform(0.5, 2), random.uniform(-0.6, 0.6), 0])) for _ in range(30)])
        self.add(mol)
        self.P(*[d.animate.move_to(sh.nostril.get_center()).set_opacity(0) for d in mol], rt=max(1, self.dur * 0.5), rate_func=rate_functions.smooth)

    def s_olfato_rastro(self):
        self.ocean(seabed=True)
        self.header()
        drop = Dot([6, 1.5, 0], radius=0.18, color='#c0182a')
        self.P(FadeIn(drop, scale=2), rt=0.5)
        cloud = VGroup(*[Dot([6, 1.5, 0], radius=random.uniform(0.04, 0.1), color='#d43a4a', fill_opacity=0.6) for _ in range(90)])
        self.add(cloud)
        self.P(*[d.animate.move_to([6 - random.uniform(0, 11), 1.5 + random.uniform(-1, 1) * (0.2 + 0.2 * random.random()), 0]).set_opacity(0.25) for d in cloud], rt=self.dur * 0.3)
        sh = Shark().scale(0.6).move_to([-8, 1.2, 0])
        self.add(sh)
        path = VMobject().set_points_smoothly([np.array(p) for p in ([-8, 1.2, 0], [-5, 2.0, 0], [-2, 1.0, 0], [1, 2.0, 0], [4, 1.3, 0], [5.6, 1.5, 0])])
        self.P(MoveAlongPath(sh, path), rt=self.dur * 0.45, rate_func=rate_functions.smooth)

    def s_oido_ondas(self):
        self.ocean()
        self.header()
        f = Fish('#ff7b7b').scale(1.3).move_to([5.5, 1.5, 0])
        f.add_updater(lambda m, dt: m.rotate(0.6 * math.sin(self.renderer.time * 18) * dt))
        sh = Shark().scale(0.5).move_to([-5.5, -1.5, 0])
        self.add(f, sh)
        self.until(0.2)
        for k in range(5):
            ring = Circle(radius=0.3, color='#9fe3ff', stroke_width=5).move_to(f)
            self.play(ring.animate.scale(36).set_stroke(opacity=0), run_time=0.9)
            self.used += 0.9
        lab = pill('CIENTOS DE METROS', CYAN_).move_to([0, -3, 0])
        self.P(FadeIn(lab, scale=0.5), Indicate(sh, color=GOLD_), rt=0.8)

    def s_linea_lateral(self):
        self.ocean()
        self.header()
        sh = Shark().scale(1.4)
        self.add(sh)
        self.P(self.camera.frame.animate.scale(0.75), rt=1.0)
        self.until(0.3)
        dots = VGroup(*[Dot(interpolate(sh.lateral.get_start(), sh.lateral.get_end(), u), radius=0.07, color='#7ee081') for u in np.linspace(0, 1, 26)])
        self.P(LaggedStart(*[FadeIn(d, scale=3) for d in dots], lag_ratio=0.05), rt=1.8)
        lab = pill('LÍNEA LATERAL', '#7ee081').next_to(sh, DOWN, buff=0.8)
        self.P(FadeIn(lab, shift=UP), rt=0.5)
        self.P(LaggedStart(*[Indicate(d, color=WHITE, scale_factor=2) for d in dots], lag_ratio=0.03), rt=1.5)

    def s_linea_ondas(self):
        self.ocean()
        self.header()
        sh = Shark().scale(0.9).move_to([-2.5, -0.5, 0])
        f = Fish('#ffd166').scale(1.2).move_to([4.5, 2.2, 0])
        f.add_updater(lambda m, dt: m.rotate(0.5 * math.sin(self.renderer.time * 12) * dt))
        self.add(sh, f)
        for k in range(4):
            ring = Circle(radius=0.3, color='#ffd166', stroke_width=4).move_to(f)
            self.play(ring.animate.scale(22).set_stroke(opacity=0), run_time=0.8)
            self.used += 0.8
        hit = Dot(interpolate(sh.lateral.get_start(), sh.lateral.get_end(), 0.35), radius=0.15, color='#7ee081')
        self.P(Flash(hit, color='#7ee081', flash_radius=0.6), FadeIn(hit, scale=3), rt=0.7)
        arr = Arrow(hit.get_center(), f.get_center(), color=GOLD_, buff=0.3)
        self.P(GrowArrow(arr), rt=0.6)

    def s_ojo_tapetum(self):
        self.ocean(top='#0e3b63', bot='#020a18')
        self.header()
        eye = Circle(radius=2.2, fill_color='#0b0f18', fill_opacity=1, stroke_color='#6f8aa3', stroke_width=14).move_to([1, 0, 0])
        lens = Circle(radius=0.7, fill_color='#24485f', fill_opacity=1, stroke_width=0).move_to([-0.6, 0, 0])
        mirror = Arc(radius=2.0, start_angle=-0.9, angle=1.8, color='#d7f7ff', stroke_width=10).move_to([2.4, 0, 0])
        self.P(GrowFromCenter(eye), FadeIn(lens), rt=0.8)
        self.until(0.3)
        self.P(Create(mirror), rt=0.7)
        ray = Line([-7, 0.6, 0], [2.95, 0.15, 0], color=GOLD_, stroke_width=6)
        back = Line([2.95, 0.15, 0], [-7, -0.6, 0], color=GOLD_, stroke_width=6, stroke_opacity=0.7)
        self.P(Create(ray), rt=0.8)
        self.P(Create(back), Flash(mirror, color=WHITE), rt=0.8)
        lab = pill('UN ESPEJO DENTRO DEL OJO').to_edge(DOWN, buff=1.4)
        self.P(FadeIn(lab, shift=UP), rt=0.5)

    def s_ampollas_hocico(self):
        self.ocean()
        self.header()
        sh = Shark().scale(1.4).move_to([-2.5, 0, 0])
        self.add(sh)
        self.until(0.25)
        self.P(self.camera.frame.animate.scale(0.35).move_to(sh.ampullae.get_center()), rt=1.4)
        self.P(*[d.animate.set_color('#b388ff').scale(2) for d in sh.ampullae], rt=0.8)
        lab = T('AMPOLLAS DE LORENZINI', 12, '#b388ff').next_to(sh.ampullae, UP, buff=0.15)
        self.P(FadeIn(lab, shift=DOWN * 0.1), rt=0.5)
        self.P(LaggedStart(*[Flash(d, color='#b388ff', flash_radius=0.08, line_length=0.05) for d in sh.ampullae[:10]], lag_ratio=0.1), rt=1.2)

    def s_ampollas_campo(self):
        self.ocean(seabed=True)
        self.header()
        f = Fish('#ffb347').scale(1.2).move_to([1.5, -3.15, 0])
        self.add(f)
        heart = T('♥', 36, RED_, NORMAL).move_to(f.get_center() + UP * 0.05)
        self.P(FadeIn(heart, scale=0.4), rt=0.4)
        self.until(0.35)
        for k in range(4):
            rings = VGroup(*[Circle(radius=0.2, color='#b388ff', stroke_width=4).move_to(f) for _ in range(1)])
            self.play(rings.animate.scale(14).set_stroke(opacity=0), heart.animate.scale(1.4), run_time=0.45)
            self.play(heart.animate.scale(1 / 1.4), run_time=0.35)
            self.used += 0.8
        sh = Shark().scale(0.7).rotate(-0.3).move_to([-5, 0.5, 0])
        self.P(FadeIn(sh, shift=RIGHT * 2), rt=0.8)

    def s_ampollas_ataque(self):
        self.ocean(seabed=True)
        self.header()
        f = Fish('#ffb347').scale(1.0).move_to([2, -3.2, 0]).set_opacity(0.4)
        sh = Shark().scale(0.8).rotate(-0.5).move_to([-6, 2, 0])
        self.add(f, sh)
        field = VGroup(*[Circle(radius=r, color='#b388ff', stroke_width=3, stroke_opacity=0.5).move_to(f) for r in (0.5, 1.0, 1.5)])
        self.P(Create(field), rt=0.8)
        self.until(0.45)
        self.P(sh.animate.move_to([1.2, -2.2, 0]), rt=self.dur * 0.2, rate_func=rush_into)
        sand = VGroup(*[Dot(f.get_center() + np.array([random.uniform(-0.3, 0.3), 0, 0]), radius=0.06, color='#e3c27a') for _ in range(30)])
        self.add(sand)
        self.P(*[d.animate.shift(np.array([random.uniform(-2, 2), random.uniform(0.5, 2.5), 0])).set_opacity(0) for d in sand], Wiggle(self.camera.frame, scale_value=1.02), FadeOut(f), FadeOut(field), rt=0.9)

    def s_radar_capas(self):
        self.ocean(top='#0e3b63', bot='#020a18', rays=False)
        self.header()
        center = np.array([3, -0.9, 0])
        rings = [(3.9, 'OÍDO Y OLFATO', CYAN_), (2.7, 'LÍNEA LATERAL Y VISTA', '#7ee081'), (1.4, 'ELECTRICIDAD', '#b388ff')]
        f = Fish('#ffd166').scale(0.8).move_to(center)
        self.add(f)
        sh = Shark().scale(0.35).move_to(center + LEFT * 6)
        self.add(sh)
        for k, (r, n, c) in enumerate(rings):
            self.until(0.15 + k * 0.25)
            ring = Circle(radius=r, color=c, stroke_width=5).move_to(center)
            lab = T(n, 24, c).next_to(ring, UP, buff=0.05) if k == 0 else T(n, 22, c).move_to(center + UP * (r - 0.3))
            self.P(Create(ring), FadeIn(lab), sh.animate.move_to(center + LEFT * (r - 0.4)), rt=0.9)

    def s_boca_dientes(self):
        self.ocean()
        self.header()
        head = Ellipse(width=6.5, height=5.2, fill_color=SH_TOP, fill_opacity=1, stroke_color=SH_LINE, stroke_width=5).shift(DOWN * 0.3)
        mouth = Ellipse(width=4.2, height=0.3, fill_color='#5a1a22', fill_opacity=1, stroke_color='#2a0a10', stroke_width=4).shift(DOWN * 1.0)
        eyes = VGroup(Dot([-2.0, 1.0, 0], radius=0.18, color='#0b0f18'), Dot([2.0, 1.0, 0], radius=0.18, color='#0b0f18'))
        self.add(head, eyes, mouth)
        self.until(0.2)
        self.P(mouth.animate.stretch_to_fit_height(2.6), rt=0.7)
        teeth = VGroup()
        for row in range(3):
            for i in range(11):
                x = -1.8 + i * 0.36
                yt = -0.05 - row * 0.28
                teeth.add(Polygon([x - 0.14, yt, 0], [x + 0.14, yt, 0], [x, yt - 0.42, 0], fill_color=WHITE, fill_opacity=1 - row * 0.25, stroke_color='#bbb', stroke_width=1))
                yb = -1.95 + row * 0.28
                teeth.add(Polygon([x - 0.14, yb, 0], [x + 0.14, yb, 0], [x, yb + 0.42, 0], fill_color=WHITE, fill_opacity=1 - row * 0.25, stroke_color='#bbb', stroke_width=1))
        self.P(LaggedStart(*[GrowFromEdge(t, UP) for t in teeth], lag_ratio=0.01), rt=1.5)
        lab = pill('≈ 300 DIENTES').to_edge(DOWN, buff=0.9)
        self.P(FadeIn(lab, scale=0.5), self.camera.frame.animate.scale(0.85), rt=0.8)

    def s_diente_zoom(self):
        self.ocean(rays=False)
        self.header()
        tooth = Polygon([-1.6, 2, 0], [1.6, 2, 0], [0, -2.2, 0], fill_color='#f4f1e8', fill_opacity=1, stroke_color='#b8b2a0', stroke_width=5).shift(LEFT * 2.5)
        self.P(DrawBorderThenFill(tooth), rt=1.0)
        self.until(0.3)
        saw = VGroup()
        for s in (-1, 1):
            for k in range(10):
                u = k / 10
                p = np.array([s * 1.6 * (1 - u), 2 - 4.2 * u, 0]) + LEFT * 2.5
                saw.add(Polygon(p, p + np.array([s * 0.18, -0.1, 0]), p + np.array([0, -0.38, 0]), fill_color='#e6e0cf', fill_opacity=1, stroke_width=1))
        self.P(LaggedStart(*[FadeIn(z, scale=0.3) for z in saw], lag_ratio=0.04), rt=1.2)
        knife = VGroup(Polygon([0, 0, 0], [3.6, 0, 0], [3.6, 0.7, 0], [0.4, 0.5, 0], fill_color='#cfd8dc', fill_opacity=1, stroke_width=2),
                       RoundedRectangle(width=1.4, height=0.5, corner_radius=0.15, fill_color='#6d4c41', fill_opacity=1).move_to([4.3, 0.35, 0])).move_to([3.5, 0, 0])
        self.until(0.55)
        self.P(FadeIn(knife, shift=LEFT), rt=0.7)
        lab = pill('PARA CORTAR').next_to(knife, DOWN, buff=0.5)
        self.P(FadeIn(lab), rt=0.4)

    def s_cinta_dientes(self):
        self.ocean(rays=False)
        self.header()
        gum = RoundedRectangle(width=11, height=3.4, corner_radius=1.2, fill_color='#c85a6a', fill_opacity=1, stroke_color='#7a2a36', stroke_width=5).shift(DOWN * 0.6)
        self.add(gum)
        rows = VGroup()
        for r in range(4):
            row = VGroup(*[Polygon([x - 0.3, 0, 0], [x + 0.3, 0, 0], [x, 0.9 - r * 0.12, 0], fill_color=WHITE, fill_opacity=1 - r * 0.2, stroke_color='#aaa', stroke_width=2) for x in np.arange(-4.5, 4.6, 0.9)])
            row.shift(UP * (0.6 - r * 0.75) + DOWN * 0.6)
            rows.add(row)
        self.P(LaggedStart(*[FadeIn(rw, shift=UP * 0.3) for rw in rows], lag_ratio=0.2), rt=1.2)
        self.until(0.4)
        lost = rows[0][5]
        self.P(lost.animate.shift(UP * 3 + RIGHT * 1).rotate(1.5).set_opacity(0), rt=0.8)
        self.P(rows[1][5].animate.move_to(lost.get_center() if False else rows[0][4].get_center() + RIGHT * 0.9), rt=0.8)
        arr = VGroup(*[Arrow(rows[k + 1].get_top() + LEFT * 5.3, rows[k].get_top() + LEFT * 5.3, color=GOLD_, buff=0.05) for k in range(3)])
        self.P(LaggedStart(*[GrowArrow(a) for a in arr], lag_ratio=0.2), rt=0.9)

    def s_contador_dientes(self):
        self.ocean()
        self.header()
        tr = ValueTracker(0)
        num = always_redraw(lambda: T(f'{int(tr.get_value()):,}'.replace(',', '.'), 150, WHITE).move_to(UP * 0.4))
        lab = T('DIENTES EN SU VIDA', 44, GOLD_).move_to(DOWN * 1.6)
        self.add(num)
        teeth = VGroup()
        self.P(tr.animate.set_value(30000), rt=self.dur * 0.55, rate_func=rush_from)
        self.P(FadeIn(lab, shift=UP), Indicate(num, color=GOLD_), rt=0.8)

    def s_mandibula(self):
        self.ocean()
        self.header()
        sh = Shark().scale(1.5).move_to([-1.5, 0, 0])
        self.add(sh)
        self.P(self.camera.frame.animate.scale(0.6).move_to(sh.mouth.get_center() + LEFT * 0.3), rt=1.0)
        jaw = VGroup(Arc(radius=0.6, start_angle=PI, angle=-PI, color='#e9eef2', stroke_width=10), *[Polygon([x - 0.07, 0, 0], [x + 0.07, 0, 0], [x, -0.22, 0], fill_color=WHITE, fill_opacity=1, stroke_width=0) for x in np.linspace(-0.45, 0.45, 7)])
        jaw.move_to(sh.mouth.get_center() + UP * 0.05)
        self.until(0.4)
        self.P(FadeIn(jaw), rt=0.3)
        self.P(jaw.animate.shift(RIGHT * 0.9 + DOWN * 0.1), rt=0.5, rate_func=rush_into)
        self.P(Wiggle(self.camera.frame, scale_value=1.03), rt=0.5)
        lab = T('LA MANDÍBULA SALE HACIA ADELANTE', 18, GOLD_).next_to(jaw, UP, buff=0.4)
        self.P(FadeIn(lab), rt=0.4)

    def s_ojos_giran(self):
        self.ocean(rays=False)
        self.header()
        ball = Circle(radius=2.4, fill_color='#e9eef2', fill_opacity=1, stroke_color=SH_TOP, stroke_width=26)
        pupil = Circle(radius=1.1, fill_color='#0b0f18', fill_opacity=1, stroke_width=0)
        glint = Dot([0.35, 0.4, 0], radius=0.2, color=WHITE)
        self.P(GrowFromCenter(ball), FadeIn(pupil), FadeIn(glint), rt=0.8)
        self.until(0.5)
        self.P(pupil.animate.shift(DOWN * 2.6).set_opacity(0), glint.animate.shift(DOWN * 2.6).set_opacity(0), rt=0.6)
        shield = pill('OJOS PROTEGIDOS', GOLD_).to_edge(DOWN, buff=1.0)
        self.P(FadeIn(shield, scale=0.5), rt=0.5)

    def map_africa(self):
        af = smooth([(-3, 3.5), (0, 3.6), (2.3, 2.2), (3, 0.5), (2.2, -1.2), (1.2, -3.5), (0, -4.2), (-0.8, -3.2), (-1.2, -1.0), (-2.6, 0.3), (-3.6, 1.8)], '#c9a86a', stroke='#8b6e3c')
        return af

    def s_mapa_isla(self):
        self.ocean(top='#2a7fbf', bot='#0a3a66', rays=False)
        self.header()
        af = self.map_africa().move_to([-1, 0.5, 0])
        self.P(DrawBorderThenFill(af), rt=1.0)
        isl = Dot(af.get_bottom() + np.array([0.6, 0.3, 0]), radius=0.12, color='#e7d3a1')
        self.P(self.camera.frame.animate.scale(0.4).move_to(isl), rt=1.4)
        self.P(GrowFromCenter(isl), rt=0.4)
        seals = VGroup(*[Dot(isl.get_center() + np.array([random.uniform(-0.12, 0.12), random.uniform(-0.1, 0.1), 0]), radius=0.02, color='#5a4a3a') for _ in range(25)])
        self.P(LaggedStart(*[FadeIn(s) for s in seals], lag_ratio=0.03), rt=0.8)
        fins = VGroup(*[Triangle(fill_color='#3a4a5a', fill_opacity=1, stroke_width=0).scale(0.06).move_to(isl.get_center() + np.array([math.cos(a) * 0.5, math.sin(a) * 0.4, 0])) for a in np.linspace(0, TAU, 5)])
        self.P(FadeIn(fins), Rotate(fins, angle=PI / 2, about_point=isl.get_center()), rt=1.2)

    def s_caza_vista(self, below=True):
        pass

    def s_emboscada_silueta(self):
        bg = Rectangle(width=40, height=24).set_fill(['#020a18', '#7cc9ff'], opacity=1).set_stroke(width=0)
        bg.set_sheen_direction(UP)
        self.add(bg)
        self.header()
        sun = Circle(radius=1.4, fill_color=WHITE, fill_opacity=0.25, stroke_width=0).move_to([2, 3.2, 0])
        self.add(sun)
        seal = Seal().scale(1.3).set_color('#0b0f18').move_to([-6, 2.6, 0])
        self.add(seal)
        self.P(seal.animate.move_to([1.5, 2.6, 0]), rt=self.dur * 0.55, rate_func=linear)
        tag = pill('SILUETA CONTRA LA LUZ').move_to([0, -0.5, 0])
        self.P(FadeIn(tag, scale=0.5), Circumscribe(seal, color=GOLD_), rt=1.0)

    def s_vista_arriba(self):
        self.ocean(top='#163a57', bot='#0d2638', rays=False)
        self.header()
        sh = Shark().scale(1.0).set_color('#1d3346').move_to([-5, 0, 0])
        sh.set_opacity(0.85)
        self.add(sh)
        self.P(sh.animate.move_to([2, 0, 0]).set_opacity(0.18), rt=self.dur * 0.55, rate_func=linear)
        q = T('?', 140, WHITE).move_to([4.5, 1.5, 0])
        self.P(FadeIn(q, scale=0.4), rt=0.5)
        tag = pill('CAMUFLAJE PERFECTO').to_edge(DOWN, buff=1.2)
        self.P(FadeIn(tag), rt=0.4)

    def s_velocimetro(self):
        self.ocean()
        self.header()
        arc = Arc(radius=2.6, start_angle=PI, angle=-PI, color=WHITE, stroke_width=10).shift(DOWN * 0.6 + RIGHT * 2.5)
        ticks = VGroup(*[Line(arc.get_center() + 2.3 * np.array([math.cos(a), math.sin(a), 0]), arc.get_center() + 2.6 * np.array([math.cos(a), math.sin(a), 0]), color=WHITE, stroke_width=4) for a in np.linspace(PI, 0, 9)])
        tr = ValueTracker(0)
        needle = always_redraw(lambda: Line(arc.get_center(), arc.get_center() + 2.2 * np.array([math.cos(PI - PI * tr.get_value() / 50), math.sin(PI - PI * tr.get_value() / 50), 0]), color=RED_, stroke_width=10))
        num = always_redraw(lambda: T(f'{int(tr.get_value())} km/h', 60, GOLD_).next_to(arc, DOWN, buff=0.3))
        self.add(arc, ticks, needle, num)
        sh = Shark().scale(0.5).rotate(PI / 2.3).move_to([-4.5, -4, 0])
        self.add(sh)
        self.P(tr.animate.set_value(36), sh.animate.move_to([-4.5, 0.8, 0]), rt=self.dur * 0.55, rate_func=rush_into)
        self.P(Flash(num, color=GOLD_), rt=0.6)

    def s_escape(self):
        self.ocean(surface=True)
        self.header()
        seal = Seal().scale(0.9).move_to([0, 1.2, 0])
        sh = Shark().scale(0.8).rotate(PI / 3).move_to([-1, -5, 0])
        self.add(seal, sh)
        self.until(0.25)
        self.P(sh.animate.move_to([0.3, 0.6, 0]), seal.animate.shift(RIGHT * 2.5 + UP * 0.4).rotate(-0.6), rt=0.8)
        self.until(0.5)
        self.P(sh.animate.move_to([2.6, 1.5, 0]).rotate(-0.6), seal.animate.shift(LEFT * 4.5).rotate(1.2), rt=0.8)
        stamp = T('¡FALLÓ!', 110, RED_).rotate(0.15).set_stroke(WHITE, width=6, background=True)
        self.until(0.72)
        self.P(FadeIn(stamp, scale=2.5), rt=0.4)

    def s_mordisco_espera(self):
        self.ocean()
        self.header()
        seal = Seal().scale(1.2).move_to([2.5, 0.5, 0])
        sh = Shark().scale(0.8).move_to([-6, 0.5, 0])
        self.add(seal, sh)
        self.until(0.15)
        self.P(sh.animate.move_to([0, 0.4, 0]), rt=0.7, rate_func=rush_into)
        self.P(sh.animate.move_to([-6, -1.5, 0]).rotate(PI), rt=1.2)
        clock = Circle(radius=0.9, color=WHITE, stroke_width=6).move_to([-4, 2.3, 0])
        hand = Line(clock.get_center(), clock.get_center() + UP * 0.75, color=GOLD_, stroke_width=6)
        self.P(Create(clock), Create(hand), rt=0.5)
        self.P(Rotate(hand, angle=-TAU, about_point=clock.get_center()), seal.animate.shift(DOWN * 0.3).set_opacity(0.6), rt=max(1, self.dur * 0.3), rate_func=linear)

    def world(self):
        af = self.map_africa().scale(0.55).move_to([-2.5, -0.2, 0])
        au = smooth([(-1.4, 0.6), (0, 1.0), (1.3, 0.5), (1.2, -0.7), (0, -1.0), (-1.3, -0.5)], '#c9a86a', stroke='#8b6e3c').move_to([4.5, -1.5, 0])
        return af, au

    def s_mapa_marca(self):
        self.ocean(top='#2a7fbf', bot='#0a3a66', rays=False)
        self.header()
        af, au = self.world()
        self.P(DrawBorderThenFill(af), DrawBorderThenFill(au), rt=1.0)
        sh = Shark().scale(0.25).move_to(af.get_bottom() + np.array([0.6, -0.4, 0]))
        self.P(FadeIn(sh, scale=0.5), rt=0.5)
        self.until(0.5)
        tag = VGroup(RoundedRectangle(width=0.25, height=0.14, corner_radius=0.04, fill_color=GOLD_, fill_opacity=1, stroke_width=0)).move_to(sh.dorsal.get_top())
        self.P(FadeIn(tag, scale=3), rt=0.4)
        for k in range(3):
            ring = Circle(radius=0.1, color=GOLD_, stroke_width=4).move_to(tag)
            self.play(ring.animate.scale(8).set_stroke(opacity=0), run_time=0.5)
            self.used += 0.5
        name = pill('NICOLE · 2003').next_to(sh, DOWN, buff=0.4)
        self.P(FadeIn(name), rt=0.4)

    def s_mapa_ruta(self):
        self.ocean(top='#2a7fbf', bot='#0a3a66', rays=False)
        self.header()
        af, au = self.world()
        self.add(af, au)
        a = af.get_bottom() + np.array([0.6, -0.4, 0])
        b = au.get_left() + np.array([-0.1, -0.3, 0])
        go = ArcBetweenPoints(a, b, angle=-0.6, color=GOLD_, stroke_width=6)
        back = ArcBetweenPoints(b, a, angle=-0.6, color=GOLD_, stroke_width=6)
        go_d = DashedVMobject(go, num_dashes=30)
        back_d = DashedVMobject(back, num_dashes=30)
        sh = Shark().scale(0.2).move_to(a)
        self.add(sh)
        tr = ValueTracker(0)
        km = always_redraw(lambda: pill(f'{int(tr.get_value()):,} km'.replace(',', '.'), GOLD_, 40).to_edge(UP, buff=1.2))
        self.add(km)
        self.P(Create(go_d), MoveAlongPath(sh, go), tr.animate.set_value(10000), rt=self.dur * 0.35, rate_func=linear)
        self.P(Create(back_d), MoveAlongPath(sh, back), tr.animate.set_value(20000), rt=self.dur * 0.35, rate_func=linear)

    def s_mapa_cafe(self):
        self.ocean(top='#2a7fbf', bot='#0a3a66', rays=False)
        self.header()
        am = smooth([(-7.5, 4), (-4.5, 4), (-4.0, 1.5), (-5.2, -0.5), (-4.6, -4), (-7.5, -4)], '#c9a86a', stroke='#8b6e3c')
        haw = VGroup(*[Dot([4.5 + d, -0.6 - d * 0.5, 0], radius=0.08, color='#c9a86a') for d in (0, 0.25, 0.45)])
        self.P(DrawBorderThenFill(am), FadeIn(haw), rt=0.9)
        l1 = T('MÉXICO', 26, WHITE).move_to([-5.8, 1.5, 0])
        l2 = T('HAWÁI', 26, WHITE).next_to(haw, DOWN)
        self.P(FadeIn(l1), FadeIn(l2), rt=0.4)
        zone = Circle(radius=1.3, fill_color=GOLD_, fill_opacity=0.12, stroke_color=GOLD_, stroke_width=4).move_to([0.5, 0.5, 0])
        self.until(0.4)
        self.P(GrowFromCenter(zone), rt=0.6)
        sharks = VGroup(*[Shark(wag=False).scale(0.12).move_to(zone.get_center() + np.array([random.uniform(-6, 6), random.uniform(-3, 3), 0])) for _ in range(7)])
        self.add(sharks)
        self.P(*[s.animate.move_to(zone.get_center() + np.array([random.uniform(-0.8, 0.8), random.uniform(-0.6, 0.6), 0])) for s in sharks], rt=self.dur * 0.3)
        cafe = pill('«CAFÉ DEL TIBURÓN BLANCO»').next_to(zone, DOWN, buff=0.4)
        self.P(FadeIn(cafe, scale=0.5), rt=0.5)

    def s_misterio(self):
        self.ocean(top='#0e3b63', bot='#000000')
        self.header()
        sh = Shark().scale(0.7).move_to([-4, 2, 0])
        self.add(sh)
        qs = VGroup(*[T('?', random.randint(60, 120), WHITE).move_to([random.uniform(-6, 6), random.uniform(-3, 3), 0]).set_opacity(0) for _ in range(6)])
        self.add(qs)
        self.P(sh.animate.move_to([3, -4, 0]).rotate(-0.6).set_opacity(0.2), *[q.animate.set_opacity(0.6).shift(UP * 0.5) for q in qs], rt=self.dur * 0.7)

    def s_orcas_llegan(self):
        self.ocean(top='#1d5d8f', bot='#020a18')
        self.header()
        o1 = Shark(color='#111418', belly='#f4f4f4', fin_h=2.8, orca=True).scale(0.8).move_to([9, 1.2, 0]).flip()
        o2 = Shark(color='#111418', belly='#f4f4f4', fin_h=2.8, orca=True).scale(0.7).move_to([10, -1.5, 0]).flip()
        self.add(o1, o2)
        self.P(o1.animate.move_to([2, 1.2, 0]), o2.animate.move_to([3, -1.5, 0]), rt=self.dur * 0.6)
        lab = pill('ORCAS', RED_, 48).move_to([-3.5, 0, 0])
        self.P(FadeIn(lab, scale=2), Wiggle(self.camera.frame, scale_value=1.02), rt=0.6)

    def s_orcas_caza(self):
        self.ocean(top='#1d5d8f', bot='#020a18')
        self.header()
        sh = Shark().scale(0.6).move_to([0, 0, 0])
        o1 = Shark(color='#111418', belly='#f4f4f4', fin_h=2.8, orca=True).scale(0.75).move_to([-8, 1.5, 0])
        o2 = Shark(color='#111418', belly='#f4f4f4', fin_h=2.8, orca=True).scale(0.75).move_to([8, -1.5, 0]).flip()
        self.add(sh, o1, o2)
        self.P(o1.animate.move_to([-3, 0.9, 0]), o2.animate.move_to([3, -0.9, 0]), rt=self.dur * 0.35)
        self.P(sh.animate.rotate(PI / 1.2), Wiggle(self.camera.frame), rt=0.6)
        liver = Ellipse(width=1.6, height=0.8, fill_color='#8b3a3a', fill_opacity=1, stroke_color=GOLD_, stroke_width=4).move_to([0, 0, 0])
        lab = pill('HÍGADO: MUCHA ENERGÍA').next_to(liver, DOWN, buff=1.4)
        self.until(0.65)
        self.P(GrowFromCenter(liver), FadeIn(lab), rt=0.7)

    def s_tiburones_huyen(self):
        self.ocean()
        self.header()
        sharks = VGroup(*[Shark().scale(0.3).move_to([random.uniform(-5, 3), random.uniform(-2.5, 2.5), 0]) for _ in range(6)])
        self.add(sharks)
        self.P(*[s.animate.move_to([11 + random.uniform(0, 3), s.get_y() + random.uniform(-1, 1), 0]) for s in sharks], rt=self.dur * 0.55, rate_func=rush_into)
        empty = pill('ZONA VACÍA', SOFT_, 44)
        self.P(FadeIn(empty, scale=0.5), rt=0.5)

    def s_barras_riesgo(self):
        self.ocean(rays=False)
        self.header()
        rows = [('RAYOS', 0.85, GOLD_), ('ACCIDENTES EN CASA', 1.0, '#ff9f43'), ('TIBURONES', 0.03, RED_)]
        y = 1.6
        for k, (n, f, c) in enumerate(rows):
            self.until(0.3 + k * 0.18)
            lab = T(n, 32, WHITE).move_to([-6.3, y + 0.5, 0], aligned_edge=LEFT)
            bar = Rectangle(width=max(0.12, 11.5 * f), height=0.7, fill_color=c, fill_opacity=1, stroke_width=0).move_to([-6.3, y - 0.15, 0], aligned_edge=LEFT)
            self.P(FadeIn(lab), GrowFromEdge(bar, LEFT), rt=0.8)
            y -= 1.8
        self.add(T('Ilustrativo', 18, SOFT_, NORMAL).to_corner(DR, buff=1.0))

    def s_surfista_silueta(self):
        bg = Rectangle(width=40, height=24).set_fill(['#020a18', '#7cc9ff'], opacity=1).set_stroke(width=0)
        bg.set_sheen_direction(UP)
        self.add(bg)
        self.header()
        board = Ellipse(width=3.6, height=0.6, fill_color='#0b0f18', fill_opacity=1, stroke_width=0)
        legs = VGroup(*[Line([x, 0, 0], [x - 0.2, -0.9, 0], color='#0b0f18', stroke_width=14) for x in (-0.3, 0.3)])
        arms = VGroup(*[Line([x, 0.1, 0], [x * 2.6, -0.6, 0], color='#0b0f18', stroke_width=12) for x in (-0.5, 0.5)])
        surfer = VGroup(board, legs, arms).move_to([-1.5, 2.4, 0])
        seal = Seal().scale(1.4).set_color('#0b0f18').move_to([3.5, 2.4, 0])
        self.P(FadeIn(surfer), rt=0.6)
        self.until(0.4)
        self.P(FadeIn(seal), rt=0.6)
        eq = T('≈', 120, GOLD_).move_to([1.2, 2.4, 0])
        self.P(FadeIn(eq, scale=2), rt=0.5)
        sh = Shark().scale(0.6).rotate(PI / 4).move_to([-2, -3, 0]).set_opacity(0.6)
        self.P(FadeIn(sh, shift=UP), rt=0.6)

    def s_humanos_matan(self):
        self.ocean(surface=True)
        self.header()
        boat = VGroup(Polygon([-1.6, 0, 0], [1.6, 0, 0], [1.1, -0.6, 0], [-1.1, -0.6, 0], fill_color='#c0392b', fill_opacity=1, stroke_width=3),
                      Rectangle(width=0.8, height=0.6, fill_color=WHITE, fill_opacity=1).shift(UP * 0.3 + LEFT * 0.3)).move_to([-0.5, 2.75, 0])
        net = VGroup(*[Line([-0.5 + i * 0.3, 2.5, 0], [-0.5 + i * 0.25, -1.5, 0], color='#ddd', stroke_width=2, stroke_opacity=0.6) for i in range(-4, 6)])
        self.P(FadeIn(boat, shift=RIGHT), rt=0.6)
        self.P(Create(net), rt=0.8)
        tr = ValueTracker(0)
        num = always_redraw(lambda: pill(f'{int(tr.get_value()):,}'.replace(',', '.') + ' AL AÑO', RED_, 46).move_to([3.8, -1.8, 0]))
        self.add(num)
        self.P(tr.animate.set_value(50000000), rt=self.dur * 0.4, rate_func=rush_from)
        lab = T('Estimación: decenas de millones', 20, SOFT_, NORMAL).next_to(num, DOWN)
        self.P(FadeIn(lab), rt=0.4)

    def s_vida_lenta(self):
        self.ocean(rays=False)
        self.header()
        line = Line([-6, -0.5, 0], [6, -0.5, 0], color=WHITE, stroke_width=6)
        self.P(Create(line), rt=0.6)
        for yr in (0, 10, 20, 30, 40, 50, 60, 70):
            x = -6 + 12 * yr / 70
            self.add(Line([x, -0.7, 0], [x, -0.3, 0], color=WHITE, stroke_width=4), T(str(yr), 26, SOFT_).move_to([x, -1.1, 0]))
        sh = Shark().scale(0.25).move_to([-6, 0.3, 0])
        self.add(sh)
        self.P(sh.animate.move_to([-6 + 12 * 30 / 70, 0.3, 0]), rt=self.dur * 0.35, rate_func=linear)
        m = pill('≈ 30 AÑOS: PRIMERAS CRÍAS', GOLD_).move_to([-0.8, 1.6, 0])
        self.P(FadeIn(m, scale=0.5), rt=0.5)
        self.P(sh.animate.move_to([6, 0.3, 0]), rt=self.dur * 0.25, rate_func=linear)
        m2 = pill('VIVE ≈ 70 AÑOS', CYAN_).move_to([4.5, 1.6, 0])
        self.P(FadeIn(m2, scale=0.5), rt=0.4)

    def s_resumen(self):
        self.ocean(seabed=True)
        self.header()
        sh = Shark().scale(0.9).move_to([-8, 0, 0])
        self.add(sh)
        self.P(sh.animate.move_to([0.5, 0, 0]), rt=self.dur * 0.25)
        tags = ['OLFATO', 'OÍDO', 'LÍNEA LATERAL', 'VISTA', 'ELECTRICIDAD', '300 DIENTES']
        for k, n in enumerate(tags):
            ang = PI / 2 + k * TAU / 6
            p = pill(n, GOLD_, 26).move_to(sh.get_center() + np.array([4.6 * math.cos(ang), 2.7 * math.sin(ang), 0]))
            self.P(FadeIn(p, scale=0.3), rt=0.35)

    def s_cierre(self):
        self.ocean(top='#2a86c7', bot='#020a18', surface=True)
        seal = Seal().scale(0.8).move_to([2, 2.35, 0])
        sh = Shark().scale(0.8).rotate(PI / 2.6).move_to([0, -6, 0])
        self.add(seal, sh)
        self.until(0.4)
        self.P(sh.animate.move_to([2, 1.5, 0]), rt=0.8, rate_func=rush_into)
        self.P(sh.animate.move_to([2.3, 4.8, 0]), FadeOut(seal), self.camera.frame.animate.shift(UP * 1), rt=0.7)
        t = T('PROTEJAMOS AL TIBURÓN BLANCO', 54, GOLD_).set_stroke(BLACK, width=8, background=True).move_to(self.camera.frame.get_center() + DOWN * 1.5)
        self.P(Write(t), rt=1.0)

    def s_suscribete(self):
        self.ocean()
        btn = RoundedRectangle(width=5.2, height=1.3, corner_radius=0.3, fill_color='#e61e28', fill_opacity=1, stroke_width=0).move_to(UP * 1.1)
        lab = T('SUSCRÍBETE', 52, WHITE).move_to(btn)
        self.P(GrowFromCenter(btn), FadeIn(lab), rt=0.6)
        self.until(0.28)
        self.P(VGroup(btn, lab).animate.scale(0.9), rt=0.15)
        lab2 = T('SUSCRITO ✓', 52, WHITE).move_to(btn)
        self.P(VGroup(btn, lab).animate.scale(1 / 0.9), btn.animate.set_fill('#5a5a5a'), Transform(lab, lab2), rt=0.3)
        bell = VGroup(Triangle(fill_color=GOLD_, fill_opacity=1, stroke_width=0).scale(0.45), Dot(color=GOLD_).shift(DOWN * 0.45)).next_to(btn, RIGHT, buff=0.6)
        self.P(FadeIn(bell), Wiggle(bell, rotation_angle=0.25 * TAU, n_wiggles=6), rt=1.0)
        sh = Shark().scale(0.6).move_to([-9, -2, 0])
        self.add(sh)
        p = fit(T('¿QUÉ ANIMAL QUIERES VER?', 50, GOLD_), 12).move_to(DOWN * 1.0)
        self.P(Write(p), sh.animate.move_to([9, -2.4, 0]), rt=max(1.5, self.dur * 0.4), rate_func=linear)


def main():
    folder, i = sys.argv[1], int(sys.argv[2])
    esc = json.load(open(os.path.join(folder, 'escenas.json')))
    tl = json.load(open(os.path.join(folder, 'timeline.json')))
    os.makedirs(os.path.join(folder, 'render'), exist_ok=True)
    cls = type(f'C{i:02d}', (Base,), {'sc': esc[i], 'dur': tl['scenes'][i]['dur'], 'idx': i})
    random.seed(i)
    with tempconfig({'pixel_width': 1920, 'pixel_height': 1080, 'frame_rate': 30, 'quality': 'high_quality',
                     'media_dir': os.path.join(folder, 'manim_media', f'e{i:02d}'), 'disable_caching': True,
                     'output_file': f'e{i:02d}', 'verbosity': 'WARNING', 'progress_bar': 'none'}):
        s = cls()
        s.render()
        out = s.renderer.file_writer.movie_file_path
    os.replace(out, os.path.join(folder, 'render', f'e{i:02d}.mp4'))


if __name__ == '__main__':
    main()
