# Reel «¿Qué son las carreras STEM?» — Aceleradores STEM · MESCyT

Reel vertical de **60 s** (1080×1920, 9:16, 30 fps) hecho con Remotion a partir de `BRIEF.md` y de la referencia de carruseles aprobada.
**Versión 3:** estilo limpio como los carruseles, con fondo azul, banda de vidrio detrás de las personas, tarjetas de vidrio y recortes naturales sin sombras duras.
El movimiento es fluido: fondo y banda continuos, deslizamientos tipo carrusel y fundidos.
Las versiones 1 y 2 (30 s) se conservan en `src/v1`, `src/v2` y `entregables/version-1|2`.

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
| `version-1/`, `version-2/` | MP4 (y audio de la v2) de las versiones de 30 s |

## Estructura del proyecto

```
src/
  marca.ts          colores, márgenes y curvas de animación (línea gráfica del brief, sección 4)
  tiempos.ts        escenas del reel de 60 s + `palabra()`: fotograma exacto en que la voz dice cada palabra
  fonts.ts          Hurme Geometric Sans 4 + Caveat Bold desde public/fonts (no necesita red)
  Video.tsx         composición principal «STEM-siglas»: fondo, banda, escenas, marca y subtítulos
  Root.tsx          el reel, cada escena como composición propia (carpeta «escenas») y las versiones 1 y 2
  escenas/
    A1Apertura.tsx  0–7 s       ¿Qué son las carreras STEM? (STEM se queda en pantalla)
    A2Letras.tsx    7–11 s      Cuatro letras que reúnen muchas carreras
    A3Letra.tsx     11–28,2 s   S · T · E · M (una cada 4,3 s) con ejemplos de carreras
    A4Mundo.tsx     28,2–35 s   Cuatro áreas para entender el mundo: investigar, crear, resolver
    A5Ejemplos.tsx  35–42 s     Algunos ejemplos de carreras STEM
    A6Juntas.tsx    42–46,8 s   Las cuatro áreas trabajan juntas
    A7Robot.tsx     46,8–53,8 s Programación + Ingeniería + Matemáticas = un robot
    A8Pregunta.tsx  53,8–57 s   ¿Qué área te da más curiosidad?
    A9Cierre.tsx    57–60 s     Logo MESCyT, hashtags, «Imagen creada con IA»
  componentes/
    base.tsx        Fondo, Banda (una sola capa con estados por escena), Marca, Escena (transiciones), Linea, Sube,
                    tarjetas de vidrio, TarjetaCarrera, Persona
    Robot.tsx       robot SVG que se arma por partes
    Subtitulos.tsx  subtítulos palabra por palabra
  datos/subtitulos.json   tiempos palabra por palabra (lo genera herramientas/audio.py)
  v1/, v2/          versiones anteriores de 30 s
public/
  personas/         Camila (RV), Elías (calculadora) y la pareja señalando: recortes naturales
  car/banda_b.png   banda de vidrio con las cuatro áreas
assets/recortes_nuevos/   recortes originales entregados
audio/voz_original/       las 12 frases de la locución tal como salieron de ElevenLabs
herramientas/
  preparar_assets.py  genera los recortes limpios (y los recursos de la v2)
  audio.py            locución, efectos, música, mezcla y tiempos de subtítulos
  render_todo.sh      renderiza la versión limpia y la de subtítulos (solo imagen)
  entregables.sh      une cada render con la mezcla y deja los MP4 en entregables/
  muestras.mjs        renderiza fotogramas sueltos para revisar

## Cómo reproducirlo

```bash
npm install
python3 herramientas/preparar_assets.py         # solo si cambian los recortes originales
npm run audio                                   # entregables/*.wav + src/datos/subtitulos.json
bash herramientas/render_todo.sh                # out/limpio.mp4 y out/subtitulos.mp4 (≈ 8 min)
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
- **Mover la banda:** cada estado está en `CLAVES` (`src/componentes/base.tsx`).
- **Imagen del robot generada con IA:** sustituir `<Robot>` en `A7Robot.tsx` por un `<Img>`.

## Decisiones y pendientes

- **Duración y contenido:** el reel pasa a 60 s. Para darle peso a «¿Qué son las carreras STEM?» se suman el título, la descripción y los ejemplos del carrusel «¿Qué son las carreras STEM?» (texto ya aprobado). No hay datos nuevos.
- **Voz:** «Vivi» (ElevenLabs, español latinoamericano). Se generaron 4 frases nuevas con la misma voz. No hay voz dominicana en la cuenta.
- **Banda:** vuelve como en la referencia, pasando detrás de las personas y acercándose a la zona de cada área. Ya no es una ventana rectangular de fondo.
- **Línea gráfica del cliente:** pendiente.
- **Versión 1:1:** no se hizo (opcional en el brief).
