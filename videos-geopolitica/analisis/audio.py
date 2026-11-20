"""Audio (0-60 s): nivel de música en pausas vs voz (dB), centroide espectral de la música, golpes/SFX (onsets fuertes) por minuto. Uso: audio.py video"""
import sys, subprocess, numpy as np, librosa
v = sys.argv[1]
y = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-t', '60', '-i', v, '-ac', '1', '-ar', '22050', '-f', 's16le', '-'], capture_output=True).stdout, np.int16).astype(np.float32) / 32768
rms = librosa.feature.rms(y=y, frame_length=2048, hop_length=512)[0]; db = 20 * np.log10(rms + 1e-6)
hi = np.percentile(db, 90); lo = np.percentile(db, 10)
on = librosa.onset.onset_detect(y=y, sr=22050, units='time', backtrack=False, delta=0.25)
tempo = librosa.beat.beat_track(y=y, sr=22050)[0]
cent = librosa.feature.spectral_centroid(y=y, sr=22050)[0]
print(f'{v.split("/")[-1]}: voz~{hi:.1f} dB, fondo en pausas~{lo:.1f} dB (diferencia {hi-lo:.1f} dB) | golpes/onsets fuertes {len(on)} en 60 s | tempo estimado {float(np.atleast_1d(tempo)[0]):.0f} BPM | centroide medio {cent.mean():.0f} Hz')
