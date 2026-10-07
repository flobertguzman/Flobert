import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Robot } from '../componentes/Robot';
import { C, X, mezcla, rampa } from '../marca';

// Programación + Ingeniería + Matemáticas = un robot. Cada sumando llega cuando se dice su palabra.
const SUMANDOS = [
  { area: 'TECNOLOGÍA', nombre: 'Programación', punto: C.cian, entra: 70 },
  { area: 'INGENIERÍA', nombre: 'Ingeniería', punto: C.acento, entra: 92 },
  { area: 'MATEMÁTICAS', nombre: 'Matemáticas', punto: C.blanco, entra: 120 },
];
const IGUAL = 140;
const TOP = 600;
const PASO = 190;

export const E4Robot: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fuera = 1 - rampa(f, 157, 161);
  const t1 = rampa(f, 2, 15);
  const t2 = rampa(f, 8, 24);
  const pill = spring({ frame: f - IGUAL, fps, config: { damping: 10, stiffness: 200, mass: 0.7 } });

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: fuera }}>
      <div style={{ position: 'absolute', left: X, top: 222, width: 952 }}>
        <div style={{ overflow: 'hidden', paddingBottom: 6 }}>
          <div style={{ fontWeight: 700, fontSize: 54, lineHeight: 1.05, color: C.suave, transform: `translateY(${(1 - t1) * 110}%)` }}>Un ejemplo: para crear</div>
        </div>
        <div style={{ overflow: 'hidden', paddingBottom: 12 }}>
          <div style={{ fontWeight: 900, fontSize: 112, lineHeight: 1.02, letterSpacing: -3.5, transform: `translateY(${(1 - t2) * 110}%)`, whiteSpace: 'nowrap' }}>
            <span style={{ color: C.acento }}>un robot</span>
          </div>
        </div>
      </div>

      {SUMANDOS.map((s, i) => {
        const sp = spring({ frame: f - s.entra, fps, config: { damping: 13, stiffness: 190, mass: 0.7 } });
        const plus = spring({ frame: f - s.entra + 3, fps, config: { damping: 9, stiffness: 240, mass: 0.6 } });
        const y = TOP + i * PASO;
        return (
          <div key={s.nombre}>
            {i > 0 && (
              <div style={{ position: 'absolute', left: X + 190, top: y - 59, width: 56, height: 56, borderRadius: 28, background: C.acento, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 42, lineHeight: 1, transform: `scale(${Math.max(0, plus)})`, boxShadow: '0 8px 24px rgba(255,90,95,0.45)' }}>
                +
              </div>
            )}
            <div
              style={{
                position: 'absolute',
                left: X,
                top: y,
                width: 470,
                height: 136,
                boxSizing: 'border-box',
                padding: '26px 30px 0',
                borderRadius: 28,
                background: C.vidrio,
                border: `2px solid ${C.vidrioLinea}`,
                opacity: f >= s.entra ? 1 : 0,
                transform: `translateX(${(1 - sp) * -90}px) scale(${mezcla(0.9, 1, sp)})`,
                boxShadow: '0 18px 50px rgba(4,10,40,0.3)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 14, height: 14, borderRadius: 7, background: s.punto, boxShadow: `0 0 14px ${s.punto}` }} />
                <div style={{ fontWeight: 700, fontSize: 19, letterSpacing: 4, color: C.acento }}>{s.area}</div>
              </div>
              <div style={{ marginTop: 8, fontWeight: 900, fontSize: 44, letterSpacing: -1, whiteSpace: 'nowrap' }}>{s.nombre}</div>
            </div>
          </div>
        );
      })}

      <div
        style={{
          position: 'absolute',
          left: X,
          top: TOP + 3 * PASO - 14,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          transform: `scale(${Math.max(0, pill)})`,
          transformOrigin: 'left center',
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 70, lineHeight: 1, color: C.acento }}>=</div>
        <div style={{ padding: '14px 40px', background: C.blanco, borderRadius: 999 }}>
          <span style={{ color: C.azul, fontWeight: 900, fontSize: 50, whiteSpace: 'nowrap' }}>un robot</span>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 528, top: 492 }}>
        <Robot f={f} cabeza={SUMANDOS[0].entra + 2} cuerpo={SUMANDOS[1].entra + 2} pecho={SUMANDOS[2].entra + 2} vivo={IGUAL + 3} ancho={496} />
      </div>
    </div>
  );
};
