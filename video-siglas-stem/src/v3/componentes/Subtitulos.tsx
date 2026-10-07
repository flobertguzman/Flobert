import { useCurrentFrame } from 'remotion';
import bloques from '../../datos/subtitulos.json';
import { C, FPS, rampa, salida } from '../../marca';

type Bloque = { inicio: number; fin: number; palabras: { t: string; s: number; clave: boolean }[] };

/** Subtítulos quemados palabra por palabra (Hurme Bold; la palabra clave en el rojo aclarado), en una cápsula sobria. */
export const Subtitulos: React.FC<{ top?: number }> = ({ top = 1500 }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const b = (bloques as Bloque[]).find((x) => t >= x.inicio - 0.03 && t < x.fin);
  if (!b) return null;
  const entra = rampa(frame, b.inicio * FPS - 3, b.inicio * FPS + 3);
  const sale = 1 - rampa(frame, b.fin * FPS - 4, b.fin * FPS);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center', opacity: Math.min(entra, sale) }}>
      <div style={{ padding: '14px 32px 18px', borderRadius: 30, background: 'rgba(8,18,56,0.62)', border: '2px solid rgba(255,255,255,0.14)', maxWidth: 960, textAlign: 'center' }}>
        {b.palabras.map((p, i) => {
          const k = rampa(frame, p.s * FPS - 1, p.s * FPS + 6, salida);
          return (
            <span key={i} style={{ display: 'inline-block', marginRight: i < b.palabras.length - 1 ? 15 : 0, fontWeight: 700, fontSize: 52, lineHeight: 1.15, color: p.clave ? C.acento : C.blanco, opacity: k, translate: `0px ${(1 - k) * 10}px` }}>
              {p.t}
            </span>
          );
        })}
      </div>
    </div>
  );
};
