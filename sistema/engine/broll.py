"""Montaje estilo referencias: b-roll real a pantalla completa + palabra clave en serif cursiva
+ tarjetas negras/blancas con texto editorial. Uso:
  python3 broll.py plan.json salida.mp4
plan.json: {"voice": "...mp3", "music": "...mp3", "music_vol": 0.13,
            "shots": [{"start":0,"end":2.1,"clip":"x.mp4","ss":1.0,"word":"zapatillas","warm":true}
                      | {"start":..,"end":..,"card":"black"|"white","big":"1964","small":"en"}]}
"""
import json, subprocess, sys, os, tempfile

W, H, FPS = 1080, 1920, 30
SERIF_I = "/usr/share/fonts/truetype/crosextra/Caladea-Italic.ttf"
SANS_B = "/usr/share/fonts/opentype/inter/InterDisplay-Black.otf"


def esc(t):
    return t.replace("\\", "\\\\").replace(":", "\\:").replace("'", "’").replace("%", "\\%")


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        print(r.stderr[-2000:]); sys.exit(1)


def shot_clip(s, out):
    d = s["end"] - s["start"]
    grade = "eq=saturation=0.85:contrast=1.06,colorbalance=rs=0.06:bs=-0.06" if s.get("warm") else "eq=contrast=1.05"
    n = max(1, int(d * FPS))
    vf = (f"fps={FPS},scale={int(W*1.1)}:{int(H*1.1)}:force_original_aspect_ratio=increase,"
          f"crop={int(W*1.1)}:{int(H*1.1)},"
          f"zoompan=z='1+0.07*on/{n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s={W}x{H}:fps={FPS},"
          f"setsar=1,{grade}")
    if s.get("word"):
        vf += (f",drawtext=fontfile={SERIF_I}:text='{esc(s['word'])}':fontsize=84:fontcolor=white:borderw=2:bordercolor=black@0.45:"
               f"x=(w-text_w)/2:y=(h-text_h)/2:shadowcolor=black@0.85:shadowx=0:shadowy=4:"
               f"alpha='min(1,t/0.18)'")
    run(["ffmpeg", "-y", "-loglevel", "error", "-ss", str(s.get("ss", 0)), "-i", s["clip"], "-t", f"{d:.3f}",
         "-vf", vf, "-an", "-c:v", "libx264", "-preset", "fast", "-crf", "19", "-pix_fmt", "yuv420p", out])


def card_clip(s, out):
    d = s["end"] - s["start"]
    bg, fg = ("black", "white") if s.get("card", "black") == "black" else ("white", "black")
    src = f"color=c={bg}:s={W}x{H}:r={FPS}:d={d:.3f}"
    parts = []
    if s.get("small"):
        parts.append(f"drawtext=fontfile={SERIF_I}:text='{esc(s['small'])}':fontsize=70:fontcolor={fg}:"
                     f"x=(w-text_w)/2:y=h/2-190:alpha='min(1,t/0.2)'")
    if s.get("big"):
        parts.append(f"drawtext=fontfile={SANS_B}:text='{esc(s['big'])}':fontsize={s.get('size',170)}:fontcolor={fg}:"
                     f"x=(w-text_w)/2:y=(h-text_h)/2:alpha='min(1,max(0,(t-0.12)/0.2))'")
    if s.get("under"):
        parts.append(f"drawtext=fontfile={SERIF_I}:text='{esc(s['under'])}':fontsize=64:fontcolor={fg}:"
                     f"x=(w-text_w)/2:y=h/2+130:alpha='min(1,max(0,(t-0.35)/0.25))'")
    run(["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", src, "-vf", ",".join(parts) or "null",
         "-c:v", "libx264", "-preset", "fast", "-crf", "19", "-pix_fmt", "yuv420p", out])


def main():
    plan = json.load(open(sys.argv[1])); out = sys.argv[2]
    tmp = tempfile.mkdtemp(prefix="broll_", dir=os.path.dirname(os.path.abspath(out)))
    parts = []
    for i, s in enumerate(plan["shots"]):
        p = os.path.join(tmp, f"s{i:02d}.mp4")
        (card_clip if "card" in s else shot_clip)(s, p)
        parts.append(p); print("plano", i + 1, "/", len(plan["shots"]), flush=True)
    lst = os.path.join(tmp, "lista.txt")
    open(lst, "w").write("".join(f"file '{p}'\n" for p in parts))
    video = os.path.join(tmp, "video.mp4")
    run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", video])
    total = plan["shots"][-1]["end"]
    cuts = [s["start"] for s in plan["shots"][1:]]
    sfx_f = ";".join(f"[0:a]atrim=0:0.3,asetpts=PTS-STARTPTS,highpass=f=700,lowpass=f=6000,afade=t=in:d=0.08,"
                     f"afade=t=out:st=0.08:d=0.22,volume=0.16,adelay={int(max(0,c-0.1)*1000)}|{int(max(0,c-0.1)*1000)}[w{k}]"
                     for k, c in enumerate(cuts))
    sfx_f += ";" + "".join(f"[w{k}]" for k in range(len(cuts))) + f"amix=inputs={len(cuts)}:normalize=0[sfx]"
    sfx = os.path.join(tmp, "sfx.wav")
    run(["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", "anoisesrc=d=0.35:c=pink:r=44100",
         "-filter_complex", sfx_f, "-map", "[sfx]", "-t", str(total), sfx])
    mv = plan.get("music_vol", 0.13)
    fc = (f"[1:a]loudnorm=I=-16:TP=-1.5,apad,asplit=2[v][sc];"
          f"[2:a]atrim=0:{total},afade=t=in:d=0.6,afade=t=out:st={total-1.5}:d=1.5,volume={mv}[m];"
          f"[m][sc]sidechaincompress=threshold=0.03:ratio=5:attack=20:release=350[md];"
          f"[v][md][3:a]amix=inputs=3:normalize=0:duration=first,atrim=0:{total},loudnorm=I=-14:TP=-1.5[a]")
    run(["ffmpeg", "-y", "-loglevel", "error", "-i", video, "-i", plan["voice"], "-stream_loop", "-1",
         "-ss", str(plan.get("music_ss", 0)), "-i", plan["music"], "-i", sfx, "-filter_complex", fc,
         "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", out])
    subprocess.run(["rm", "-rf", tmp])
    print("listo", out)


if __name__ == "__main__":
    main()
