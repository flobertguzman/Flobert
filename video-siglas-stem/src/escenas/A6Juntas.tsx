import { Escena, Linea, vidrio, useF } from '../componentes/base';
import { C, X, mezcla, rampa, salida } from '../marca';
import { AREAS, palabraEn } from '../tiempos';

// 42–46,8 s · «Cada área tiene sus propias carreras, pero muchas trabajan juntas.»
// Cuatro tarjetas (una por área, con sus carreras) se encogen y se unen en una sola fila: S T E M.
const GRID = AREAS.map((_, i) => ({ x: X + (i % 2) * 492, y: 520 + Math.floor(i / 2) * 330, w: 460, h: 300 }));
const FILA = AREAS.map((_, i) => ({ x: X + i * 238, y: 560, w: 238, h: 270 }));

export const A6Juntas: React.FC<{ dur: number; inicio: number }> = ({ dur, inicio }) => {
  const f = useF();
  const pero = palabraEn('juntas', 'pero');
  const juntas = palabraEn('juntas', 'juntas');
  const trabajan = palabraEn('juntas', 'trabajan');
  const une = rampa(f, pero, juntas - 2, salida);
  const brillo = Math.max(0, 1 - Math.abs(f - juntas - 6) / 14);
  return (
    <Escena dur={dur} inicio={inicio} entrada="fundido" salida="fundido">
      <div style={{ position: 'absolute', left: X, top: 262, width: 960 }}>
        <Linea entra={8} style={{ fontWeight: 700, fontSize: 58, lineHeight: 1.05, color: C.suave }}>
          Las cuatro áreas
        </Linea>
        <Linea entra={trabajan - 4} style={{ fontWeight: 900, fontSize: 112, lineHeight: 1.02, letterSpacing: -3.5 }}>
          trabajan <span style={{ color: C.acento }}>juntas</span>
        </Linea>
      </div>
      {AREAS.map((a, i) => {
        const g = GRID[i];
        const r = FILA[i];
        const entra = rampa(f, 6 + i * 5, 26 + i * 5, salida);
        const ultimo = i === 3;
        return (
          <div
            key={a.letra}
            style={{
              position: 'absolute',
              left: mezcla(g.x, r.x, une),
              top: mezcla(g.y, r.y, une),
              width: mezcla(g.w, r.w, une),
              height: mezcla(g.h, r.h, une),
              ...vidrio(26),
              borderRadius: une > 0.98 ? (i === 0 ? '26px 0 0 26px' : ultimo ? '0 26px 26px 0' : 0) : 26,
              borderColor: brillo > 0.02 ? `rgba(255,90,95,${0.3 + 0.7 * brillo})` : C.vidrioLinea,
              opacity: entra,
              translate: `0px ${(1 - entra) * 50}px`,
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', left: mezcla(30, 0, une), top: mezcla(22, 0, une), width: mezcla(140, r.w, une), height: mezcla(150, r.h, une), display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: mezcla(150, 190, une), lineHeight: 0.85, letterSpacing: -5 }}>{a.letra}</div>
            <div style={{ position: 'absolute', left: 190, top: 34, right: 18, opacity: 1 - une * 2 }}>
              <div style={{ fontWeight: 700, fontSize: 19, letterSpacing: 3, color: C.acento }}>{a.nombre}</div>
              {a.carreras.map((c) => (
                <div key={c} style={{ marginTop: 10, fontWeight: 700, fontSize: 25, lineHeight: 1.1, color: C.suave }}>{c}</div>
              ))}
            </div>
          </div>
        );
      })}
      <div style={{ position: 'absolute', left: X - 6, top: 554, width: 4 * 238 + 12, height: 282, borderRadius: 30, border: `4px solid ${C.acento}`, opacity: brillo, scale: String(1 + 0.04 * (1 - brillo)) }} />
    </Escena>
  );
};
