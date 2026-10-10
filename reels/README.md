# Reels El Diego Rooftop Bar

Reels animados para Instagram (1080×1920, 30 fps, 15 s) hechos con [Remotion](https://www.remotion.dev).

## Uso

```bash
npm i
npm run dev                     # vista previa en Remotion Studio
npx remotion render Carlox out/Reel-Carlox.mp4
```

## Agregar o editar un artista

Todo el contenido está en `src/reels.ts`: nombre, fecha, hora, frase, foto, música y encuadre.
Las fotos van recortadas sin fondo en `public/artists/`, y la música en `public/audio/`.
Cada entrada aparece como una composición en el Studio.
