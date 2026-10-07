"""Prepara los recursos gráficos del reel (se corre una vez; los resultados quedan en public/).

- stickers/: recortes de Camila y Elías con borde blanco de sticker (estilo collage).
- fotos/: recortes de cada área sacados de banda_b.png, para usarlos como fotos pegadas con cinta.
- papel.jpg: textura de papel para dar el acabado de collage impreso.
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

RAIZ = Path(__file__).resolve().parent.parent
PUB = RAIZ / 'public'
ORIG = RAIZ / 'assets' / 'recortes_nuevos'


def sticker(entrada: Path, salida: Path, borde: int = 13, escala: float = 1.0):
    im = Image.open(entrada).convert('RGBA')
    if escala != 1.0:
        im = im.resize((round(im.width * escala), round(im.height * escala)), Image.LANCZOS)
    pad = borde * 2
    lienzo = Image.new('RGBA', (im.width + pad * 2, im.height + pad * 2), (0, 0, 0, 0))
    lienzo.alpha_composite(im, (pad, pad))
    # quita manchas sueltas del recorte: apertura morfológica y se conserva solo lo cercano al cuerpo
    binario = lienzo.getchannel('A').point(lambda v: 255 if v > 40 else 0)
    cuerpo = binario.filter(ImageFilter.MinFilter(15)).filter(ImageFilter.MaxFilter(15)).filter(ImageFilter.MaxFilter(31))
    alfa = Image.fromarray((np.asarray(lienzo.getchannel('A'), dtype=float) * (np.asarray(cuerpo) > 0)).astype('uint8'))
    lienzo.putalpha(alfa)
    a = alfa.point(lambda v: 255 if v > 40 else 0)
    contorno = a.filter(ImageFilter.MaxFilter(borde * 2 + 1)).filter(ImageFilter.GaussianBlur(1.2))
    blanco = Image.new('RGBA', lienzo.size, (255, 255, 255, 0))
    blanco.putalpha(contorno)
    blanco.alpha_composite(lienzo)
    blanco = blanco.crop(blanco.getbbox())
    blanco.save(salida, optimize=True)
    print('sticker', salida.name, blanco.size)


def natural(entrada: Path, salida: Path):
    """Recorte limpio, sin borde de sticker (estilo de la línea gráfica aprobada): solo quita manchas sueltas."""
    im = Image.open(entrada).convert('RGBA')
    binario = im.getchannel('A').point(lambda v: 255 if v > 40 else 0)
    cuerpo = binario.filter(ImageFilter.MinFilter(15)).filter(ImageFilter.MaxFilter(15)).filter(ImageFilter.MaxFilter(31))
    alfa = Image.fromarray((np.asarray(im.getchannel('A'), dtype=float) * (np.asarray(cuerpo) > 0)).astype('uint8'))
    im.putalpha(alfa)
    im = im.crop(im.getbbox())
    im.save(salida, optimize=True)
    print('persona', salida.name, im.size)


def fotos():
    banda = Image.open(PUB / 'car' / 'banda_b.png').convert('RGB')
    cajas = {
        'ciencia': (20, 640, 380, 1180),
        'tecnologia': (385, 620, 745, 1160),
        'ingenieria': (760, 700, 1120, 1240),
        'matematicas': (1130, 640, 1490, 1180),
    }
    for nombre, caja in cajas.items():
        f = banda.crop(caja).resize((480, 720), Image.LANCZOS).filter(ImageFilter.UnsharpMask(1.2, 60, 2))
        f.save(PUB / 'fotos' / f'{nombre}.jpg', quality=92)
        print('foto', nombre, f.size)


def papel():
    rng = np.random.default_rng(3)
    h, w = 1920, 1080
    base = np.zeros((h, w))
    for escala, peso in ((6, 0.35), (40, 0.45), (180, 0.2)):
        n = rng.standard_normal((h // escala + 2, w // escala + 2))
        img = Image.fromarray(((n - n.min()) / (n.max() - n.min()) * 255).astype('uint8')).resize((w, h), Image.BICUBIC)
        base += np.asarray(img, dtype=float) / 255 * peso
    fibras = Image.new('L', (w, h), 0)
    from PIL import ImageDraw
    d = ImageDraw.Draw(fibras)
    for _ in range(900):
        x, y = rng.uniform(0, w), rng.uniform(0, h)
        ang = rng.uniform(0, np.pi)
        L = rng.uniform(8, 40)
        d.line([(x, y), (x + np.cos(ang) * L, y + np.sin(ang) * L)], fill=int(rng.uniform(40, 110)), width=1)
    fibras = np.asarray(fibras.filter(ImageFilter.GaussianBlur(0.6)), dtype=float) / 255
    v = 236 + (base - base.mean()) * 34 - fibras * 26
    Image.fromarray(np.clip(v, 0, 255).astype('uint8')).save(PUB / 'papel.jpg', quality=88)
    print('papel', (w, h))


if __name__ == '__main__':
    sticker(ORIG / 'pareja_senalando.webp', PUB / 'stickers' / 'pareja_senalando.png')
    sticker(ORIG / 'elias_calculadora.webp', PUB / 'stickers' / 'elias_calculadora.png')
    sticker(ORIG / 'camila_vr.webp', PUB / 'stickers' / 'camila_vr.png')
    (PUB / 'personas').mkdir(exist_ok=True)
    natural(ORIG / 'pareja_senalando.webp', PUB / 'personas' / 'pareja_senalando.png')
    natural(ORIG / 'elias_calculadora.webp', PUB / 'personas' / 'elias_calculadora.png')
    natural(ORIG / 'camila_vr.webp', PUB / 'personas' / 'camila_vr.png')
    fotos()
    papel()
