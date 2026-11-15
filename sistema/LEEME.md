# Sistema de videos TikTok (@juavxf)
- engine/player2.html: motor de animación (estilo referencias: fondo claro, cursiva + negrita, franja, desenfoque).
- engine/render.js: renderiza un video.json a MP4 1080x1920 (Playwright + ffmpeg).
- engine/con_voz.sh: une animación + voz + música. Usar NOSCALE=1 cuando las escenas ya están cuadradas con la voz.
- videos/01-zara/video3.json: guion visual sincronizado con voz_will.mp3 (voz Will, ElevenLabs, velocidad 1.2).
- musica/: Kevin MacLeod (incompetech.com), CC BY 4.0 — dar crédito en la descripción.
- Publicación: subir el MP4 a la rama videos-tiktok (carpeta tiktok/) y publicar con Buffer usando el link raw de GitHub.
- Clips: Pixabay API (variable de entorno PIXABAY_KEY).
