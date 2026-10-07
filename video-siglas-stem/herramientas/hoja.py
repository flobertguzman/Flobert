"""Une los fotogramas de out/muestras en una hoja de contacto (para revisión rápida)."""
import sys
from pathlib import Path
from PIL import Image

archivos = sorted(Path('out/muestras').glob('f*.png'))
if len(sys.argv) > 2:
    archivos = [Path(f'out/muestras/f{int(n):03d}.png') for n in sys.argv[2:]]
cols = int(sys.argv[1]) if len(sys.argv) > 1 else 5
ims = [Image.open(a) for a in archivos]
w, h = ims[0].size
filas = (len(ims) + cols - 1) // cols
hoja = Image.new('RGB', (cols * w + (cols + 1) * 8, filas * h + (filas + 1) * 8), (30, 30, 30))
for i, im in enumerate(ims):
    hoja.paste(im, (8 + (i % cols) * (w + 8), 8 + (i // cols) * (h + 8)))
hoja.save('out/hoja.png')
print(hoja.size)
