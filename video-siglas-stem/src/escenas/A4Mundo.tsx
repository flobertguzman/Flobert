import { Escena, Linea, Persona, Sube, vidrio, useF } from '../componentes/base';
import { C, X, rampa, salida } from '../marca';
import { palabraEn } from '../tiempos';

// 28–35 s · «Estudian cómo funciona el mundo y nos ayudan a investigar, crear herramientas y resolver problemas.»
const ICONOS: Record<string, string> = {
  lupa: 'M 30 30 m -18 0 a 18 18 0 1 0 36 0 a 18 18 0 1 0 -36 0 M 43 43 L 58 58',
  herramienta: 'M 18 54 L 40 32 M 40 32 C 34 22, 40 8, 54 10 L 46 18 L 48 26 L 56 28 L 64 20 C 66 34, 52 40, 44 36',
  idea: 'M 36 8 C 22 8, 14 18, 14 28 C 14 38, 22 42, 26 50 L 46 50 C 50 42, 58 38, 58 28 C 58 18, 50 8, 36 8 Z M 28 58 L 44 58 M 30 66 L 42 66',
};
const ACCIONES = [
  { texto: 'Investigar', icono: 'lupa', palabra: 'investigar' },
  { texto: 'Crear herramientas', icono: 'herramienta', palabra: 'herramientas' },
  { texto: 'Resolver problemas', icono: 'idea', palabra: 'problemas' },
];

export const A4Mundo: React.FC<{ dur: number; inicio: number }> = ({ dur, inicio }) => {
  const f = useF();
  return (
    <Escena dur={dur} inicio={inicio} entrada="fundido" salida="fundido">
      <div style={{ position: 'absolute', left: X, top: 262, width: 960 }}>
        <Linea entra={8} style={{ fontWeight: 700, fontSize: 58, lineHeight: 1.05, color: C.suave }}>
          Cuatro áreas para
        </Linea>
        <Linea entra={16} style={{ fontWeight: 900, fontSize: 106, lineHeight: 1.02, letterSpacing: -3.5 }}>
          entender el <span style={{ color: C.acento }}>mundo</span>
        </Linea>
      </div>
      {ACCIONES.map((a, i) => {
        const entra = palabraEn('mundo', a.palabra) - 6;
        const dibujo = rampa(f, entra + 4, entra + 24, salida);
        return (
          <Sube key={a.texto} entra={entra} dist={34} style={{ position: 'absolute', left: X, top: 540 + i * 140, width: 520, height: 118, ...vidrio(24), display: 'flex', alignItems: 'center', gap: 22, padding: '0 28px' }}>
            <svg width={64} height={64} viewBox="0 0 72 72" style={{ flexShrink: 0 }}>
              <path d={ICONOS[a.icono]} fill="none" stroke={C.acento} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - dibujo} />
            </svg>
            <div style={{ fontWeight: 900, fontSize: 40, letterSpacing: -0.5, whiteSpace: 'nowrap' }}>{a.texto}</div>
          </Sube>
        );
      })}
      <Persona cual="camila" ancho={650} left={440} top={960} entra={22} />
    </Escena>
  );
};
