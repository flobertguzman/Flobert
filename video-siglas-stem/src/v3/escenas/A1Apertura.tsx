import { Escena, Linea, Persona, Sube, useF } from '../componentes/base';
import { C, X, rampa, salida } from '../../marca';

// 0–7 s · «¿Qué son las carreras STEM?» — STEM se queda en pantalla y se nombran las cuatro áreas.
const LETRAS = ['S', 'T', 'E', 'M', '?'];
const AREAS = ['Ciencia', 'Tecnología', 'Ingeniería', 'Matemáticas'];

export const A1Apertura: React.FC<{ dur: number; inicio: number }> = ({ dur, inicio }) => {
  const f = useF();
  const subraya = rampa(f, 74, 100, salida);
  return (
    <Escena dur={dur} inicio={inicio} entrada="nada" salida="fundido">
      <div style={{ position: 'absolute', left: X, top: 262, width: 960 }}>
        <Linea entra={24} style={{ fontWeight: 700, fontSize: 74, lineHeight: 1.05 }}>
          ¿Qué son las carreras
        </Linea>
        <div style={{ display: 'flex', marginTop: 4, marginLeft: -10 }}>
          {LETRAS.map((l, i) => (
            <Linea key={l} entra={40 + i * 6} dur={22} style={{ fontWeight: 900, fontSize: 330, lineHeight: 0.92, letterSpacing: -10, color: l === '?' ? C.acento : C.blanco }}>
              {l}
            </Linea>
          ))}
        </div>
        <div style={{ height: 8, width: 640 * subraya, background: C.acento, borderRadius: 4, marginTop: 6 }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 0', marginTop: 34, width: 560 }}>
          {AREAS.map((a, i) => (
            <Sube key={a} entra={104 + i * 8} dist={24} style={{ fontWeight: 700, fontSize: 40, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
              {a}
              {i < AREAS.length - 1 && <span style={{ color: C.acento, margin: '0 14px' }}>·</span>}
            </Sube>
          ))}
        </div>
      </div>
      <Persona cual="pareja" ancho={900} left={110} top={890} entra={70} />
    </Escena>
  );
};
