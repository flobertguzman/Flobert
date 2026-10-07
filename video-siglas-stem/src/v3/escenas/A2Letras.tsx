import { Escena, Linea, Sube, vidrio, useF } from '../componentes/base';
import { C, X } from '../../marca';
import { AREAS } from '../../tiempos';

// 7–11 s · «Cuatro letras que reúnen muchas carreras.»
export const A2Letras: React.FC<{ dur: number; inicio: number }> = ({ dur, inicio }) => {
  const f = useF();
  return (
    <Escena dur={dur} inicio={inicio} entrada="fundido" salida="deslizar">
      <div style={{ position: 'absolute', left: X, top: 262, width: 960 }}>
        <Linea entra={10} style={{ fontWeight: 700, fontSize: 58, lineHeight: 1.05, color: C.suave }}>
          Cuatro letras que reúnen
        </Linea>
        <Linea entra={18} style={{ fontWeight: 900, fontSize: 112, lineHeight: 1.02, letterSpacing: -3.5 }}>
          muchas <span style={{ color: C.acento }}>carreras</span>
        </Linea>
      </div>
      <div style={{ position: 'absolute', left: X, top: 580, width: 952, display: 'flex', justifyContent: 'space-between' }}>
        {AREAS.map((a, i) => (
          <Sube key={a.letra} entra={12 + i * 6} dist={60} dur={22} style={{ ...vidrio(28), width: 222, height: 310, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontWeight: 900, fontSize: 210, lineHeight: 0.85, letterSpacing: -6 }}>{a.letra}</div>
            <div style={{ marginTop: 22, fontWeight: 700, fontSize: 17, letterSpacing: 3, color: C.acento, opacity: f >= 40 + i * 4 ? 1 : 0 }}>{a.nombre}</div>
          </Sube>
        ))}
      </div>
    </Escena>
  );
};
