import { Escena, Linea, Persona, vidrio, useF } from '../componentes/base';
import { SCRIPT } from '../fonts';
import { C, SCRIPT_ROT, X, rampa, salida } from '../marca';
import { AREAS, palabraEn } from '../tiempos';

// 53,8–57 s · «¿Qué área te da más curiosidad?» Elías señala las cuatro áreas, que flotan junto a su mano.
const OPCIONES = [
  { x: 800, y: 1040 },
  { x: 936, y: 1070 },
  { x: 810, y: 1180 },
  { x: 946, y: 1206 },
];

export const A8Pregunta: React.FC<{ dur: number; inicio: number }> = ({ dur, inicio }) => {
  const f = useF();
  const curiosidad = palabraEn('pregunta', 'curiosidad');
  const escribe = rampa(f, curiosidad - 2, curiosidad + 14);
  return (
    <Escena dur={dur} inicio={inicio} entrada="fundido" salida="fundido">
      <div style={{ position: 'absolute', left: X, top: 262, width: 960 }}>
        <Linea entra={6} style={{ fontWeight: 700, fontSize: 70, lineHeight: 1.05 }}>
          ¿Qué área te da más
        </Linea>
      </div>
      <div style={{ position: 'absolute', left: 44, top: 340, fontFamily: `${SCRIPT}, cursive`, fontWeight: 700, fontSize: 220, lineHeight: 1.15, color: C.acento, rotate: `${SCRIPT_ROT}deg`, clipPath: `inset(-20% ${(1 - escribe) * 112 - 12}% -20% -5%)`, whiteSpace: 'nowrap' }}>
        curiosidad?
      </div>
      <Persona cual="pareja" ancho={860} left={30} top={900} entra={4} />
      {AREAS.map((a, i) => {
        const t = rampa(f, 14 + i * 4, 32 + i * 4, salida);
        const flota = Math.sin((f + i * 11) / 9) * 6;
        const o = OPCIONES[i];
        return (
          <div key={a.letra} style={{ position: 'absolute', left: o.x, top: o.y + flota, width: 118, height: 118, ...vidrio(22), background: 'rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 80, lineHeight: 0.8, paddingBottom: 6, opacity: t, scale: String(0.7 + 0.3 * t) }}>
            {a.letra}
          </div>
        );
      })}
    </Escena>
  );
};
