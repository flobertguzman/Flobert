import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fuentes locales (public/fonts) para que el render no dependa de la red.
const faces: Array<[string, string, string]> = [
  ["Inter", "400", "Inter-400.woff2"],
  ["Inter", "500", "Inter-500.woff2"],
  ["Inter", "600", "Inter-600.woff2"],
  ["Inter", "700", "Inter-700.woff2"],
  ["Geist Mono", "400", "GeistMono-400.woff2"],
  ["Geist Mono", "500", "GeistMono-500.woff2"],
];

for (const [family, weight, file] of faces) {
  loadFont({ family, weight, url: staticFile(`fonts/${file}`) });
}

export const sans = "Inter, system-ui, sans-serif";
export const mono = '"Geist Mono", ui-monospace, monospace';
