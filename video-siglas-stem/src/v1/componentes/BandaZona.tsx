import { Img, staticFile } from 'remotion';
import { ANCHO, mezcla, rampa, salida } from '../../marca';

// Banda de vidrio (banda_b.png, 1500×1862) vista como una «ventana» que se desplaza por las cuatro áreas.
const IMG_W = 1500;
const IMG_H = 1862;
const CY = 905; // altura (en la imagen) del centro del interior de la banda

// Límites horizontales de cada zona dentro de la imagen original.
export const ZONAS = [
  { x0: 0, x1: 365, c: 190 }, // ciencia: ADN, células
  { x0: 365, x1: 752, c: 560 }, // tecnología: código, circuitos
  { x0: 752, x1: 1130, c: 940 }, // ingeniería: planos, puente
  { x0: 1130, x1: 1500, c: 1315 }, // matemáticas: geometría, gráficas
];

const izquierda = (c: number, esc: number) => Math.min(0, Math.max(ANCHO - IMG_W * esc, ANCHO / 2 - c * esc));

type P = {
  zona: number; // zona resaltada
  desde?: number; // zona de la que viene la ventana (para el desplazamiento continuo)
  f: number; // fotograma local de la escena
  top: number;
  alto?: number;
  esc?: number;
  opacidad?: number;
};

export const BandaZona: React.FC<P> = ({ zona, desde = zona, f, top, alto = 600, esc = 1.04, opacidad = 1 }) => {
  const t = rampa(f, 0, 18);
  const base = mezcla(izquierda(ZONAS[desde].c, esc), izquierda(ZONAS[zona].c, esc), t);
  // deriva lenta, sin dejar que la imagen se salga de la ventana
  const izq = Math.min(0, Math.max(ANCHO - IMG_W * esc, base - f * 0.3));
  const deriva = izq - base;
  // la zona resaltada viaja de la zona anterior a la nueva mientras la ventana se desplaza
  const limite = (z: number, k: 'x0' | 'x1') => ZONAS[z][k] * esc + izquierda(ZONAS[z].c, esc);
  const x0 = mezcla(limite(desde, 'x0'), limite(zona, 'x0'), t) + deriva;
  const x1 = mezcla(limite(desde, 'x1'), limite(zona, 'x1'), t) + deriva;
  const sombra = 'rgba(10,22,70,0.66)';
  const mascara = 'linear-gradient(180deg, transparent 0%, #000 13%, #000 87%, transparent 100%)';
  return (
    <div style={{ position: 'absolute', left: 0, top, width: ANCHO, height: alto, overflow: 'hidden', opacity: opacidad, maskImage: mascara, WebkitMaskImage: mascara }}>
      <Img
        src={staticFile('car/banda_b.png')}
        style={{ position: 'absolute', left: izq, top: alto / 2 - CY * esc, width: IMG_W * esc, height: IMG_H * esc }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(90deg, ${sombra} 0px, ${sombra} ${x0 - 26}px, rgba(10,22,70,0) ${x0 + 30}px, rgba(10,22,70,0) ${x1 - 30}px, ${sombra} ${x1 + 26}px, ${sombra} ${ANCHO}px)`,
        }}
      />
      {/* destello que cruza la zona activa al llegar */}
      <div
        style={{
          position: 'absolute',
          top: -40,
          bottom: -40,
          width: 150,
          left: mezcla(x0 - 200, x1 + 100, rampa(f, 4, 34, salida)),
          background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.35), rgba(255,255,255,0))',
          transform: 'skewX(-18deg)',
          mixBlendMode: 'screen',
          opacity: rampa(f, 4, 10) * (1 - rampa(f, 28, 36)),
        }}
      />
    </div>
  );
};
