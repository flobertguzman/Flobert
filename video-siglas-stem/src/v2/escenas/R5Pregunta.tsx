import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Camara, COLOR_SOMBRA, Papel, Sticker, Trama, sacudida } from '../componentes/collage';
import { MundoCiencia, MundoIngenieria, MundoMatematicas, MundoTecnologia } from '../componentes/mundos';
import { SCRIPT } from '../../fonts';
import { C, SCRIPT_ROT, rampa } from '../../marca';

// 24,4–27 s · «¿Qué área te da más curiosidad?» Elías señala las cuatro áreas, que flotan junto a su mano.
// La tipografía cinética hace de subtítulo en este tramo.
const OPCIONES = [
  { l: 'S', Mundo: MundoCiencia, color: C.azul, x: 780, y: 1010, rot: -8 },
  { l: 'T', Mundo: MundoTecnologia, color: C.blanco, x: 924, y: 1040, rot: 7 },
  { l: 'E', Mundo: MundoIngenieria, color: C.blanco, x: 790, y: 1170, rot: 5 },
  { l: 'M', Mundo: MundoMatematicas, color: C.azul, x: 930, y: 1196, rot: -6 },
];

const Linea: React.FC<{ texto: string; top: number; entra: number; tam: number; color: string }> = ({ texto, top, entra, tam, color }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: f - entra, fps, config: { damping: 9, stiffness: 300, mass: 0.6 } });
  return (
    <div style={{ position: 'absolute', left: 64, top, fontWeight: 900, fontSize: tam, lineHeight: 1, letterSpacing: -tam * 0.03, color, whiteSpace: 'nowrap', transformOrigin: '0% 50%', scale: String(1.7 - 0.7 * sp), translate: `${sacudida(f, entra + 2, 10)}px 0px`, opacity: f >= entra ? 1 : 0, filter: `drop-shadow(10px 12px 0 ${COLOR_SOMBRA})` }}>
      {texto}
    </div>
  );
};

export const R5Pregunta: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const escribe = rampa(f, 24, 36);
  return (
    <AbsoluteFill style={{ background: C.fondoA }}>
      <Trama color="rgba(255,255,255,0.1)" paso={26} radio={5} style={{ inset: 0 }} mascara="linear-gradient(200deg, #000 0%, transparent 55%)" />
      <div style={{ position: 'absolute', right: -160, top: 120, fontWeight: 900, fontSize: 1500, lineHeight: 1, color: 'transparent', WebkitTextStroke: '6px rgba(255,255,255,0.12)', rotate: `${12 + f * 0.08}deg` }}>?</div>
      <Papel opacidad={0.35} modo="soft-light" />
      <Camara dur={78} golpes={[0, 12, 26]} deriva={[1, 1.035]}>
        <Linea texto="¿QUÉ ÁREA" top={210} entra={0} tam={136} color={C.blanco} />
        <Linea texto="TE DA MÁS" top={355} entra={12} tam={136} color={C.blanco} />
        <div style={{ position: 'absolute', left: 50, top: 470, fontFamily: `${SCRIPT}, cursive`, fontWeight: 700, fontSize: 236, lineHeight: 1.1, color: C.acento, rotate: `${SCRIPT_ROT - 1}deg`, clipPath: `inset(-20% ${(1 - escribe) * 112 - 12}% -20% -5%)`, whiteSpace: 'nowrap', filter: `drop-shadow(10px 12px 0 ${COLOR_SOMBRA})` }}>
          curiosidad?
        </div>

        <Sticker cual="pareja" ancho={860} left={-30} top={900} entra={1} desde="abajo" />

        {OPCIONES.map((o, i) => {
          const sp = spring({ frame: f - 8 - i * 3, fps, config: { damping: 9, stiffness: 240, mass: 0.6 } });
          const flota = Math.sin((f + i * 11) / 7) * 6;
          const { Mundo } = o;
          return (
            <div key={o.l} style={{ position: 'absolute', left: o.x, top: o.y + flota, width: 128, height: 128, overflow: 'hidden', border: '5px solid #fff', boxSizing: 'border-box', rotate: `${o.rot}deg`, scale: String(Math.max(0, sp)), boxShadow: `9px 11px 0 ${COLOR_SOMBRA}` }}>
              <Mundo ancho={128} alto={128} desfase={i * 20} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 92, lineHeight: 0.8, color: o.color, paddingBottom: 6 }}>{o.l}</div>
            </div>
          );
        })}
      </Camara>
    </AbsoluteFill>
  );
};
