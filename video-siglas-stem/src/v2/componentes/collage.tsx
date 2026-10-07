// Piezas de collage editorial: papel, trama de puntos, stickers, cintas, sellos, fotos con cinta y trazos a mano.
import type { CSSProperties, ReactNode } from 'react';
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { rampa } from '../../marca';

const SOMBRA_PAPEL = 'rgba(8,18,56,0.32)';

/** Textura de papel impreso. `multiply` sobre fondos claros, `soft-light` sobre fondos oscuros. */
export const Papel: React.FC<{ opacidad?: number; modo?: CSSProperties['mixBlendMode'] }> = ({ opacidad = 0.55, modo = 'multiply' }) => (
  <Img src={staticFile('papel.jpg')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: modo, opacity: opacidad }} />
);

/** Trama de puntos (semitono) con desvanecido opcional. */
export const Trama: React.FC<{ color: string; paso?: number; radio?: number; mascara?: string; style?: CSSProperties }> = ({ color, paso = 22, radio = 4.5, mascara, style }) => (
  <div
    style={{
      position: 'absolute',
      backgroundImage: `radial-gradient(circle, ${color} ${radio}px, transparent ${radio + 0.6}px)`,
      backgroundSize: `${paso}px ${paso}px`,
      maskImage: mascara,
      WebkitMaskImage: mascara,
      ...style,
    }}
  />
);

export const STICKERS = {
  pareja: { src: 'stickers/pareja_senalando.png', w: 896, h: 1083 },
  elias: { src: 'stickers/elias_calculadora.png', w: 675, h: 1107 },
  camila: { src: 'stickers/camila_vr.png', w: 797, h: 993 },
} as const;

/** Persona recortada con borde blanco y sombra dura de papel. Entra con resorte y queda «respirando». */
export const Sticker: React.FC<{
  cual: keyof typeof STICKERS;
  ancho: number;
  left: number;
  top: number;
  entra: number;
  rot?: number;
  desde?: 'abajo' | 'derecha' | 'izquierda' | 'pop';
}> = ({ cual, ancho, left, top, entra, rot = 0, desde = 'abajo' }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = STICKERS[cual];
  const sp = spring({ frame: f - entra, fps, config: { damping: 13, stiffness: 150, mass: 0.8 } });
  const resp = Math.sin((f - entra) / 16) * 1.1 * rampa(f, entra + 10, entra + 20);
  const dx = desde === 'derecha' ? (1 - sp) * 900 : desde === 'izquierda' ? (1 - sp) * -900 : 0;
  const dy = desde === 'abajo' ? (1 - sp) * 1100 : 0;
  const esc = desde === 'pop' ? Math.max(0, sp) : 1;
  return (
    <Img
      src={staticFile(s.src)}
      style={{
        position: 'absolute',
        left,
        top,
        width: ancho,
        height: (ancho * s.h) / s.w,
        translate: `${dx}px ${dy}px`,
        rotate: `${rot + (1 - sp) * (desde === 'izquierda' ? -14 : 14) + resp}deg`,
        scale: String(esc),
        transformOrigin: '50% 90%',
        filter: `drop-shadow(18px 22px 0 ${SOMBRA_PAPEL})`,
        opacity: f >= entra ? 1 : 0,
      }}
    />
  );
};

const Estrella: React.FC<{ color: string; tam: number }> = ({ color, tam }) => (
  <svg width={tam} height={tam} viewBox="-20 -20 40 40" style={{ margin: `0 ${tam * 0.45}px`, flexShrink: 0 }}>
    <path d="M 0 -18 L 4.5 -4.5 L 18 0 L 4.5 4.5 L 0 18 L -4.5 4.5 L -18 0 L -4.5 -4.5 Z" fill={color} />
  </svg>
);

/** Cinta rotada que cruza la pantalla con el texto repitiéndose (marquesina). */
export const Cinta: React.FC<{
  texto: string;
  fondo: string;
  color: string;
  top: number;
  rot: number;
  entra: number;
  tam?: number;
  alto?: number;
  vel?: number;
  sentido?: 1 | -1;
  estrella?: string;
}> = ({ texto, fondo, color, top, rot, entra, tam = 92, alto = 150, vel = 9, sentido = 1, estrella }) => {
  const f = useCurrentFrame();
  const abre = rampa(f, entra, entra + 9);
  const corrido = (f - entra) * vel * sentido;
  return (
    <div
      style={{
        position: 'absolute',
        left: -400,
        width: 1880,
        top,
        height: alto,
        rotate: `${rot}deg`,
        background: fondo,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        scale: `${abre} 1`,
        transformOrigin: sentido === 1 ? '100% 50%' : '0% 50%',
        boxShadow: `0 16px 0 ${SOMBRA_PAPEL}`,
        opacity: f >= entra ? 1 : 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', translate: `${-1400 - corrido}px 0px`, paddingTop: tam * 0.08 }}>
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontWeight: 900, fontSize: tam, letterSpacing: 2, color, lineHeight: 1 }}>{texto}</span>
            <Estrella color={estrella ?? color} tam={tam * 0.42} />
          </div>
        ))}
      </div>
    </div>
  );
};

/** Palabra «sellada»: cae grande, golpea con rebote, tiembla y deja un anillo de impacto. */
export const Sello: React.FC<{
  texto: ReactNode;
  fondo: string;
  color: string;
  left: number;
  top: number;
  rot: number;
  entra: number;
  tam?: number;
  origen?: string;
}> = ({ texto, fondo, color, left, top, rot, entra, tam = 160, origen = '30% 50%' }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: f - entra, fps, config: { damping: 9, stiffness: 280, mass: 0.6 } });
  const d = f - entra - 4;
  const tiembla = d > 0 ? Math.sin(d * 3.1) * 7 * Math.exp(-d / 3) : 0;
  const anillo = rampa(f, entra + 3, entra + 14);
  const caja: CSSProperties = { padding: `${tam * 0.06}px ${tam * 0.2}px ${tam * 0.12}px`, borderRadius: 10 };
  return (
    <div style={{ position: 'absolute', left, top, rotate: `${rot + (1 - sp) * -10}deg`, scale: String(2.5 - 1.5 * sp), translate: `${tiembla}px 0px`, transformOrigin: origen, opacity: f >= entra ? 1 : 0 }}>
      <div style={{ ...caja, position: 'absolute', inset: 0, border: `6px solid ${fondo}`, scale: String(1 + anillo * 0.35), opacity: (1 - anillo) * (f >= entra + 3 ? 0.9 : 0) }} />
      <div style={{ ...caja, background: fondo, color, fontWeight: 900, fontSize: tam, lineHeight: 1, letterSpacing: -tam * 0.03, whiteSpace: 'nowrap', boxShadow: `14px 16px 0 ${SOMBRA_PAPEL}` }}>{texto}</div>
    </div>
  );
};

/** Etiqueta pequeña tipo rótulo («EN INGLÉS», «EN ESPAÑOL»). */
export const Tag: React.FC<{ texto: string; fondo: string; color: string; left: number; top: number; rot?: number; entra: number; tam?: number }> = ({
  texto,
  fondo,
  color,
  left,
  top,
  rot = -3,
  entra,
  tam = 28,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: f - entra, fps, config: { damping: 11, stiffness: 240, mass: 0.5 } });
  return (
    <div style={{ position: 'absolute', left, top, rotate: `${rot}deg`, scale: String(Math.max(0, sp)), transformOrigin: '0% 50%', padding: `${tam * 0.32}px ${tam * 0.6}px`, background: fondo, color, fontWeight: 700, fontSize: tam, letterSpacing: tam * 0.16, lineHeight: 1, whiteSpace: 'nowrap', boxShadow: `6px 7px 0 ${SOMBRA_PAPEL}` }}>
      {texto}
    </div>
  );
};

/** Foto pegada con dos trozos de cinta adhesiva. */
export const FotoCinta: React.FC<{ src: string; left: number; top: number; ancho: number; rot: number; entra: number }> = ({ src, left, top, ancho, rot, entra }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: f - entra, fps, config: { damping: 12, stiffness: 170, mass: 0.7 } });
  const alto = ancho * 1.5;
  const borde = ancho * 0.045;
  const cinta: CSSProperties = { position: 'absolute', width: ancho * 0.36, height: ancho * 0.11, background: 'rgba(255,246,222,0.78)', boxShadow: '0 2px 4px rgba(0,0,0,0.12)' };
  return (
    <div style={{ position: 'absolute', left, top, width: ancho + borde * 2, height: alto + borde * 2, rotate: `${rot + (1 - sp) * 18}deg`, translate: `0px ${(1 - sp) * -260}px`, scale: String(1 + (1 - sp) * 0.25), opacity: f >= entra ? 1 : 0 }}>
      <div style={{ position: 'absolute', inset: 0, background: '#fff', boxShadow: `16px 20px 0 ${SOMBRA_PAPEL}` }} />
      <Img src={staticFile(src)} style={{ position: 'absolute', left: borde, top: borde, width: ancho, height: alto, objectFit: 'cover', scale: String(1.06 - 0.06 * rampa(f, entra, entra + 90)) }} />
      <div style={{ ...cinta, left: -ancho * 0.06, top: -ancho * 0.03, rotate: '-28deg' }} />
      <div style={{ ...cinta, right: -ancho * 0.06, top: -ancho * 0.03, rotate: '27deg' }} />
    </div>
  );
};

/** Trazo SVG que se dibuja a mano (pathLength normalizado). */
export const Trazo: React.FC<{ d: string; color: string; ancho?: number; desde: number; dur: number; viewBox: string; style: CSSProperties; tapa?: 'round' | 'butt' }> = ({
  d,
  color,
  ancho = 8,
  desde,
  dur,
  viewBox,
  style,
  tapa = 'round',
}) => {
  const f = useCurrentFrame();
  const p = rampa(f, desde, desde + dur);
  return (
    <svg viewBox={viewBox} style={{ position: 'absolute', overflow: 'visible', ...style }}>
      <path d={d} fill="none" stroke={color} strokeWidth={ancho} strokeLinecap={tapa} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} opacity={f >= desde ? 1 : 0} />
    </svg>
  );
};

/** Letra gigante con relleno de trama (semitono) y sombra dura. */
export const LetraGigante: React.FC<{ letra: string; tam: number; color: string; trama?: string; left: number; top: number; style?: CSSProperties }> = ({ letra, tam, color, trama, left, top, style }) => (
  <div
    style={{
      position: 'absolute',
      left,
      top,
      fontWeight: 900,
      fontSize: tam,
      lineHeight: 0.8,
      letterSpacing: -tam * 0.03,
      backgroundImage: trama
        ? `radial-gradient(circle, ${trama} ${tam * 0.0042}px, transparent ${tam * 0.0042 + 0.6}px), linear-gradient(${color}, ${color})`
        : `linear-gradient(${color}, ${color})`,
      backgroundSize: trama ? `${tam * 0.014}px ${tam * 0.014}px, 100% 100%` : '100% 100%',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
      filter: `drop-shadow(22px 26px 0 ${SOMBRA_PAPEL})`,
      ...style,
    }}
  >
    {letra}
  </div>
);

/** Zoom de cámara: deriva lenta + «golpes» que empujan la escala en los fotogramas indicados. */
export const Camara: React.FC<{ dur: number; golpes?: number[]; children: ReactNode; deriva?: [number, number]; origen?: string }> = ({ dur, golpes = [], children, deriva = [1, 1.045], origen = '50% 45%' }) => {
  const f = useCurrentFrame();
  const base = interpolate(f, [0, dur], deriva, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  let golpe = 0;
  let giro = 0;
  for (const g of golpes) {
    const d = f - g;
    if (d >= 0 && d < 10) {
      golpe += 0.045 * Math.pow(1 - d / 10, 2);
      giro += Math.sin(d * 2.2) * 0.5 * (1 - d / 10);
    }
  }
  return <div style={{ position: 'absolute', inset: 0, scale: String(base + golpe), rotate: `${giro}deg`, transformOrigin: origen }}>{children}</div>;
};

/** Sacudida de entrada para elementos que «golpean» (traslación decreciente). */
export const sacudida = (f: number, golpe: number, fuerza = 14) => {
  const d = f - golpe;
  return d < 0 ? 0 : Math.sin(d * 2.6) * fuerza * Math.exp(-d / 3.4);
};

export const COLOR_SOMBRA = SOMBRA_PAPEL;
