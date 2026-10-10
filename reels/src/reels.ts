export type NamePart = { text: string; accent?: boolean };

export type ReelProps = {
  /** Foto recortada (PNG sin fondo) dentro de public/ */
  photo: string;
  /** Pista de audio dentro de public/ (o null para exportar sin música) */
  audio: string | null;
  /** Palabras rápidas de la intro; la última va en naranja */
  introWords: string[];
  /** Primera línea del nombre (blanca) */
  nameTop: NamePart[];
  /** Segunda línea del nombre (partes con accent=true van en naranja) */
  nameBottom: NamePart[];
  /** Texto gigante con contorno que se desliza detrás de la foto */
  backdropWord: string;
  time: string;
  day: string;
  monthYear: string;
  /** Línea pequeña junto al cuadro naranja ("DJ set en vivo") */
  tagline: string;
  /** Línea del cierre ("JUEVES 15 · DJ CARLOX") */
  endLine: string;
  /** Ajustes de encuadre de la foto en el póster */
  photoHeight: number;
  photoLeft: number;
  photoTop: number;
};

const base = {
  time: "8:00 PM",
  monthYear: "OCTUBRE 2026",
};

export const reels: Record<string, ReelProps> = {
  Carlox: {
    ...base,
    photo: "artists/carlox.png",
    audio: "audio/track-vinilo.m4a",
    introWords: ["DJ SET", "EN VIVO", "JUEVES 15", "8:00 PM"],
    nameTop: [{ text: "DJ" }],
    nameBottom: [{ text: "CARL" }, { text: "OX", accent: true }],
    backdropWord: "CARLOX",
    day: "JUEVES 15",
    tagline: "DJ set en vivo",
    endLine: "JUEVES 15 · DJ CARLOX",
    photoHeight: 1000,
    photoLeft: -10,
    photoTop: 300,
  },
  MelanieAbreu: {
    ...base,
    photo: "artists/melanie.png",
    audio: "audio/track-onda.m4a",
    introWords: ["MÚSICA", "EN VIVO", "VIERNES 16", "8:00 PM"],
    nameTop: [{ text: "MELANIE" }],
    nameBottom: [{ text: "ABREU", accent: true }],
    backdropWord: "MELANIE",
    day: "VIERNES 16",
    tagline: "Música en vivo",
    endLine: "VIERNES 16 · MELANIE ABREU",
    photoHeight: 1190,
    photoLeft: 10,
    photoTop: 100,
  },
  ArmandoVicente: {
    ...base,
    photo: "artists/armando.png",
    audio: "audio/track-vinilo.m4a",
    introWords: ["MÚSICA", "EN VIVO", "SÁBADO 17", "8:00 PM"],
    nameTop: [{ text: "ARMANDO" }],
    nameBottom: [{ text: "VICENTE", accent: true }],
    backdropWord: "ARMANDO",
    day: "SÁBADO 17",
    tagline: "Música en vivo",
    endLine: "SÁBADO 17 · ARMANDO VICENTE",
    photoHeight: 1160,
    photoLeft: -90,
    photoTop: 130,
  },
};
