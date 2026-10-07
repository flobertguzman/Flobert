// Línea gráfica «Aceleradores STEM · MESCyT» (sección 4 del brief).
// Si el cliente envía su línea gráfica, se cambia aquí y se propaga a todas las escenas.
import { Easing, interpolate } from 'remotion';

export const ANCHO = 1080;
export const ALTO = 1920;
export const FPS = 30;
export const X = 64; // margen lateral

export const C = {
  azul: '#243A75', // texto/botones sobre claro
  rojo: '#DA232A', // logo
  acento: '#FF5A5F', // rojo aclarado: el rojo del logo no contrasta sobre azul
  fondoA: '#1B3C8B',
  fondoB: '#0E1D4D',
  blanco: '#FFFFFF',
  suave: 'rgba(255,255,255,0.84)',
  tenue: 'rgba(255,255,255,0.6)',
  vidrio: 'rgba(255,255,255,0.08)',
  vidrioLinea: 'rgba(255,255,255,0.3)',
  cian: '#7FE3FF',
} as const;

export const SOMBRA_PERSONA =
  'drop-shadow(0 0 34px rgba(90,160,255,0.35)) drop-shadow(-16px 8px 34px rgba(5,10,30,0.45))';

export const salida = Easing.bezier(0.16, 1, 0.3, 1); // frena suave al llegar
export const entrada = Easing.bezier(0.7, 0, 0.84, 0); // acelera al irse
export const suave = Easing.bezier(0.45, 0, 0.25, 1);

/** Progreso 0→1 entre dos fotogramas, sin salirse del rango. */
export const rampa = (frame: number, desde: number, hasta: number, easing: (t: number) => number = salida) =>
  interpolate(frame, [desde, hasta], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing });

export const mezcla = (a: number, b: number, t: number) => a + (b - a) * t;

export const SCRIPT_ROT = -4; // la palabra manuscrita va ligeramente rotada (−4° a −6°)
