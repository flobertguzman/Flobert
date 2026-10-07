import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, X, rampa } from '../marca';

// Las cuatro letras golpean la pantalla una por una (fotogramas de impacto sincronizados con la locución).
const GOLPES = [6, 20, 34, 48];
const TARJETAS = [
  { l: 'S', fondo: C.blanco, borde: C.blanco, color: C.azul, rot: -2.4, x: X, y: 470 },
  { l: 'T', fondo: C.vidrio, borde: C.vidrioLinea, color: C.blanco, rot: 2, x: X + 484, y: 470 },
  { l: 'E', fondo: C.acento, borde: C.acento, color: C.blanco, rot: 1.6, x: X, y: 886 },
  { l: 'M', fondo: C.vidrio, borde: C.vidrioLinea, color: C.blanco, rot: -2, x: X + 484, y: 886 },
];

export const E1Letras: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  // sacudida de cámara que se suma con cada golpe
  const sac = GOLPES.reduce((acc, h) => {
    const d = f - h;
    return d < 0 ? acc : acc + Math.sin(d * 2.6) * 11 * Math.exp(-d / 3.4);
  }, 0);
  const fuera = 1 - rampa(f, 85, 89);
  const t1 = rampa(f, 3, 16);
  const t2 = rampa(f, 10, 26);

  return (
    <div style={{ position: 'absolute', inset: 0, transform: `translate(${sac}px, ${sac * 0.5}px)`, opacity: fuera }}>

      <div style={{ position: 'absolute', left: X, top: 222, width: 952 }}>
        <div style={{ overflow: 'hidden', paddingBottom: 6 }}>
          <div style={{ fontWeight: 700, fontSize: 54, lineHeight: 1.05, color: C.suave, transform: `translateY(${(1 - t1) * 110}%)` }}>Cuatro letras que reúnen</div>
        </div>
        <div style={{ overflow: 'hidden', paddingBottom: 12 }}>
          <div style={{ fontWeight: 900, fontSize: 112, lineHeight: 1.02, letterSpacing: -3.5, transform: `translateY(${(1 - t2) * 110}%)`, whiteSpace: 'nowrap' }}>
            muchas <span style={{ color: C.acento }}>carreras</span>
          </div>
        </div>
      </div>

      {TARJETAS.map((t, i) => {
        const d = f - GOLPES[i];
        const sp = spring({ frame: d, fps, config: { damping: 8, stiffness: 240, mass: 0.7 } });
        const esc = d < 0 ? 0 : 2.1 - 1.1 * sp;
        const rot = t.rot + (d < 0 ? 0 : (1 - sp) * (i % 2 ? 9 : -9));
        const idle = 1 + 0.012 * Math.sin((f - i * 7) / 7) * rampa(f, 58, 66);
        return (
          <div
            key={t.l}
            style={{
              position: 'absolute',
              left: t.x,
              top: t.y,
              width: 468,
              height: 400,
              boxSizing: 'border-box',
              borderRadius: 34,
              background: t.fondo,
              border: `3px solid ${t.borde}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `rotate(${rot}deg) scale(${esc * idle})`,
              opacity: d < 0 ? 0 : 1,
              boxShadow: t.fondo === C.vidrio ? '0 20px 60px rgba(4,10,40,0.35)' : '0 24px 70px rgba(4,10,40,0.45)',
            }}
          >
            <div style={{ fontWeight: 900, fontSize: 420, lineHeight: 0.8, letterSpacing: -12, color: t.color, paddingBottom: 18 }}>{t.l}</div>
            {/* destello del golpe */}
            <div style={{ position: 'absolute', inset: 0, borderRadius: 30, background: '#fff', opacity: 0.6 * Math.max(0, 1 - d / 5) * (d < 0 ? 0 : 1) }} />
          </div>
        );
      })}
    </div>
  );
};
