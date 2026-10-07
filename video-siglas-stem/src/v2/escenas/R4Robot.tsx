import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Camara, COLOR_SOMBRA, Papel, Tag, Trama, sacudida } from '../componentes/collage';
import { MundoIngenieria, MundoMatematicas, MundoTecnologia } from '../componentes/mundos';
import { Robot } from '../componentes/Robot';
import { C, rampa } from '../../marca';

// 19–24,4 s · «Para crear un robot, por ejemplo, se combinan programación, ingeniería y matemáticas.»
// Plano técnico que se dibuja → cortes secos al mundo de cada palabra mientras el robot se arma → «= un robot».
const PROG = 72;
const ING = 93;
const MAT = 123;
const IGUAL = 140;

const Palabra: React.FC<{ texto: string; color: string; entra: number; tam?: number; top?: number; signo?: string }> = ({ texto, color, entra, tam = 124, top = 300, signo }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: f - entra, fps, config: { damping: 9, stiffness: 300, mass: 0.6 } });
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, scale: String(1.8 - 0.8 * sp), translate: `${sacudida(f, entra + 2, 12)}px 0px`, opacity: f >= entra ? 1 : 0 }}>
      {signo && (
        <div style={{ width: tam * 0.78, height: tam * 0.78, borderRadius: '50%', background: C.acento, color: C.blanco, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: tam * 0.7, lineHeight: 1, paddingBottom: tam * 0.06, boxShadow: `8px 10px 0 ${COLOR_SOMBRA}` }}>{signo}</div>
      )}
      <div style={{ fontWeight: 900, fontSize: tam, lineHeight: 1, letterSpacing: -tam * 0.03, color, whiteSpace: 'nowrap', filter: `drop-shadow(10px 12px 0 ${COLOR_SOMBRA})` }}>{texto}</div>
    </div>
  );
};

const Confeti: React.FC<{ desde: number }> = ({ desde }) => {
  const f = useCurrentFrame();
  const t = f - desde;
  if (t < 0) return null;
  const piezas = Array.from({ length: 26 }, (_, i) => {
    const ang = (i / 26) * Math.PI * 2 + (i % 3) * 0.3;
    const vel = 26 + (i % 5) * 7;
    const x = 540 + Math.cos(ang) * vel * t;
    const y = 1000 + Math.sin(ang) * vel * t + 0.9 * t * t;
    const forma = i % 4;
    const color = [C.blanco, C.azul, C.fondoB, C.cian][i % 4];
    return { x, y, forma, color, rot: t * (8 + (i % 6) * 3) * (i % 2 ? 1 : -1), i };
  });
  return (
    <>
      {piezas.map((p) => (
        <div key={p.i} style={{ position: 'absolute', left: p.x, top: p.y, rotate: `${p.rot}deg`, fontWeight: 900, fontSize: 64, lineHeight: 1, color: p.color }}>
          {p.forma === 0 ? 'STEM'[p.i % 4] : p.forma === 1 ? <div style={{ width: 30, height: 30, background: p.color }} /> : p.forma === 2 ? <div style={{ width: 34, height: 34, borderRadius: 17, background: p.color }} /> : '+'}
        </div>
      ))}
    </>
  );
};

export const R4Robot: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fase = f < PROG ? 0 : f < ING ? 1 : f < MAT ? 2 : f < IGUAL ? 3 : 4;
  const rayos = f * 0.6;
  const t1 = spring({ frame: f - 6, fps, config: { damping: 9, stiffness: 300, mass: 0.6 } });

  return (
    <AbsoluteFill>
      {fase <= 0 && <MundoIngenieria engranajes={false} />}
      {fase === 1 && <MundoTecnologia desfase={40} />}
      {fase === 2 && <MundoIngenieria desfase={40} />}
      {fase === 3 && <MundoMatematicas curva={false} />}
      {fase === 4 && (
        <AbsoluteFill style={{ background: C.acento }}>
          <AbsoluteFill style={{ background: `repeating-conic-gradient(from ${rayos}deg at 50% 55%, rgba(255,255,255,0.16) 0deg 9deg, transparent 9deg 18deg)` }} />
          <Trama color="rgba(36,58,117,0.25)" paso={24} radio={5} style={{ inset: 0 }} mascara="radial-gradient(60% 45% at 50% 55%, transparent 40%, #000 100%)" />
          <Papel opacidad={0.35} modo="soft-light" />
        </AbsoluteFill>
      )}

      <Camara dur={162} golpes={[6, 22, PROG, ING, MAT, IGUAL]} deriva={[1, 1.04]} origen="50% 55%">
        {fase === 0 && (
          <>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 220, textAlign: 'center', fontWeight: 900, fontSize: 100, lineHeight: 1, letterSpacing: -2, color: C.blanco, scale: String(1.8 - 0.8 * t1), opacity: f >= 6 ? 1 : 0 }}>PARA CREAR</div>
            <Palabra texto="UN ROBOT" color={C.acento} entra={22} tam={190} top={330} />
            {/* cotas del plano */}
            <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
              {[
                [190, 640, 190, 1450],
                [890, 640, 890, 1450],
                [240, 1500, 840, 1500],
              ].map(([x1, y1, x2, y2], i) => (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.7)" strokeWidth={4} strokeDasharray="1" pathLength={1} strokeDashoffset={1 - rampa(f, 20 + i * 6, 44 + i * 6)} />
              ))}
            </svg>
          </>
        )}
        {fase >= 1 && (
          <div style={{ position: 'absolute', left: 64, right: 64, top: 180, display: 'flex', gap: 12, justifyContent: 'center' }}>
            {/* la suma se va acumulando arriba */}
            <Tag texto="PROGRAMACIÓN" fondo={C.blanco} color={C.azul} left={0} top={0} rot={-3} entra={PROG + 4} tam={24} />
            {fase >= 2 && <Tag texto="+ INGENIERÍA" fondo={C.acento} color={C.blanco} left={330} top={6} rot={2} entra={ING + 4} tam={24} />}
            {fase >= 3 && <Tag texto="+ MATEMÁTICAS" fondo={C.azul} color={C.blanco} left={620} top={-2} rot={-2} entra={MAT + 4} tam={24} />}
          </div>
        )}
        {fase === 1 && <Palabra texto="PROGRAMACIÓN" color={C.blanco} entra={PROG} tam={122} />}
        {fase === 2 && <Palabra texto="INGENIERÍA" color={C.blanco} entra={ING} tam={128} signo="+" />}
        {fase === 3 && <Palabra texto="MATEMÁTICAS" color={C.azul} entra={MAT} tam={118} signo="+" />}
        {fase === 4 && <Palabra texto="= UN ROBOT" color={C.blanco} entra={IGUAL} tam={140} top={290} />}

        <Confeti desde={IGUAL + 2} />
        <div style={{ position: 'absolute', left: 260, top: 600, scale: String(fase === 4 ? 1 + 0.06 * spring({ frame: f - IGUAL, fps, config: { damping: 8, stiffness: 200, mass: 0.6 } }) : 1) }}>
          <Robot f={f} cabeza={PROG + 2} cuerpo={ING + 2} pecho={MAT + 2} vivo={IGUAL + 3} ancho={560} revelado={rampa(f, 8, 50)} linea={C.azul} />
        </div>
      </Camara>
    </AbsoluteFill>
  );
};
