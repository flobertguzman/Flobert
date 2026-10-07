// Piezas de collage editorial (versión 4): papel, trama de puntos, stickers, cintas, sellos, fotos con cinta y trazos a mano.
// Respecto a la v2: sin sombras paralelas duras (solo sombras suaves y difusas) y entradas con curvas suaves en vez de rebotes.
import type { CSSProperties, ReactNode } from 'react';
import { Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { rampa, salida, suave } from '../marca';

/** Sombra difusa y discreta (sustituye a la sombra paralela de la v2). */
export const SOMBRA_SUAVE = '0 18px 40px rgba(8,18,56,0.22)';
export const SOMBRA_FILTRO = 'drop-shadow(0 16px 26px rgba(8,18,56,0.28))';

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

/** Persona recortada con borde blanco. Entra deslizándose con una curva suave y queda «respirando». */
export const Sticker: React.FC<{
  cual: keyof typeof STICKERS;
  ancho: number;
  left: number;
  top: number;
  entra: number;
  sale?: number;
  rot?: number;
  desde?: 'abajo' | 'derecha' | 'izquierda';
}> = ({ cual, ancho, left, top, entra, sale, rot = 0, desde = 'abajo' }) => {
  const f = useCurrentFrame();
  const s = STICKERS[cual];
  const t = rampa(f, entra, entra + 24, salida);
  const fuera = sale === undefined ? 0 : rampa(f, sale, sale + 16, suave);
  const resp = Math.sin((f - entra) / 22) * 0.8 * t;
  const dx = desde === 'derecha' ? (1 - t) * 700 : desde === 'izquierda' ? (1 - t) * -700 : 0;
  const dy = (desde === 'abajo' ? (1 - t) * 700 : 0) + fuera * 900;
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
        rotate: `${rot + (1 - t) * (desde === 'izquierda' ? -6 : 6) + resp}deg`,
        transformOrigin: '50% 90%',
        filter: SOMBRA_FILTRO,
        opacity: f >= entra ? Math.min(1, t * 3) : 0,
      }}
    />
  );
};

const Estrella: React.FC<{ color: string; tam: number }> = ({ color, tam }) => (
  <svg width={tam} height={tam} viewBox="-20 -20 40 40" style={{ margin: `0 ${tam * 0.45}px`, flexShrink: 0 }}>
    <path d="M 0 -18 L 4.5 -4.5 L 18 0 L 4.5 4.5 L 0 18 L -4.5 4.5 L -18 0 L -4.5 -4.5 Z" fill={color} />
  </svg>
);

/** Cinta rotada que cruza la pantalla con el texto repitiéndose despacio (marquesina). */
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
}> = ({ texto, fondo, color, top, rot, entra, tam = 92, alto = 150, vel = 4.5, sentido = 1, estrella }) => {
  const f = useCurrentFrame();
  const abre = rampa(f, entra, entra + 16, salida);
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

/** Palabra «sellada»: baja de escala con una curva suave hasta quedar fija, con un anillo de impacto discreto. */
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
  const t = rampa(f, entra, entra + 14, salida);
  const anillo = rampa(f, entra + 6, entra + 22);
  const caja: CSSProperties = { padding: `${tam * 0.06}px ${tam * 0.2}px ${tam * 0.12}px`, borderRadius: 10 };
  return (
    <div style={{ position: 'absolute', left, top, rotate: `${rot - (1 - t) * 6}deg`, scale: String(1.35 - 0.35 * t), transformOrigin: origen, opacity: f >= entra ? Math.min(1, t * 2.5) : 0 }}>
      <div style={{ ...caja, position: 'absolute', inset: 0, border: `5px solid ${fondo}`, scale: String(1 + anillo * 0.25), opacity: (1 - anillo) * (f >= entra + 6 ? 0.7 : 0) }} />
      <div style={{ ...caja, background: fondo, color, fontWeight: 900, fontSize: tam, lineHeight: 1, letterSpacing: -tam * 0.03, whiteSpace: 'nowrap', boxShadow: SOMBRA_SUAVE }}>{texto}</div>
    </div>
  );
};

/** Etiqueta pequeña tipo rótulo («EN INGLÉS», «EN ESPAÑOL», carreras). */
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
  const t = rampa(f, entra, entra + 12, salida);
  return (
    <div style={{ position: 'absolute', left, top, rotate: `${rot}deg`, scale: String(0.7 + 0.3 * t), opacity: t, transformOrigin: '0% 50%', padding: `${tam * 0.32}px ${tam * 0.6}px`, background: fondo, color, fontWeight: 700, fontSize: tam, letterSpacing: tam * 0.12, lineHeight: 1, whiteSpace: 'nowrap' }}>
      {texto}
    </div>
  );
};

/** Foto pegada con dos trozos de cinta adhesiva. */
export const FotoCinta: React.FC<{ src: string; left: number; top: number; ancho: number; rot: number; entra: number }> = ({ src, left, top, ancho, rot, entra }) => {
  const f = useCurrentFrame();
  const t = rampa(f, entra, entra + 22, salida);
  const alto = ancho * 1.5;
  const borde = ancho * 0.045;
  const cinta: CSSProperties = { position: 'absolute', width: ancho * 0.36, height: ancho * 0.11, background: 'rgba(255,246,222,0.78)' };
  return (
    <div style={{ position: 'absolute', left, top, width: ancho + borde * 2, height: alto + borde * 2, rotate: `${rot + (1 - t) * 10}deg`, translate: `0px ${(1 - t) * -160}px`, opacity: t }}>
      <div style={{ position: 'absolute', inset: 0, background: '#fff', boxShadow: SOMBRA_SUAVE }} />
      <Img src={staticFile(src)} style={{ position: 'absolute', left: borde, top: borde, width: ancho, height: alto, objectFit: 'cover', scale: String(1.06 - 0.06 * rampa(f, entra, entra + 120)) }} />
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
  const p = rampa(f, desde, desde + dur, suave);
  return (
    <svg viewBox={viewBox} style={{ position: 'absolute', overflow: 'visible', ...style }}>
      <path d={d} fill="none" stroke={color} strokeWidth={ancho} strokeLinecap={tapa} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} opacity={f >= desde ? 1 : 0} />
    </svg>
  );
};

/** Letra gigante con relleno de trama (semitono), sin sombra. */
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
      ...style,
    }}
  >
    {letra}
  </div>
);

/** Cámara: deriva lenta de zoom (sin sacudidas). */
export const Camara: React.FC<{ dur: number; children: ReactNode; deriva?: [number, number]; origen?: string }> = ({ dur, children, deriva = [1, 1.035], origen = '50% 45%' }) => {
  const f = useCurrentFrame();
  const base = interpolate(f, [0, dur], deriva, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <div style={{ position: 'absolute', inset: 0, scale: String(base), transformOrigin: origen }}>{children}</div>;
};

/** Palabra grande que entra subiendo desde una máscara (para títulos). */
export const Titular: React.FC<{ entra: number; children: ReactNode; style?: CSSProperties; dur?: number }> = ({ entra, children, style, dur = 16 }) => {
  const f = useCurrentFrame();
  const t = rampa(f, entra, entra + dur, salida);
  return (
    <div style={{ overflow: 'hidden', padding: '0.18em 0 0.1em', margin: '-0.18em 0 -0.1em' }}>
      <div style={{ translate: `0px ${(1 - t) * 110}%`, opacity: f >= entra ? 1 : 0, whiteSpace: 'nowrap', ...style }}>{children}</div>
    </div>
  );
};
