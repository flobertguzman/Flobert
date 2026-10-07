import { continueRender, delayRender, staticFile } from 'remotion';

export const FONT = 'Hurme';
export const SCRIPT = 'CaveatLocal';

const caras: [string, string, number][] = [
  [FONT, 'HurmeGeometricSans4-Regular.ttf', 400],
  [FONT, 'HurmeGeometricSans4-SemiBold.ttf', 600],
  [FONT, 'HurmeGeometricSans4-Bold.ttf', 700],
  [FONT, 'HurmeGeometricSans4-Black.ttf', 900],
  [SCRIPT, 'Caveat-Bold.ttf', 700],
];

// Las fuentes viajan dentro del proyecto (public/fonts): no hace falta red para renderizar.
const handle = delayRender('Cargando tipografías');
Promise.all(
  caras.map(([familia, archivo, peso]) =>
    new FontFace(familia, `url(${staticFile(`fonts/${archivo}`)})`, { weight: String(peso) })
      .load()
      .then((f) => document.fonts.add(f)),
  ),
)
  .catch((e) => console.error('No se pudo cargar una tipografía', e))
  .finally(() => continueRender(handle));
