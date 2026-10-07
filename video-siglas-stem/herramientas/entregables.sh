#!/usr/bin/env bash
# Une cada render (solo imagen) con la mezcla de audio y deja los MP4 finales en entregables/.
# Requiere: out/subtitulos.mp4, out/limpio.mp4 (npm run render:subtitulos / render:limpio)
#           entregables/mezcla_60s.wav (npm run audio)
set -euo pipefail
cd "$(dirname "$0")/.."

unir() {
  ffmpeg -v error -y -i "out/$1.mp4" -i entregables/mezcla_60s.wav \
    -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -ar 48000 -ac 2 -t 60 \
    -movflags +faststart "entregables/$2.mp4"
  echo "listo: entregables/$2.mp4"
}

unir subtitulos STEM_siglas_9x16_60s
unir limpio STEM_siglas_9x16_60s_sin-subtitulos
