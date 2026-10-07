# Reel «¿Qué son las carreras STEM?» — Aceleradores STEM · MESCyT

Reel vertical de **60 s** (1080×1920, 9:16, 30 fps) hecho con Remotion a partir de `BRIEF.md`.
**Versión 4 (la actual):** es la versión 2 (collage editorial, sin banda de fondo) llevada a 1 minuto.
- STEM está en pantalla durante toda la apertura.
- Sombras suaves en lugar de paralelas.
- Entradas con curvas suaves y transiciones más largas.

Se usan los recursos nuevos: Camila con gafas RV, Elías con calculadora y la pareja señalando, más las frases nuevas de locución.
Las versiones 1, 2 y 3 se conservan en `src/v1|v2|v3` y en `entregables/version-1|2|3`.

## Entregables (`entregables/`)

| Archivo | Qué es |
|---|---|
| `STEM_siglas_9x16_60s.mp4` | Reel final: H.264 (bt709) + AAC estéreo, subtítulos quemados |
| `STEM_siglas_9x16_60s_sin-subtitulos.mp4` | El mismo reel sin subtítulos, para edición |
| `guion_final.md` | Guion con los tiempos reales de cada escena y de la locución |
| `guion_tiempos.srt` | Subtítulos por bloque |
| `locucion_60s.wav` | Voz sola, ya colocada en su sitio (48 kHz, 24 bits) |
| `musica_y_efectos_60s.wav` | Música + efectos sin voz |
| `mezcla_60s.wav` | Mezcla final que llevan los MP4 (−15 LUFS, pico real −2,8 dBTP) |
| `version-1/`, `version-2/`, `version-3/` | MP4 de las versiones anteriores (v1 y v2 de 30 s, v3 de 60 s con banda) |

## Estructura del proyecto

```
src/
  marca.ts          colores, márgenes y curvas de animación (línea gráfica del brief, sección 4)
  tiempos.ts        escenas del reel de 60 s + `palabra()`: fotograma exacto en que la voz dice cada palabra
  fonts.ts          Hurme Geometric Sans 4 + Caveat Bold desde public/
  stickers/         Camila (RV), Elías (calculadora) y la pareja señalando, con borde blanco
  fotos/            una foto por área (ADN, código, puente, gráficas) para pegarla con cinta
  papel.jpg         textura de papel
  personas/         los mismos recortes sin borde (usados por la v3)
assets/recortes_nuevos/   recortes originales entregados
audio/voz_original/       las 12 frases de la locución tal como salieron de ElevenLabs
herramientas/
  preparar_assets.py  genera stickers, fotos por área, papel y recortes sin borde
  audio.py            locución, efectos, música, mezcla y tiempos de subtítulos
  render_todo.sh      renderiza la versión limpia y la de subtítulos (solo imagen)
  entregables.sh      une cada render con la mezcla y deja los MP4 en entregables/
  muestras.mjs        renderiza fotogramas sueltos para revisar

## Cómo reproducirlo

```bash
npm install
python3 herramientas/preparar_assets.py         # solo si cambian los recortes originales
npm run audio                                   # entregables/*.wav + src/datos/subtitulos.json
bash herramientas/render_todo.sh                # out/limpio.mp4 y out/subtitulos.mp4 (≈ 8–9 min)
bash herramientas/entregables.sh                # MP4 finales con audio
npm run dev                                     # Remotion Studio para revisar
```

Si Remotion no puede descargar su Chrome, se le pasa uno local con
`NAVEGADOR=/ruta/a/chrome bash herramientas/render_todo.sh`.

El audio se une con ffmpeg, no con Remotion, así que no hay el retraso de ~42,7 ms del AAC que menciona el brief.
Se comprobó comparando la pista del MP4 con la mezcla WAV: 0 ms de desfase.

## Cambios habituales

- **Llega la línea gráfica del cliente:** colores en `src/marca.ts` y tipografías en `src/fonts.ts`.
- **Otra voz:** reemplazar los MP3 de `audio/voz_original/` con los mismos nombres y correr `npm run audio`. Las animaciones buscan cada palabra en `subtitulos.json`, así que se resincronizan solas. Si una frase cambia mucho de duración, mover su inicio en `FRASES` (`audio.py`) y, si hace falta, los cortes en `src/tiempos.ts` y `CORTES` (`audio.py`).
- **Ajustar una letra (posiciones, persona, foto):** `LETRAS` en `src/escenas/V2Letra.tsx`.
- **Imagen del robot generada con IA:** sustituir `<Robot>` en `V6Robot.tsx` por un `<Img>`.

## Decisiones y pendientes

- **Duración y contenido:** el reel pasa a 60 s. Para darle peso a «¿Qué son las carreras STEM?» se suman el título, la descripción y los ejemplos del carrusel «¿Qué son las carreras STEM?» (texto ya aprobado). No hay datos nuevos.
- **Voz:** «Vivi» (ElevenLabs, español latinoamericano). Se generaron 4 frases nuevas con la misma voz. No hay voz dominicana en la cuenta.
- **Banda:** no se usa de fondo (decisión de la v2). Solo aparecen fotos por área tomadas de sus zonas, pegadas con cinta.
- **Referencias de Instagram:** la red del entorno bloquea instagram.com, así que no se pudieron ver.
- **Línea gráfica del cliente:** pendiente.
- **Versión 1:1:** no se hizo (opcional en el brief).
