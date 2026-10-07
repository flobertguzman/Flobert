import { AbsoluteFill, Sequence } from 'remotion';
import { Banda, Fondo, Marca, tramo } from './componentes/base';
import { Subtitulos } from './componentes/Subtitulos';
import { A1Apertura } from './escenas/A1Apertura';
import { A2Letras } from './escenas/A2Letras';
import { A3Letra } from './escenas/A3Letra';
import { A4Mundo } from './escenas/A4Mundo';
import { A5Ejemplos } from './escenas/A5Ejemplos';
import { A6Juntas } from './escenas/A6Juntas';
import { A7Robot } from './escenas/A7Robot';
import { A8Pregunta } from './escenas/A8Pregunta';
import { A9Cierre } from './escenas/A9Cierre';
import { FONT } from '../fonts';
import type { NombreEscena } from '../tiempos';

export type PropsVideoV3 = { subtitulos: boolean };

type PropsEscena = { dur: number; inicio: number };
const ESCENAS_REEL: [NombreEscena, React.FC<PropsEscena>][] = [
  ['apertura', A1Apertura],
  ['letras', A2Letras],
  ['areaS', (p) => <A3Letra i={0} {...p} />],
  ['areaT', (p) => <A3Letra i={1} {...p} />],
  ['areaE', (p) => <A3Letra i={2} {...p} />],
  ['areaM', (p) => <A3Letra i={3} {...p} />],
  ['mundo', A4Mundo],
  ['ejemplos', A5Ejemplos],
  ['juntas', A6Juntas],
  ['robot', A7Robot],
  ['pregunta', A8Pregunta],
  ['cierre', A9Cierre],
];

/** Reel de 60 s «¿Qué son las carreras STEM?»: fondo y banda continuos, escenas que se encadenan con deslizamientos y fundidos. */
export const VideoV3: React.FC<PropsVideoV3> = ({ subtitulos }) => (
  <AbsoluteFill style={{ fontFamily: `${FONT}, sans-serif`, color: '#fff' }}>
    <Fondo />
    <Banda />
    {ESCENAS_REEL.map(([k, Componente]) => {
      const { inicio, ...seq } = tramo(k);
      return (
        <Sequence key={k} {...seq}>
          <Componente dur={seq.durationInFrames} inicio={inicio} />
        </Sequence>
      );
    })}
    <Marca />
    {subtitulos && <Subtitulos />}
  </AbsoluteFill>
);
