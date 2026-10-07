# Video «Significado de las siglas STEM» — Aceleradores STEM · MESCyT

Video vertical de 30 s (1080×1920, 30 fps) hecho con Remotion a partir de `BRIEF.md`.

## Entregables (`entregables/`)

| Archivo | Qué es |
|---|---|
| `STEM_siglas_9x16_30s.mp4` | Versión final: H.264 + AAC estéreo, subtítulos quemados |
| `STEM_siglas_9x16_30s_sin-subtitulos.mp4` | Misma pieza sin subtítulos, para edición |
| `guion_final.md` | Guion con los tiempos reales de cada escena y de la locución |
| `guion_tiempos.srt` | Subtítulos por bloque (por si una plataforma los pide aparte) |
| `locucion_30s.wav` | Voz sola, ya colocada en su sitio (48 kHz, 24 bits) |
| `musica_y_efectos_30s.wav` | Música + efectos sin voz (para remezclar) |
| `mezcla_30s.wav` | Mezcla final que llevan los MP4 |

## Estructura del proyecto

```
src/
  marca.ts          colores, márgenes y curvas de animación (línea gráfica del brief, sección 4)
  tiempos.ts        línea de tiempo: dónde empieza y cuánto dura cada escena
  fonts.ts          Hurme Geometric Sans 4 + Caveat Bold desde public/fonts (no necesita red)
  Video.tsx         composición principal «STEM-siglas» (prop `subtitulos`)
  Root.tsx          registra la principal y cada escena como composición aparte
  escenas/
    E1Letras.tsx    0–3 s      S · T · E · M golpean una por una
    E2Area.tsx      3–15 s     una letra cada 3 s: inicial → inglés → español + zona de la banda
    E3Juntas.tsx    15–19 s    las letras se juntan y la banda completa cruza
    E4Robot.tsx     19–24,4 s  Programación + Ingeniería + Matemáticas = un robot
    E5Personas.tsx  24,4–27 s  Camila y Elías entran desde los lados: «¿Qué área te da más curiosidad?»
    E6Cierre.tsx    27–30 s    logo MESCyT, hashtags, «Imagen creada con IA», fundido a azul
  componentes/      Fondo, Etiqueta, BandaZona (ventana sobre la banda), Robot (SVG), Subtitulos
  datos/subtitulos.json   tiempos palabra por palabra (lo genera herramientas/audio.py)
audio/voz_original/       las 8 frases de la locución tal como salieron de ElevenLabs
herramientas/
  audio.py          arma locución, efectos, música y mezcla; calcula los subtítulos
  render_todo.sh    renderiza la versión limpia y la de subtítulos (solo imagen)
  entregables.sh    une cada render con la mezcla y deja los MP4 en entregables/
  muestras.mjs      renderiza fotogramas sueltos para revisar
```

Los componentes reutilizan lo definido en los carruseles (`Carrusel.tsx` y `Carrusel2.tsx` del paquete):
colores, banda `car/banda_b.png`, recortes de Camila y Elías, tarjetas de vidrio, etiqueta con guion rojo y firma.
Los carruseles no se copiaron: importaban archivos que no venían en el paquete y estaban diseñados a 1080×1350.

## Cómo reproducirlo

```bash
npm install
npm run audio                                   # entregables/*.wav + src/datos/subtitulos.json
bash herramientas/render_todo.sh                # out/limpio.mp4 y out/subtitulos.mp4
bash herramientas/entregables.sh                # MP4 finales con audio
npm run dev                                     # Remotion Studio para revisar
```

Si Remotion no puede descargar su Chrome (redes cerradas), se le pasa uno local:
`NAVEGADOR=/ruta/a/chrome bash herramientas/render_todo.sh`.

El audio se une con ffmpeg, no con Remotion. Así no aparece el retraso de ~42,7 ms del AAC que menciona el brief.
En los MP4 finales la voz queda sincronizada al fotograma. Se comprobó comparando la pista del MP4 con la mezcla WAV.

## Cambios habituales

- **Llega la línea gráfica del cliente:** cambiar colores en `src/marca.ts` (y tipografías en `src/fonts.ts`). Todas las escenas leen de ahí.
- **Otra voz** (p. ej. la voz clonada de Camila en Cartesia): reemplazar los 8 MP3 de `audio/voz_original/` con los mismos nombres y correr `npm run audio`. Los tiempos de los subtítulos y la mezcla se recalculan solos. Si una frase dura más que su escena, subir su `tempo` en `FRASES` (audio.py).
- **Imagen del robot generada con IA:** sustituir el `<Robot>` de `E4Robot.tsx` por un `<Img>`; las tarjetas y los tiempos no cambian.
- **Música:** la actual se sintetiza en `audio.py`. Para usar una pista con licencia, mezclarla en lugar de `musica()`, ya que el ducking de −11 dB bajo la voz ya está hecho.

## Decisiones y pendientes

- **Voz:** «Vivi» (ElevenLabs, español latinoamericano, positiva y cercana). En la cuenta no hay voces dominicanas, y la voz clonada de Camila en Cartesia no se pudo verificar desde esta sesión.
- **Robot:** ilustrado y animado en Remotion (opción sin créditos del brief).
- **Personas:** se usa `recorte_a` (saludando). Se puede partir limpio por donde se tocan, para que cada uno entre por su lado. `recorte_b` (brazos cruzados, señalando) se solapa y no se puede separar sin rellenar.
- **Línea gráfica del cliente:** pendiente; se usó la sección 4 del brief.
- **Versión 1:1:** no se hizo (opcional en el brief).
