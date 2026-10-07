import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLOR_SOMBRA, Papel, Tag, Trama, Trazo, sacudida } from '../componentes/collage';
import { C, entrada, rampa } from '../../marca';

// 0–3 s · «Cuatro letras que reúnen muchas carreras.» en cortes rápidos, una palabra por plano
// (la tipografía cinética hace de subtítulo en este tramo), y remate con S · T · E · M en bloques de color.

const Golpe: React.FC<{ texto: string; tam: number; color: string; top: number; entra: number; contorno?: boolean; ls?: number }> = ({ texto, tam, color, top, entra, contorno, ls = -0.035 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: f - entra, fps, config: { damping: 9, stiffness: 300, mass: 0.6 } });
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top,
        textAlign: 'center',
        fontWeight: 900,
        fontSize: tam,
        lineHeight: 0.9,
        letterSpacing: tam * ls,
        color: contorno ? 'transparent' : color,
        WebkitTextStroke: contorno ? `6px ${color}` : undefined,
        scale: String(1.9 - 0.9 * sp),
        translate: `${sacudida(f, entra + 2, 12)}px 0px`,
        opacity: f >= entra ? 1 : 0,
        whiteSpace: 'nowrap',
        filter: contorno ? undefined : `drop-shadow(12px 14px 0 ${COLOR_SOMBRA})`,
      }}
    >
      {texto}
    </div>
  );
};

const Cuatro: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.fondoA }}>
      <Trama color="rgba(255,255,255,0.12)" paso={26} radio={5} style={{ inset: 0 }} mascara="linear-gradient(160deg, #000 0%, transparent 60%)" />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 180, textAlign: 'center', fontWeight: 900, fontSize: 1500, lineHeight: 1, color: 'transparent', WebkitTextStroke: '7px rgba(255,255,255,0.28)', rotate: `${-10 + 10 * rampa(f, 0, 16)}deg`, scale: String(1.15 - 0.15 * rampa(f, 0, 16)), opacity: rampa(f, 0, 4) }}>
        4
      </div>
      <Golpe texto="CUATRO" tam={230} color={C.blanco} top={790} entra={5} />
      <div style={{ position: 'absolute', left: 140, top: 1020, height: 22, width: 800 * rampa(f, 7, 14), background: C.acento, rotate: '-2deg' }} />
      <Papel opacidad={0.35} modo="soft-light" />
    </AbsoluteFill>
  );
};

const MINI = [
  { l: 'S', fondo: C.azul, color: C.blanco, x: 110, y: 400, rot: -10, e: 1 },
  { l: 'T', fondo: C.acento, color: C.blanco, x: 790, y: 450, rot: 9, e: 3 },
  { l: 'E', fondo: C.fondoB, color: C.blanco, x: 150, y: 1190, rot: 7, e: 5 },
  { l: 'M', fondo: C.blanco, color: C.azul, x: 780, y: 1160, rot: -8, e: 7 },
];

const Letras: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: '#F2F4FA' }}>
      <Golpe texto="LETRAS" tam={250} color={C.azul} top={800} entra={0} />
      {MINI.map((m) => {
        const sp = spring({ frame: f - m.e, fps, config: { damping: 10, stiffness: 260, mass: 0.5 } });
        return (
          <div key={m.l} style={{ position: 'absolute', left: m.x, top: m.y, width: 170, height: 170, background: m.fondo, border: m.fondo === C.blanco ? `5px solid ${C.azul}` : undefined, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 130, color: m.color, rotate: `${m.rot}deg`, scale: String(Math.max(0, sp)), boxShadow: `12px 14px 0 ${COLOR_SOMBRA}`, paddingBottom: 8 }}>
            {m.l}
          </div>
        );
      })}
      <Papel opacidad={0.6} />
    </AbsoluteFill>
  );
};

const QueReunen: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.acento }}>
      <Trama color="rgba(36,58,117,0.28)" paso={24} radio={5.5} style={{ right: 0, bottom: 0, width: 900, height: 900 }} mascara="radial-gradient(75% 75% at 100% 100%, #000 0%, transparent 75%)" />
      <Golpe texto="QUE" tam={150} color={C.blanco} top={620} entra={0} />
      <Golpe texto="REÚNEN" tam={235} color={C.blanco} top={770} entra={5} />
      {/* dos trazos que se encuentran en el centro: «reunir» */}
      <Trazo d="M 0 60 C 160 60, 260 10, 420 60" color={C.azul} ancho={14} desde={7} dur={8} viewBox="0 0 440 120" style={{ left: 100, top: 1030, width: 440, height: 120 }} />
      <Trazo d="M 440 60 C 280 60, 180 110, 20 60" color={C.blanco} ancho={14} desde={7} dur={8} viewBox="0 0 440 120" style={{ left: 540, top: 1030, width: 440, height: 120 }} />
      <div style={{ position: 'absolute', left: 520, top: 1070, width: 40, height: 40, borderRadius: 20, background: C.blanco, scale: String(rampa(f, 14, 17)) }} />
      <Papel opacidad={0.35} modo="soft-light" />
    </AbsoluteFill>
  );
};

const Muchas: React.FC = () => {
  const f = useCurrentFrame();
  const fila = 'MUCHAS MUCHAS MUCHAS MUCHAS MUCHAS';
  return (
    <AbsoluteFill style={{ background: C.fondoB, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, scale: String(1.18 - 0.18 * rampa(f, 0, 6)) }}>
        {Array.from({ length: 9 }, (_, i) => {
          const solida = i === 4;
          const dir = i % 2 ? 1 : -1;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: -600,
                top: -60 + i * 228,
                fontWeight: 900,
                fontSize: 220,
                lineHeight: 1,
                letterSpacing: -6,
                whiteSpace: 'nowrap',
                color: solida ? C.blanco : 'transparent',
                WebkitTextStroke: solida ? undefined : `4px rgba(255,255,255,${i % 2 ? 0.35 : 0.2})`,
                translate: `${dir * f * 22 + (i % 3) * 140}px 0px`,
              }}
            >
              {fila}
            </div>
          );
        })}
      </div>
      <Papel opacidad={0.3} modo="soft-light" />
    </AbsoluteFill>
  );
};

const CARRERAS_EJEMPLO = [
  { t: 'Biología', x: 70, y: 330, rot: -6, fondo: C.azul, color: C.blanco },
  { t: 'Química', x: 620, y: 300, rot: 5, fondo: C.acento, color: C.blanco },
  { t: 'Física', x: 330, y: 470, rot: -3, fondo: C.blanco, color: C.azul },
  { t: 'Informática', x: 610, y: 560, rot: 7, fondo: C.fondoB, color: C.blanco },
  { t: 'Desarrollo de software', x: 60, y: 1150, rot: 4, fondo: C.acento, color: C.blanco },
  { t: 'Ingeniería civil', x: 560, y: 1250, rot: -5, fondo: C.azul, color: C.blanco },
  { t: 'Ingeniería mecánica', x: 110, y: 1370, rot: -2, fondo: C.blanco, color: C.azul },
  { t: 'Estadística', x: 640, y: 1450, rot: 6, fondo: C.fondoB, color: C.blanco },
];

const Carreras: React.FC = () => (
  <AbsoluteFill style={{ background: '#F2F4FA' }}>
    <Trama color="rgba(36,58,117,0.18)" paso={22} radio={4.5} style={{ inset: 0 }} mascara="radial-gradient(60% 40% at 50% 50%, #000 0%, transparent 85%)" />
    <Golpe texto="CARRERAS" tam={196} color={C.azul} top={800} entra={0} />
    <Trazo d="M 10 40 C 120 0, 200 80, 320 40 S 520 0, 640 40 S 820 80, 880 30" color={C.acento} ancho={16} desde={3} dur={9} viewBox="0 0 900 90" style={{ left: 90, top: 1000, width: 900, height: 90 }} />
    {CARRERAS_EJEMPLO.map((c, i) => (
      <Tag key={c.t} texto={c.t} fondo={c.fondo} color={c.color} left={c.x} top={c.y} rot={c.rot} entra={1 + i * 2} tam={40} />
    ))}
    <Papel opacidad={0.6} />
  </AbsoluteFill>
);

// S · T · E · M en bloques de color; al final la cámara entra en la S (corte de continuidad con la escena siguiente)
const BLOQUES = [
  { l: 'S', fondo: '#F2F4FA', color: C.azul, x: 0, y: 0, dx: -1, dy: -1 },
  { l: 'T', fondo: C.azul, color: C.blanco, x: 540, y: 0, dx: 1, dy: -1 },
  { l: 'E', fondo: C.acento, color: C.blanco, x: 0, y: 960, dx: -1, dy: 1 },
  { l: 'M', fondo: C.fondoB, color: C.blanco, x: 540, y: 960, dx: 1, dy: 1 },
];

const Bloques: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoom = rampa(f, 12, 18, entrada);
  return (
    <AbsoluteFill style={{ background: C.fondoB }}>
      <div style={{ position: 'absolute', inset: 0, scale: String(1 + zoom * 1.0), transformOrigin: '270px 480px', translate: `${sacudida(f, 12, 6)}px 0px` }}>
        {BLOQUES.map((b, i) => {
          const sp = spring({ frame: f - i * 4, fps, config: { damping: 14, stiffness: 320, mass: 0.5 } });
          const le = spring({ frame: f - i * 4 - 1, fps, config: { damping: 8, stiffness: 300, mass: 0.5 } });
          return (
            <div key={b.l} style={{ position: 'absolute', left: b.x, top: b.y, width: 540, height: 960, background: b.fondo, translate: `${(1 - sp) * b.dx * 560}px ${(1 - sp) * b.dy * 980}px`, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontWeight: 900, fontSize: 600, lineHeight: 0.8, letterSpacing: -18, color: b.color, scale: String(1.6 - 0.6 * le), paddingBottom: 30 }}>{b.l}</div>
            </div>
          );
        })}
      </div>
      <Papel opacidad={0.4} />
    </AbsoluteFill>
  );
};

export const R1Gancho: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={16} name="cuatro">
      <Cuatro />
    </Sequence>
    <Sequence from={16} durationInFrames={11} name="letras">
      <Letras />
    </Sequence>
    <Sequence from={27} durationInFrames={16} name="que reúnen">
      <QueReunen />
    </Sequence>
    <Sequence from={43} durationInFrames={11} name="muchas">
      <Muchas />
    </Sequence>
    <Sequence from={54} durationInFrames={18} name="carreras">
      <Carreras />
    </Sequence>
    <Sequence from={72} durationInFrames={18} name="S T E M">
      <Bloques />
    </Sequence>
  </AbsoluteFill>
);
