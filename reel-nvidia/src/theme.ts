export { mono, sans } from "./theme-fonts";

// Lenguaje visual: Linear (awesome-design-md), igual que el carrusel.
export const C = {
  canvas: "#010102",
  s1: "#0f1011",
  s2: "#141516",
  s3: "#18191a",
  hair: "#23252a",
  hair2: "#34343a",
  ink: "#f7f8f8",
  inkM: "#d0d6e0",
  inkS: "#8a8f98",
  inkT: "#62666d",
  acc: "#5e6ad2",
  accH: "#828fff",
  red: "#eb5757",
  green: "#27a644",
};

// Marca: cambia el usuario y, cuando tengas el archivo, pon el logo en
// public/ y escribe su nombre en `logo` (por ejemplo 'logo.png').
export const BRAND = {
  handle: "@tumarca",
  logo: null as string | null,
  tagline: "El dinero detrás de la IA, explicado.",
};

export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const FPS = 30;
export const SCENES = {
  hook: 120,
  quePaso: 180,
  porQue: 210,
  mercado: 240,
  relevo: 180,
  importa: 150,
  cierre: 120,
};
export const TOTAL = Object.values(SCENES).reduce((a, b) => a + b, 0);
