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
// Logo de cierre: pon el archivo en public/ (PNG con fondo transparente o SVG)
// y escribe aquí su nombre, por ejemplo 'logo-heavy.png'. Con null no hay cierre.
export const BRAND = {
  logo: "logo-heavy.png" as string | null,
};

// Voz en off: cuando tengas tu grabación, ponla en public/voz/ y escribe aquí
// su nombre (por ejemplo 'voz/voz.mp3'). La música y los efectos bajan solos.
export const VOICE: string | null = "voz/voz.wav";

// Instrumental de fondo, ya mezclado bajo la voz (public/musica/).
export const MUSIC = "musica/musica.wav";

// Duración de cada transición entre escenas (frames).
export const TRANSITION = 14;

export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const FPS = 30;
export const SCENES = {
  hook: 159,
  quePaso: 180,
  porQue: 225,
  mercado: 142,
  relevo: 155,
  importa: BRAND.logo ? 204 : 234,
  cierre: BRAND.logo ? 90 : 0,
};
export const TOTAL = Object.values(SCENES).reduce((a, b) => a + b, 0);
