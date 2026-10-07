#!/usr/bin/env bash
# Renderiza las dos versiones de imagen (limpia y con subtítulos). Pasa el navegador con NAVEGADOR=/ruta/chrome si no está instalado el de Remotion.
set -euo pipefail
cd "$(dirname "$0")/.."
OPC=(--codec=h264 --crf=15 --color-space=bt709 --log=warn)
[ -n "${NAVEGADOR:-}" ] && OPC+=(--browser-executable="$NAVEGADOR")
npx remotion render STEM-siglas out/limpio.mp4 "${OPC[@]}" --props='{"subtitulos":false}'
npx remotion render STEM-siglas out/subtitulos.mp4 "${OPC[@]}" --props='{"subtitulos":true}'
