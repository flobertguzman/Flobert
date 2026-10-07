// Línea de tiempo del reel de 60 s (30 fps → 1800 fotogramas). Cada escena arranca un poco antes de su frase.
// Los cortes deben coincidir con CORTES en herramientas/audio.py.
import bloques from './datos/subtitulos.json';
import { FPS } from './marca';

export const TOTAL = 1800;

export const ESCENAS = {
  apertura: { from: 0, dur: 210 }, // 0–7 s       ¿Qué son las carreras STEM?
  letras: { from: 210, dur: 120 }, // 7–11 s      Cuatro letras que reúnen muchas carreras
  areaS: { from: 330, dur: 129 }, // 11–15,3 s
  areaT: { from: 459, dur: 129 }, // 15,3–19,6 s
  areaE: { from: 588, dur: 129 }, // 19,6–23,9 s
  areaM: { from: 717, dur: 129 }, // 23,9–28,2 s
  mundo: { from: 846, dur: 204 }, // 28,2–35 s    Cuatro áreas para entender el mundo
  ejemplos: { from: 1050, dur: 210 }, // 35–42 s  Algunos ejemplos de carreras STEM
  juntas: { from: 1260, dur: 144 }, // 42–46,8 s  Trabajan juntas
  robot: { from: 1404, dur: 210 }, // 46,8–53,8 s Para crear un robot…
  pregunta: { from: 1614, dur: 96 }, // 53,8–57 s ¿Qué área te da más curiosidad?
  cierre: { from: 1710, dur: 90 }, // 57–60 s     Cierre MESCyT
} as const;

export type NombreEscena = keyof typeof ESCENAS;

type Bloque = { inicio: number; fin: number; palabras: { t: string; s: number; clave: boolean }[] };
const limpia = (t: string) => t.toLowerCase().replace(/[^a-záéíóúüñ]/g, '');

/** Fotograma (global) en que la voz dice `palabra`, buscando desde el segundo `desde`. */
export const palabra = (texto: string, desde = 0): number => {
  for (const b of bloques as Bloque[]) {
    for (const p of b.palabras) {
      if (p.s >= desde && limpia(p.t) === limpia(texto)) return Math.round(p.s * FPS);
    }
  }
  throw new Error(`No está en la locución: ${texto}`);
};

/** Igual que `palabra`, pero relativo al inicio de una escena. */
export const palabraEn = (escena: NombreEscena, texto: string) => palabra(texto, ESCENAS[escena].from / FPS - 0.5) - ESCENAS[escena].from;

export const AREAS = [
  { letra: 'S', en: 'SCIENCE', resto: 'CIENCE', es: 'Ciencia', nombre: 'CIENCIA', carreras: ['Biología', 'Química', 'Física'] },
  { letra: 'T', en: 'TECHNOLOGY', resto: 'ECHNOLOGY', es: 'Tecnología', nombre: 'TECNOLOGÍA', carreras: ['Informática', 'Desarrollo de software'] },
  { letra: 'E', en: 'ENGINEERING', resto: 'NGINEERING', es: 'Ingeniería', nombre: 'INGENIERÍA', carreras: ['Civil', 'Eléctrica', 'Mecánica', 'Industrial'] },
  { letra: 'M', en: 'MATHEMATICS', resto: 'ATHEMATICS', es: 'Matemáticas', nombre: 'MATEMÁTICAS', carreras: ['Matemáticas', 'Estadística'] },
] as const;
