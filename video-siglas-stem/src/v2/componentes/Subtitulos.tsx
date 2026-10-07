import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import bloques from '../../v1/subtitulos30.json';
import { C, FPS, rampa } from '../../marca';

type Bloque = { inicio: number; fin: number; palabras: { t: string; s: number; clave: boolean }[] };

// En la apertura y en la pregunta final la tipografía cinética ya muestra la locución palabra por palabra;
// ahí no se duplica con la etiqueta de subtítulos.
const SIN_SUBTITULO: [number, number][] = [
  [0, 2.95],
  [24.25, 27.05],
];

/** Subtítulos quemados palabra por palabra, como una etiqueta de papel (Hurme Bold; palabra clave en rojo aclarado). */
export const Subtitulos: React.FC<{ top?: number }> = ({ top = 1478 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / FPS;
  if (SIN_SUBTITULO.some(([a, b]) => t >= a && t < b)) return null;
  const b = (bloques as Bloque[]).find((x) => t >= x.inicio - 0.03 && t < x.fin);
  if (!b) return null;
  const entra = rampa(frame, b.inicio * FPS - 2, b.inicio * FPS + 3);
  const sale = 1 - rampa(frame, b.fin * FPS - 3, b.fin * FPS);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center', opacity: Math.min(entra, sale) }}>
      <div style={{ padding: '14px 32px 18px', background: C.fondoB, border: `4px solid ${C.blanco}`, boxShadow: '10px 12px 0 rgba(8,18,56,0.35)', rotate: '-1.2deg', maxWidth: 960, textAlign: 'center' }}>
        {b.palabras.map((p, i) => {
          const sp = spring({ frame: frame - p.s * FPS, fps, config: { damping: 12, stiffness: 300, mass: 0.45 } });
          const visible = t >= p.s - 0.02;
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                marginRight: i < b.palabras.length - 1 ? 15 : 0,
                fontWeight: 700,
                fontSize: 54,
                lineHeight: 1.15,
                letterSpacing: -0.5,
                color: p.clave ? C.acento : C.blanco,
                opacity: visible ? 1 : 0,
                translate: `0px ${(1 - sp) * 18}px`,
                scale: String(0.85 + 0.15 * sp),
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
