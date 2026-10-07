# Reel «Significado de las siglas STEM» — Aceleradores STEM · MESCyT

Reel vertical de 30 s (1080×1920, 9:16, 30 fps) hecho con Remotion a partir de `BRIEF.md`.
**Versión 2:** collage editorial con cortes rápidos, tipografía cinética y un «mundo» visual por área.
Ya no usa la banda de vidrio de fondo. La versión 1 se conserva aparte.

## Entregables (`entregables/`)

| Archivo | Qué es |
|---|---|
| `STEM_siglas_9x16_30s.mp4` | Reel final: H.264 (bt709) + AAC estéreo, subtítulos quemados |
| `STEM_siglas_9x16_30s_sin-subtitulos.mp4` | El mismo reel sin subtítulos, para edición |
| `guion_final.md` | Guion con los tiempos reales de cada plano y de la locución |
| `guion_tiempos.srt` | Subtítulos por bloque |
| `locucion_30s.wav` | Voz sola, ya colocada en su sitio (48 kHz, 24 bits) |
| `musica_y_efectos_30s.wav` | Música + efectos sin voz |
| `mezcla_30s.wav` | Mezcla final que llevan los MP4 (−15 LUFS, pico real −2,8 dBTP) |
| `version-1/` | MP4 de la primera versión (banda de vidrio de fondo) |

## Estructura del proyecto

```
src/
  marca.ts          colores, márgenes y curvas de animación (línea gráfica del brief, sección 4)
  tiempos.ts        línea de tiempo: dónde empieza y cuánto dura cada escena
  fonts.ts          Hurme Geometric Sans 4 + Caveat Bold desde public/fonts (no necesita red)
  Video.tsx         composición principal «STEM-siglas» (prop `subtitulos`) + transiciones
  Root.tsx          registra el reel, cada escena por separado (carpeta «escenas») y la versión 1
  escenas/
    R1Gancho.tsx    0–3 s      una palabra por plano + S·T·E·M en bloques y zoom a la S
    R2Letra.tsx     3–15 s     una letra cada 3 s, cada una en su mundo (configuración en LETRAS)
    R3Juntas.tsx    15–19 s    4 franjas con sus carreras → las letras se juntan → TRABAJAN JUNTAS
    R4Robot.tsx     19–24,4 s  plano del robot → cortes por palabra mientras se arma → = UN ROBOT
    R5Pregunta.tsx  24,4–27 s  ¿Qué área te da más curiosidad? con Camila y Elías
    R6Cierre.tsx    27–30 s    firma S·T·E·M, logo MESCyT, hashtags, «Imagen creada con IA»
  componentes/
    collage.tsx     Papel, Trama, Sticker, Cinta, Sello, Tag, FotoCinta, Trazo, LetraGigante, Camara
    mundos.tsx      MundoCiencia, MundoTecnologia, MundoIngenieria, MundoMatematicas
    Transicion.tsx  flash, barras, persiana, papel, iris
    Robot.tsx       robot SVG que se arma por partes
    Subtitulos.tsx  subtítulos palabra por palabra
  datos/subtitulos.json   tiempos palabra por palabra (lo genera herramientas/audio.py)
  v1/               primera versión completa (composición «STEM-siglas-v1»)
public/
  stickers/         Camila con gafas RV, Elías con calculadora, la pareja señalando (con borde blanco)
  fotos/            una foto por área para pegarla con cinta
  papel.jpg         textura de papel
assets/recortes_nuevos/   recortes originales que se entregaron para la versión 2
audio/voz_original/       las 8 frases de la locución tal como salieron de ElevenLabs
herramientas/
  preparar_assets.py  genera stickers, fotos y papel a partir de los originales
  audio.py            locución, efectos, música, mezcla y tiempos de subtítulos
  render_todo.sh      renderiza la versión limpia y la de subtítulos (solo imagen)
  entregables.sh      une cada render con la mezcla y deja los MP4 en entregables/
  muestras.mjs        renderiza fotogramas sueltos para revisar
```

## Cómo reproducirlo

```bash
npm install
python3 herramientas/preparar_assets.py         # solo si cambian los recortes originales
npm run audio                                   # entregables/*.wav + src/datos/subtitulos.json
bash herramientas/render_todo.sh                # out/limpio.mp4 y out/subtitulos.mp4 (≈ 4 min)
bash herramientas/entregables.sh                # MP4 finales con audio
npm run dev                                     # Remotion Studio para revisar
```

Si Remotion no puede descargar su Chrome, se le pasa uno local con
`NAVEGADOR=/ruta/a/chrome bash herramientas/render_todo.sh`.

El audio se une con ffmpeg, no con Remotion, así que no hay el retraso de ~42,7 ms del AAC que menciona el brief.
Se comprobó comparando la pista del MP4 con la mezcla WAV: 0 ms de desfase.

## Cambios habituales

- **Llega la línea gráfica del cliente:** colores en `src/marca.ts`, tipografías en `src/fonts.ts`.
- **Otra voz:** reemplazar los 8 MP3 de `audio/voz_original/` con los mismos nombres y correr `npm run audio`. Si cambian mucho los tiempos, ajustar `en`/`es` en `LETRAS` (`R2Letra.tsx`) y los fotogramas de `R4Robot.tsx`.
- **Otra persona o foto en una letra:** `LETRAS` en `R2Letra.tsx` (campos `sticker` y `foto`).
- **Imagen del robot generada con IA:** sustituir `<Robot>` en `R4Robot.tsx` por un `<Img>`.

## Decisiones y pendientes

- **Fotos por área:** las fotos pegadas con cinta (ADN, puente) salen de las zonas de `banda_b.png`. La banda ya no aparece como elemento de fondo; si no se quiere ese material, se quitan los campos `foto` en `LETRAS`.
- **Subtítulos:** en la apertura y en la pregunta final no hay etiqueta, porque la tipografía cinética muestra la locución palabra por palabra. En la versión «sin subtítulos» esa tipografía sigue, porque forma parte del diseño.
- **Voz:** «Vivi» (ElevenLabs, español latinoamericano). No hay voz dominicana en la cuenta.
- **Referencias de Instagram:** no se pudieron revisar desde esta sesión. El estilo sigue la descripción del brief: letras gigantes que golpean, bloques de color, personas recortadas, textura de papel, cortes rápidos y cierre con logo.
- **Línea gráfica del cliente:** pendiente.
- **Versión 1:1:** no se hizo (opcional en el brief).
