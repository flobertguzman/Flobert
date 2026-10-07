// Línea de tiempo única del video (30 fps, 900 fotogramas = 30 s).
// Los tiempos siguen la locución real (ver herramientas/audio.py): cada escena arranca cuando
// empieza su frase. Las pequeñas diferencias con el storyboard del brief son de 0,1–0,4 s.
export const TOTAL = 900;

export const ESCENAS = {
  letras: { from: 0, dur: 90 }, // 0–3 s
  areaS: { from: 90, dur: 90 }, // 3–6 s
  areaT: { from: 180, dur: 90 }, // 6–9 s
  areaE: { from: 270, dur: 90 }, // 9–12 s
  areaM: { from: 360, dur: 90 }, // 12–15 s
  juntas: { from: 450, dur: 120 }, // 15–19 s
  robot: { from: 570, dur: 162 }, // 19–24,4 s
  personas: { from: 732, dur: 78 }, // 24,4–27 s
  cierre: { from: 810, dur: 90 }, // 27–30 s
} as const;

export const AREAS = [
  { letra: 'S', en: 'SCIENCE', resto: 'CIENCE', es: 'Ciencia' },
  { letra: 'T', en: 'TECHNOLOGY', resto: 'ECHNOLOGY', es: 'Tecnología' },
  { letra: 'E', en: 'ENGINEERING', resto: 'NGINEERING', es: 'Ingeniería' },
  { letra: 'M', en: 'MATHEMATICS', resto: 'ATHEMATICS', es: 'Matemáticas' },
] as const;
