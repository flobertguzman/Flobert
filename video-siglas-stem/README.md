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
  fonts.ts          Hurme Geometric Sans 4 + Caveat Bold desde public/fonts (no necesita red)
  Video.tsx         composición principal «STEM-siglas» (versión 4) + transiciones
  Root.tsx          el reel, cada escena como composición propia (carpeta «escenas») y las versiones anteriores
  escenas/
    V1Inicio.tsx    0–11 s      ¿Qué son las carreras STEM? → cuatro áreas → cuatro letras que reúnen muchas carreras
    V2Letra.tsx     11–28,2 s   S · T · E · M (una cada 4,3 s), cada una en su mundo, con ejemplos de carreras
    V3Mundo.tsx     28,2–35 s   entender el mundo: investigar, crear herramientas, resolver problemas
    V4Ejemplos.tsx  35–42 s     algunos ejemplos de carreras STEM
    V5Juntas.tsx    42–46,8 s   franjas con carreras → las letras se juntan → TRABAJAN JUNTAS
    V6Robot.tsx     46,8–53,8 s programación + ingeniería + matemáticas = un robot
    V7Pregunta.tsx  53,8–57 s   ¿Qué área te da más curiosidad?
    V8Cierre.tsx    57–60 s     firma S·T·E·M, logo MESCyT, hashtags, «Imagen creada con IA»
  componentes/
    collage.tsx     Papel, Trama, Sticker, Cinta, Sello, Tag, FotoCinta, Trazo, LetraGigante, Camara, Titular
    mundos.tsx      MundoCiencia, MundoTecnologia, MundoIngenieria, MundoMatematicas
    Transicion.tsx  flash, barras, persiana, papel, iris
    Robot.tsx       robot SVG que se arma por partes
    Subtitulos.tsx  subtítulos palabra por palabra
  datos/subtitulos.json   tiempos palabra por palabra (lo genera herramientas/audio.py)
  v1/, v2/, v3/     versiones anteriores
public/fonts (no necesita red)
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
  stickers/         Camila (RV), Elías (calculadora) y la pareja señalando, con borde blanco
  fotos/            una foto por área (ADN, código, puente, gráficas) para pegarla con cinta
  papel.jpg         textura de papel
  personas/         los mismos recortes sin borde (usados por la v3)
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
- **Ajustar una letra (posiciones, persona, foto):** `LETRAS` en `src/escenas/V2Letra.tsx`.
- **Imagen del robot generada con IA:** sustituir `<Robot>` en `V6Robot.tsx` por un `<Img>`.

## Decisiones y pendientes

- **Duración y contenido:** el reel pasa a 60 s. Para darle peso a «¿Qué son las carreras STEM?» se suman el título, la descripción y los ejemplos del carrusel «¿Qué son las carreras STEM?» (texto ya aprobado). No hay datos nuevos.
- **Voz:** «Vivi» (ElevenLabs, español latinoamericano). Se generaron 4 frases nuevas con la misma voz. No hay voz dominicana en la cuenta.
- **Banda:** no se usa de fondo (decisión de la v2). Solo aparecen fotos por área tomadas de sus zonas, pegadas con cinta.
- **Referencias de Instagram:** la red del entorno bloquea instagram.com, así que no se pudieron ver.
- **Línea gráfica del cliente:** pendiente.
- **Versión 1:1:** no se hizo (opcional en el brief).
