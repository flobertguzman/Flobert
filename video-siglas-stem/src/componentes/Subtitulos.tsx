import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import bloques from '../datos/subtitulos.json';
import { C, FPS, rampa } from '../marca';

type Bloque = { inicio: number; fin: number; palabras: { t: string; s: number; clave: boolean }[] };

/** Subtítulos quemados, palabra por palabra (Hurme Bold; la palabra clave en el rojo aclarado). */
export const Subtitulos: React.FC<{ top?: number }> = ({ top = 1432 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / FPS;
  const b = (bloques as Bloque[]).find((x) => t >= x.inicio - 0.03 && t < x.fin);
  if (!b) return null;
  const entra = rampa(t * FPS, b.inicio * FPS - 2, b.inicio * FPS + 3);
  const sale = 1 - rampa(t * FPS, b.fin * FPS - 3, b.fin * FPS);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center', opacity: Math.min(entra, sale) }}>
      <div style={{ padding: '16px 34px 20px', borderRadius: 30, background: 'rgba(8,18,56,0.66)', border: '2px solid rgba(255,255,255,0.14)', maxWidth: 960, textAlign: 'center' }}>
        {b.palabras.map((p, i) => {
          const sp = spring({ frame: frame - p.s * FPS, fps, config: { damping: 13, stiffness: 260, mass: 0.5 } });
          const visible = t >= p.s - 0.02;
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                marginRight: i < b.palabras.length - 1 ? 16 : 0,
                fontWeight: 700,
                fontSize: 56,
                lineHeight: 1.15,
                letterSpacing: -0.5,
                color: p.clave ? C.acento : C.blanco,
                opacity: visible ? 1 : 0,
                transform: `translateY(${(1 - sp) * 16}px) scale(${0.88 + 0.12 * sp})`,
                textShadow: '0 2px 12px rgba(0,0,0,0.45)',
              }}
            >
              {p.t}
            </span>
          );
        })}
      </div>
    </div>
  );
};
