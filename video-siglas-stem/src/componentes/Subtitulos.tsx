import { useCurrentFrame } from 'remotion';
import bloques from '../datos/subtitulos.json';
import { C, FPS, rampa, salida } from '../marca';

type Bloque = { inicio: number; fin: number; palabras: { t: string; s: number; clave: boolean }[] };

// En la apertura y en la pregunta final los titulares ya escriben la locución palabra por palabra;
// ahí no se duplica con la etiqueta de subtítulos.
const SIN_SUBTITULO: [number, number][] = [
  [0, 10.6],
  [53.9, 57.05],
];

/** Subtítulos quemados palabra por palabra, como una etiqueta de papel (Hurme Bold; palabra clave en rojo aclarado). */
export const Subtitulos: React.FC<{ top?: number }> = ({ top = 1478 }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (SIN_SUBTITULO.some(([a, b]) => t >= a && t < b)) return null;
  const b = (bloques as Bloque[]).find((x) => t >= x.inicio - 0.03 && t < x.fin);
  if (!b) return null;
  const entra = rampa(frame, b.inicio * FPS - 3, b.inicio * FPS + 3);
  const sale = 1 - rampa(frame, b.fin * FPS - 4, b.fin * FPS);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center', opacity: Math.min(entra, sale) }}>
      <div style={{ padding: '14px 32px 18px', background: C.fondoB, border: `4px solid ${C.blanco}`, rotate: '-1.2deg', maxWidth: 960, textAlign: 'center' }}>
        {b.palabras.map((p, i) => {
          const k = rampa(frame, p.s * FPS - 1, p.s * FPS + 6, salida);
          return (
            <span key={i} style={{ display: 'inline-block', marginRight: i < b.palabras.length - 1 ? 15 : 0, fontWeight: 700, fontSize: 54, lineHeight: 1.15, letterSpacing: -0.5, color: p.clave ? C.acento : C.blanco, opacity: k, translate: `0px ${(1 - k) * 12}px` }}>
              {p.t}
            </span>
          );
        })}
      </div>
    </div>
  );
};
