import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Camara, Papel, Tag, Trama } from '../componentes/collage';
import { MundoIngenieria, MundoMatematicas, MundoTecnologia } from '../componentes/mundos';
import { Robot } from '../componentes/Robot';
import bloques from '../datos/subtitulos.json';
import { C, FPS, rampa, salida } from '../marca';
import { ESCENAS, palabraEn } from '../tiempos';

// 46,8–53,8 s · «Para crear un robot, por ejemplo, se combinan programación, ingeniería y matemáticas.»
// Plano técnico que se dibuja → el fondo pasa (con fundido) al mundo de cada palabra mientras el robot se arma → «= un robot».
const PROG = palabraEn('robot', 'programación') - 4;
const ING = palabraEn('robot', 'ingeniería') - 4;
const MAT = palabraEn('robot', 'matemáticas') - 4;
// «= un robot» llega justo cuando termina la frase (mismo cálculo que herramientas/audio.py)
const fin = (bloques as { inicio: number; fin: number; palabras: { t: string }[] }[]).find((b) => b.inicio > ESCENAS.robot.from / FPS && b.palabras[b.palabras.length - 1].t.startsWith('matemáticas'))!;
const IGUAL = Math.round((fin.fin - 0.25) * FPS) - ESCENAS.robot.from;

const Palabra: React.FC<{ texto: string; color: string; entra: number; tam?: number; top?: number; signo?: string }> = ({ texto, color, entra, tam = 124, top = 300, signo }) => {
  const f = useCurrentFrame();
  const t = rampa(f, entra, entra + 14, salida);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, scale: String(1.15 - 0.15 * t), translate: `0px ${(1 - t) * 40}px`, opacity: t }}>
      {signo && (
        <div style={{ width: tam * 0.78, height: tam * 0.78, borderRadius: '50%', background: C.acento, color: C.blanco, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: tam * 0.7, lineHeight: 1, paddingBottom: tam * 0.06 }}>{signo}</div>
      )}
      <div style={{ fontWeight: 900, fontSize: tam, lineHeight: 1, letterSpacing: -tam * 0.03, color, whiteSpace: 'nowrap' }}>{texto}</div>
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
    const color = [C.blanco, C.azul, C.fondoB, C.blanco][i % 4]; // sobre el fondo rojo: blanco y azules (el cian se perdía)
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

export const V6Robot: React.FC = () => {
  const f = useCurrentFrame();
  const fase = f < PROG ? 0 : f < ING ? 1 : f < MAT ? 2 : f < IGUAL ? 3 : 4;
  const rayos = f * 0.4;
  // El fondo cambia 8 fotogramas ANTES que la palabra: así el fondo ya está asentado cuando entra el texto
  // (con el fundido a medias, «MATEMÁTICAS» azul quedaba sobre un azul grisáceo y «= UN ROBOT» blanco sobre un rosa pálido).
  const ADELANTO = 8;
  const capa = (desde: number, hasta: number) => rampa(f, desde - ADELANTO, desde) * (1 - rampa(f, hasta - ADELANTO, hasta));
  const titulo = rampa(f, 6, 20, salida);

  return (
    <AbsoluteFill>
      <MundoIngenieria engranajes={false} />
      <AbsoluteFill style={{ opacity: capa(PROG, ING) }}>
        <MundoTecnologia desfase={40} />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: capa(ING, MAT) }}>
        <MundoIngenieria desfase={40} />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: capa(MAT, IGUAL) }}>
        <MundoMatematicas curva={false} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: C.acento, opacity: rampa(f, IGUAL - ADELANTO, IGUAL) }}>
        <AbsoluteFill style={{ background: `repeating-conic-gradient(from ${rayos}deg at 50% 55%, rgba(255,255,255,0.14) 0deg 9deg, transparent 9deg 18deg)` }} />
        <Trama color="rgba(36,58,117,0.25)" paso={24} radio={5} style={{ inset: 0 }} mascara="radial-gradient(60% 45% at 50% 55%, transparent 40%, #000 100%)" />
        <Papel opacidad={0.35} modo="soft-light" />
      </AbsoluteFill>

      <Camara dur={210} deriva={[1, 1.04]} origen="50% 55%">
        {fase === 0 && (
          <>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 220, textAlign: 'center', fontWeight: 900, fontSize: 100, lineHeight: 1, letterSpacing: -2, color: C.blanco, opacity: titulo, translate: `0px ${(1 - titulo) * 40}px` }}>PARA CREAR</div>
            <Palabra texto="UN ROBOT" color={C.acento} entra={palabraEn('robot', 'robot') - 6} tam={190} top={330} />
            {/* cotas del plano */}
            <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
              {[
                [190, 640, 190, 1450],
                [890, 640, 890, 1450],
                [240, 1500, 840, 1500],
              ].map(([x1, y1, x2, y2], i) => (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.7)" strokeWidth={4} strokeDasharray="1" pathLength={1} strokeDashoffset={1 - rampa(f, 24 + i * 8, 54 + i * 8)} />
              ))}
            </svg>
          </>
        )}
        {fase >= 1 && (
          <div style={{ position: 'absolute', left: 64, right: 64, top: 180, display: 'flex', gap: 12, justifyContent: 'center' }}>
            {/* la suma se va acumulando arriba */}
            {/* borde blanco: el fondo pasa de azul a claro y a rojo, y estas etiquetas deben leerse sobre los tres */}
            <Tag texto="PROGRAMACIÓN" fondo={C.fondoB} color={C.blanco} borde={C.blanco} left={0} top={0} rot={-3} entra={PROG + 4} tam={24} />
            {fase >= 2 && <Tag texto="+ INGENIERÍA" fondo={C.acento} color={C.blanco} borde={C.blanco} left={330} top={6} rot={2} entra={ING + 4} tam={24} />}
            {fase >= 3 && <Tag texto="+ MATEMÁTICAS" fondo={C.azul} color={C.blanco} borde={C.blanco} left={620} top={-2} rot={-2} entra={MAT + 4} tam={24} />}
          </div>
        )}
        {fase === 1 && <Palabra texto="PROGRAMACIÓN" color={C.blanco} entra={PROG} tam={122} />}
        {fase === 2 && <Palabra texto="INGENIERÍA" color={C.blanco} entra={ING} tam={128} signo="+" />}
        {fase === 3 && <Palabra texto="MATEMÁTICAS" color={C.azul} entra={MAT} tam={118} signo="+" />}
        {fase === 4 && <Palabra texto="= UN ROBOT" color={C.blanco} entra={IGUAL} tam={140} top={290} />}

        <Confeti desde={IGUAL + 2} />
        <div style={{ position: 'absolute', left: 260, top: 600, scale: String(1 + 0.06 * rampa(f, IGUAL, IGUAL + 16, salida)) }}>
          <Robot f={f} cabeza={PROG + 2} cuerpo={ING + 2} pecho={MAT + 2} vivo={IGUAL + 3} ancho={560} revelado={rampa(f, 10, 60)} linea={C.azul} />
        </div>
      </Camara>
    </AbsoluteFill>
  );
};
