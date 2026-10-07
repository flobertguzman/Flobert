// Renderiza fotogramas sueltos para revisar el diseño sin esperar al video completo.
// Uso: node herramientas/muestras.mjs 70 150 510 ...   (números = fotograma de STEM-siglas)
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const frames = process.argv.slice(2).map(Number);
const browserExecutable = process.env.NAVEGADOR || undefined;
mkdirSync('out/muestras', { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const composition = await selectComposition({ serveUrl, id: 'STEM-siglas', inputProps: { subtitulos: true }, browserExecutable });
for (const frame of frames) {
  const output = `out/muestras/f${String(frame).padStart(3, '0')}.png`;
  await renderStill({ serveUrl, composition, frame, output, inputProps: { subtitulos: true }, browserExecutable, scale: 0.5 });
  console.log('ok', output);
}
