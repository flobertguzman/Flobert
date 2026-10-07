// Piezas de la línea gráfica limpia (como los carruseles aprobados): fondo azul, banda de vidrio,
// tarjetas de vidrio, recortes naturales con resplandor suave y textos que suben desde una máscara.
import { createContext, useContext } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { ANCHO, C, X, rampa, salida, suave } from '../../marca';
import { ESCENAS, TOTAL } from '../../tiempos';

/** Fondo común a todo el reel: degradado azul MESCyT con un resplandor que se mueve despacio. */
export const Fondo: React.FC = () => {
  const f = useCurrentFrame();
  const gx = 540 + Math.sin(f / 110) * 180;
  const gy = 32 + Math.cos(f / 140) * 6;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.fondoA} 0%, ${C.fondoB} 100%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(60% 32% at ${gx}px ${gy}%, rgba(70,150,255,0.24), rgba(70,150,255,0) 72%)` }} />
    </AbsoluteFill>
  );
};

// ───────── Banda de vidrio: una sola capa para todo el reel, que viaja de un estado a otro ─────────
type EstadoBanda = { x: number; cy: number; s: number; sy: number; o: number };
const B_IMG = { w: 1500, h: 1862, cy: 925 };
const zonaX = (c: number, s: number) => Math.min(0, Math.max(ANCHO - B_IMG.w * s, 540 - c * s));
const OFF: EstadoBanda = { x: -200, cy: 1500, s: 1.0, sy: 0.8, o: 0 };

// [fotograma, estado]: entre dos claves la banda se desliza con una curva suave
const CLAVES: [number, EstadoBanda][] = [
  [0, { ...OFF, x: 0, cy: 1420 }],
  [30, { ...OFF, x: 0, cy: 1420 }],
  [90, { x: -80, cy: 1270, s: 1.0, sy: 0.82, o: 1 }],
  [200, { x: -260, cy: 1250, s: 1.0, sy: 0.82, o: 1 }],
  [230, { x: -320, cy: 1380, s: 1.0, sy: 0.7, o: 0.85 }],
  [320, { x: -420, cy: 1380, s: 1.0, sy: 0.7, o: 0.85 }],
  // las cuatro letras: la banda se acerca a la zona de cada área
  [346, { x: zonaX(190, 1.25), cy: 1330, s: 1.25, sy: 0.8, o: 1 }],
  [445, { x: zonaX(190, 1.25) - 30, cy: 1330, s: 1.25, sy: 0.8, o: 1 }],
  [475, { x: zonaX(560, 1.25), cy: 1330, s: 1.25, sy: 0.8, o: 1 }],
  [574, { x: zonaX(560, 1.25) - 30, cy: 1330, s: 1.25, sy: 0.8, o: 1 }],
  [604, { x: zonaX(940, 1.25), cy: 1330, s: 1.25, sy: 0.8, o: 1 }],
  [703, { x: zonaX(940, 1.25) - 30, cy: 1330, s: 1.25, sy: 0.8, o: 1 }],
  [733, { x: zonaX(1315, 1.25), cy: 1330, s: 1.25, sy: 0.8, o: 1 }],
  [832, { x: zonaX(1315, 1.25) + 20, cy: 1330, s: 1.25, sy: 0.8, o: 1 }],
  [866, { x: -420, cy: 1280, s: 1.05, sy: 0.8, o: 1 }],
  [1040, { x: -220, cy: 1280, s: 1.05, sy: 0.8, o: 1 }],
  [1070, { x: -120, cy: 1330, s: 1.05, sy: 0.75, o: 1 }],
  [1250, { x: -330, cy: 1330, s: 1.05, sy: 0.75, o: 1 }],
  [1280, { x: -300, cy: 1440, s: 1.0, sy: 0.72, o: 1 }],
  [1395, { x: -410, cy: 1440, s: 1.0, sy: 0.72, o: 1 }],
  [1425, { x: -380, cy: 1560, s: 1.0, sy: 0.66, o: 0.9 }],
  [1600, { x: -200, cy: 1560, s: 1.0, sy: 0.66, o: 0.9 }],
  [1630, { x: -300, cy: 1290, s: 1.0, sy: 0.8, o: 1 }],
  [1700, { x: -150, cy: 1290, s: 1.0, sy: 0.8, o: 1 }],
  [1726, { x: -200, cy: 1420, s: 1.0, sy: 0.7, o: 0.9 }],
  [1772, { x: -280, cy: 1420, s: 1.0, sy: 0.7, o: 0.9 }],
  [TOTAL, { x: -300, cy: 1440, s: 1.0, sy: 0.7, o: 0 }],
];

const estadoBanda = (f: number): EstadoBanda => {
  let i = 0;
  while (i < CLAVES.length - 2 && f >= CLAVES[i + 1][0]) i++;
  const [f0, a] = CLAVES[i];
  const [f1, b] = CLAVES[i + 1];
  const t = interpolate(f, [f0, f1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: suave });
  const m = (k: keyof EstadoBanda) => a[k] + (b[k] - a[k]) * t;
  return { x: m('x'), cy: m('cy'), s: m('s'), sy: m('sy'), o: m('o') };
};

export const Banda: React.FC = () => {
  const f = useCurrentFrame();
  const e = estadoBanda(f);
  if (e.o <= 0.001) return null;
  const mascara = 'linear-gradient(180deg, transparent 0%, #000 16%, #000 84%, transparent 100%)';
  const alto = B_IMG.h * e.s * e.sy;
  return (
    <div style={{ position: 'absolute', left: 0, top: e.cy - B_IMG.cy * e.s * e.sy, width: ANCHO, height: alto, overflow: 'hidden', opacity: e.o, maskImage: mascara, WebkitMaskImage: mascara }}>
      <Img src={staticFile('car/banda_b.png')} style={{ position: 'absolute', left: Math.min(0, Math.max(ANCHO - B_IMG.w * e.s, e.x)), top: 0, width: B_IMG.w * e.s, height: alto }} />
    </div>
  );
};

// ───────── Marca fija: etiqueta «CARRERAS STEM» y logo pequeño (se ocultan en el cierre) ─────────
export const Marca: React.FC = () => {
  const f = useCurrentFrame();
  const fin = ESCENAS.cierre.from;
  const o = rampa(f, 6, 24) * (1 - rampa(f, fin - 14, fin));
  return (
    <div style={{ opacity: o }}>
      <div style={{ position: 'absolute', left: X, top: 150, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 32, height: 5, background: C.acento, borderRadius: 3 }} />
        <div style={{ fontWeight: 700, fontSize: 24, letterSpacing: 5, color: C.blanco }}>CARRERAS STEM</div>
      </div>
      <Img src={staticFile('logo_mescyt_h_blanco.png')} style={{ position: 'absolute', right: X, top: 128, height: 62, width: (62 * 1600) / 398, opacity: 0.95 }} />
    </div>
  );
};

// ───────── Escena: entra y sale con un deslizamiento lateral (tipo carrusel) o un fundido que sube ─────────
export const SOLAPE = 16;

// Cada escena empieza `inicio` fotogramas antes de su corte (para solaparse con la anterior).
// `useF()` devuelve el fotograma contado desde el corte, que es el que usan todos los tiempos de la escena.
const Desfase = createContext(0);
export const useF = () => useCurrentFrame() - useContext(Desfase);

export const Escena: React.FC<{ dur: number; inicio: number; entrada?: 'deslizar' | 'fundido' | 'nada'; salida?: 'deslizar' | 'fundido' | 'nada'; children: ReactNode }> = ({
  dur,
  inicio,
  entrada = 'fundido',
  salida: sal = 'fundido',
  children,
}) => {
  const f = useCurrentFrame();
  const tin = entrada === 'nada' ? 1 : rampa(f, 0, SOLAPE, suave);
  const tout = sal === 'nada' ? 0 : rampa(f, dur - SOLAPE, dur, suave);
  const x = (entrada === 'deslizar' ? (1 - tin) * ANCHO : 0) - (sal === 'deslizar' ? tout * ANCHO : 0);
  const y = (entrada === 'fundido' ? (1 - tin) * 50 : 0) - (sal === 'fundido' ? tout * 50 : 0);
  const o = (entrada === 'fundido' ? tin : 1) * (sal === 'fundido' ? 1 - tout : 1);
  return (
    <Desfase.Provider value={inicio}>
      <AbsoluteFill style={{ translate: `${x}px ${y}px`, opacity: o }}>{children}</AbsoluteFill>
    </Desfase.Provider>
  );
};

/** Secuencia de una escena extendida para que se solape con la vecina durante la transición. */
export const tramo = (k: keyof typeof ESCENAS) => {
  const e = ESCENAS[k];
  const from = Math.max(0, e.from - SOLAPE / 2);
  const hasta = Math.min(TOTAL, e.from + e.dur + SOLAPE / 2);
  return { from, durationInFrames: hasta - from, name: k, inicio: e.from - from };
};

// ───────── Texto ─────────
/** Línea de texto que sube desde una máscara. */
export const Linea: React.FC<{ entra: number; children: ReactNode; style?: CSSProperties; dur?: number }> = ({ entra, children, style, dur = 18 }) => {
  const f = useF();
  const t = rampa(f, entra, entra + dur, salida);
  return (
    <div style={{ overflow: 'hidden', paddingBottom: '0.12em', marginBottom: '-0.12em' }}>
      <div style={{ translate: `0px ${(1 - t) * 110}%`, opacity: f >= entra ? 1 : 0, whiteSpace: 'nowrap', ...style }}>{children}</div>
    </div>
  );
};

/** Aparece con un fundido corto subiendo unos píxeles. */
export const Sube: React.FC<{ entra: number; children: ReactNode; style?: CSSProperties; dist?: number; dur?: number }> = ({ entra, children, style, dist = 40, dur = 18 }) => {
  const f = useF();
  const t = rampa(f, entra, entra + dur, salida);
  return <div style={{ opacity: t, translate: `0px ${(1 - t) * dist}px`, ...style }}>{children}</div>;
};

// ───────── Tarjeta de vidrio (línea gráfica: relleno 8 %, borde 30 %, radio 24–28) ─────────
export const vidrio = (radio = 26): CSSProperties => ({
  background: C.vidrio,
  border: `2px solid ${C.vidrioLinea}`,
  borderRadius: radio,
  boxSizing: 'border-box',
  backdropFilter: 'blur(6px)',
});

/** Tarjeta de área + carrera, como en el carrusel «Algunos ejemplos de carreras STEM». */
export const TarjetaCarrera: React.FC<{ area: string; carrera: string; entra: number; style?: CSSProperties; tam?: number }> = ({ area, carrera, entra, style, tam = 40 }) => (
  <Sube entra={entra} dist={30} style={{ ...vidrio(24), padding: `${tam * 0.5}px ${tam * 0.75}px`, ...style }}>
    <div style={{ fontWeight: 700, fontSize: tam * 0.45, letterSpacing: tam * 0.08, color: C.acento }}>{area}</div>
    <div style={{ marginTop: 6, fontWeight: 900, fontSize: tam, letterSpacing: -0.5, lineHeight: 1.05, whiteSpace: 'nowrap' }}>{carrera}</div>
  </Sube>
);

// ───────── Personas: recorte natural, resplandor azul suave, entra subiendo y «flota» ─────────
export const PERSONAS = {
  pareja: { src: 'personas/pareja_senalando.png', w: 865, h: 1054 },
  elias: { src: 'personas/elias_calculadora.png', w: 643, h: 1077 },
  camila: { src: 'personas/camila_vr.png', w: 766, h: 961 },
} as const;

export const Persona: React.FC<{ cual: keyof typeof PERSONAS; ancho: number; left: number; top: number; entra: number }> = ({ cual, ancho, left, top, entra }) => {
  const f = useF();
  const p = PERSONAS[cual];
  const t = rampa(f, entra, entra + 26, salida);
  const flota = Math.sin((f - entra) / 28) * 5;
  return (
    <Img
      src={staticFile(p.src)}
      style={{
        position: 'absolute',
        left,
        top,
        width: ancho,
        height: (ancho * p.h) / p.w,
        opacity: t,
        translate: `0px ${(1 - t) * 160 + flota}px`,
        filter: 'drop-shadow(0 0 32px rgba(90,160,255,0.35))',
      }}
    />
  );
};
