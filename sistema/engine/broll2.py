"""Motor v2 (ficha de estilo confirmada): cortes de 0.6-1 s, b-roll en B/N + UN acento,
tarjetas negras/blancas con cuadricula (palabra chica serif cursiva arriba + enorme sans abajo),
subtitulos palabra por palabra al centro (Montserrat Bold), palabras clave ENORMES en color de acento.
Uso: python3 broll2.py plan.json salida.mp4
plan.json: {"voice","music","music_vol","accent":"#C8102E","words":"words.json",
            "keywords":["skate",...], "flashes":[t,...],
            "shots":[{"start","end","clip","ss"} | {"start","end","card":"black|white","small","big","under","accent":true,"size":220}]}
words.json: [[inicio, fin, "palabra"], ...]
"""
import json, subprocess, sys, os, tempfile, re

W, H, FPS = 1080, 1920, 30
F = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "fonts")
SANS_B = os.path.join(F, "Montserrat-Bold.ttf")
SANS_K = os.path.join(F, "Montserrat-Black.ttf")
SERIF_I = os.path.join(F, "PlayfairDisplay-Italic.ttf")


def esc(t):
    return t.replace("\\", "\\\\").replace(":", "\\:").replace("'", "’").replace("%", "\\%").replace(",", "\\,")


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        print(r.stderr[-2500:]); sys.exit(1)


def enc(out):
    return ["-an", "-c:v", "libx264", "-preset", "fast", "-crf", "19", "-pix_fmt", "yuv420p", "-r", str(FPS), out]


def shot_clip(s, out):
    d = s["end"] - s["start"]; n = max(1, round(d * FPS))
    grade = s.get("grade", "hue=s=0.12,eq=contrast=1.18:brightness=-0.02")
    vf = (f"fps={FPS},scale={int(W*1.12)}:{int(H*1.12)}:force_original_aspect_ratio=increase,"
          f"crop={int(W*1.12)}:{int(H*1.12)},"
          f"zoompan=z='1+0.06*on/{n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s={W}x{H}:fps={FPS},"
          f"setsar=1,{grade},noise=alls=6:allf=t,vignette=PI/5")
    run(["ffmpeg", "-y", "-loglevel", "error", "-ss", str(s.get("ss", 0)), "-i", s["clip"], "-frames:v", str(n), "-vf", vf] + enc(out))


def card_clip(s, out, accent):
    d = s["end"] - s["start"]; n = max(1, round(d * FPS))
    black = s.get("card", "black") == "black"
    bg, fg, grid = ("0x101010", "0xF0F0F0", "0x303030@0.7") if black else ("0xF0F0F0", "0x101010", "0xB0B0B0@0.45")
    big_c = accent if s.get("accent") else fg
    p = [f"drawgrid=w=90:h=90:t=2:c={grid}", "noise=alls=5:allf=t"]
    if s.get("small"):
        p.append(f"drawtext=fontfile={SERIF_I}:text='{esc(s['small'])}':fontsize=96:fontcolor={fg}:"
                 f"x=(w-text_w)/2:y=h/2-250:alpha='min(1,t/0.12)'")
    if s.get("big"):
        sz = s.get("size", 230)
        p.append(f"drawtext=fontfile={SANS_K}:text='{esc(s['big'])}':fontsize='{sz}*(0.92+0.08*min(1,t/0.25))':"
                 f"fontcolor={big_c}:x=(w-text_w)/2:y=(h-text_h)/2:alpha='min(1,t/0.08)'")
    if s.get("under"):
        p.append(f"drawtext=fontfile={SERIF_I}:text='{esc(s['under'])}':fontsize=84:fontcolor={fg}:"
                 f"x=(w-text_w)/2:y=h/2+170:alpha='min(1,max(0,(t-0.15)/0.15))'")
    run(["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", f"color=c={bg}:s={W}x{H}:r={FPS}",
         "-frames:v", str(n), "-vf", ",".join(p)] + enc(out))


def clean(wd):
    return re.sub(r"[,.;:!?¿¡…]+$", "", wd).strip()


def main():
    plan = json.load(open(sys.argv[1])); out = sys.argv[2]
    base = os.path.dirname(os.path.abspath(sys.argv[1]))
    accent = plan.get("accent", "#C8102E").replace("#", "0x")
    tmp = tempfile.mkdtemp(prefix="b2_", dir=os.path.dirname(os.path.abspath(out)))
    shots = plan["shots"]; parts = []
    for i, s in enumerate(shots):
        if "clip" in s and not os.path.isabs(s["clip"]):
            s["clip"] = os.path.join(base, s["clip"])
        p = os.path.join(tmp, f"s{i:02d}.mp4")
        card_clip(s, p, accent) if "card" in s else shot_clip(s, p)
        parts.append(p); print("plano", i + 1, "/", len(shots), flush=True)
    lst = os.path.join(tmp, "lista.txt")
    open(lst, "w").write("".join(f"file '{p}'\n" for p in parts))
    video = os.path.join(tmp, "video.mp4")
    run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", video])
    total = shots[-1]["end"]

    # Subtitulos palabra por palabra (solo sobre b-roll, no sobre tarjetas)
    words = json.load(open(os.path.join(base, plan["words"])))
    cards = [(s["start"], s["end"]) for s in shots if "card" in s]
    kws = {k.lower() for k in plan.get("keywords", [])}
    f = []
    for k, (a, b, wd) in enumerate(words):
        txt = clean(wd)
        if not txt: continue
        nxt = words[k + 1][0] if k + 1 < len(words) else b + 0.3
        b2 = min(nxt, b + 0.25)
        if any(ca - 0.01 <= a < ce for ca, ce in cards): continue
        if txt.lower() in kws:
            f.append(f"drawtext=fontfile={SANS_K}:text='{esc(txt.upper())}':fontcolor={accent}:"
                     f"fontsize='170*(0.9+0.1*min(1,(t-{a})/0.15))':x=(w-text_w)/2:y=(h-text_h)/2:"
                     f"shadowcolor=black@0.8:shadowx=0:shadowy=6:enable='between(t,{a},{b2})'")
        else:
            f.append(f"drawtext=fontfile={SANS_B}:text='{esc(txt)}':fontcolor=white:fontsize=64:"
                     f"x=(w-text_w)/2:y=(h-text_h)/2:borderw=3:bordercolor=black@0.55:"
                     f"shadowcolor=black@0.7:shadowx=0:shadowy=4:enable='between(t,{a},{b2})'")
    for t in plan.get("flashes", []):
        f.append(f"drawbox=x=0:y=0:w=iw:h=ih:c=white@0.85:t=fill:enable='between(t,{t},{t+0.06})'")
    fs = os.path.join(tmp, "subs.txt"); open(fs, "w").write(",\n".join(f) or "null")
    vsub = os.path.join(tmp, "vsub.mp4")
    run(["ffmpeg", "-y", "-loglevel", "error", "-i", video, "-filter_script:v", fs] + enc(vsub))

    # SFX: whoosh suave en cortes, pop en palabras clave, impacto en tarjetas
    cuts = [s["start"] for s in shots[1:]]
    pops = [a for a, b, wd in words if clean(wd).lower() in kws and not any(ca - 0.01 <= a < ce for ca, ce in cards)]
    hits = [s["start"] for s in shots if "card" in s]
    fc = []
    lab = []
    for k, c in enumerate(cuts):
        ms = int(max(0, c - 0.08) * 1000)
        fc.append(f"[0:a]atrim=0:0.25,asetpts=PTS-STARTPTS,highpass=f=900,lowpass=f=7000,afade=t=in:d=0.06,"
                  f"afade=t=out:st=0.06:d=0.19,volume=0.07,adelay={ms}|{ms}[w{k}]"); lab.append(f"[w{k}]")
    for k, c in enumerate(pops):
        ms = int(c * 1000)
        fc.append(f"[1:a]atrim=0:0.08,asetpts=PTS-STARTPTS,afade=t=out:st=0.01:d=0.07,volume=0.12,adelay={ms}|{ms}[p{k}]"); lab.append(f"[p{k}]")
    for k, c in enumerate(hits):
        ms = int(c * 1000)
        fc.append(f"[2:a]atrim=0:0.35,asetpts=PTS-STARTPTS,afade=t=out:st=0.03:d=0.32,volume=0.22,adelay={ms}|{ms}[h{k}]"); lab.append(f"[h{k}]")
    fc.append("".join(lab) + f"amix=inputs={len(lab)}:normalize=0[sfx]")
    sfx = os.path.join(tmp, "sfx.wav")
    run(["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", "anoisesrc=d=0.3:c=pink:r=44100",
         "-f", "lavfi", "-i", "sine=f=1400:d=0.1:r=44100", "-f", "lavfi", "-i", "sine=f=55:d=0.4:r=44100",
         "-filter_complex", ";".join(fc), "-map", "[sfx]", "-t", str(total), sfx])

    mv = plan.get("music_vol", 0.13)
    mix = (f"[1:a]loudnorm=I=-16:TP=-1.5,apad,asplit=2[v][sc];"
           f"[2:a]atrim=0:{total},afade=t=in:d=0.5,afade=t=out:st={total-1.2}:d=1.2,volume={mv}[m];"
           f"[m][sc]sidechaincompress=threshold=0.03:ratio=5:attack=20:release=350[md];"
           f"[v][md][3:a]amix=inputs=3:normalize=0:duration=first,atrim=0:{total},loudnorm=I=-14:TP=-1.5[a]")
    run(["ffmpeg", "-y", "-loglevel", "error", "-i", vsub, "-i", plan["voice"], "-stream_loop", "-1",
         "-ss", str(plan.get("music_ss", 0)), "-i", plan["music"], "-i", sfx, "-filter_complex", mix,
         "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-t", str(total),
         "-movflags", "+faststart", out])
    subprocess.run(["rm", "-rf", tmp])
    print("listo", out)


if __name__ == "__main__":
    main()
