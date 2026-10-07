import { AbsoluteFill, Img, Sequence, staticFile } from 'remotion';
import { Subtitulos } from './componentes/Subtitulos';
import { Transicion } from './componentes/Transicion';
import { R1Gancho } from './escenas/R1Gancho';
import { R2Letra } from './escenas/R2Letra';
import { R3Juntas } from './escenas/R3Juntas';
import { R4Robot } from './escenas/R4Robot';
import { R5Pregunta } from './escenas/R5Pregunta';
import { R6Cierre } from './escenas/R6Cierre';
import { FONT } from './fonts';
import { C } from './marca';
import { ESCENAS } from './tiempos';

export type PropsVideo = { subtitulos: boolean };

const seq = (k: keyof typeof ESCENAS) => ({ from: ESCENAS[k].from, durationInFrames: ESCENAS[k].dur, name: k });
const corte = (en: number, mitad: number) => ({ from: en - mitad, durationInFrames: mitad * 2, name: `transición ${en}` });

/** Reel «Significado de las siglas STEM»: collage editorial, cortes rápidos y tipografía cinética. */
export const Video: React.FC<PropsVideo> = ({ subtitulos }) => (
  <AbsoluteFill style={{ fontFamily: `${FONT}, sans-serif`, color: '#fff', background: C.fondoB }}>
    <Sequence {...seq('letras')}>
      <R1Gancho />
    </Sequence>
    {(['areaS', 'areaT', 'areaE', 'areaM'] as const).map((k, i) => (
      <Sequence key={k} {...seq(k)}>
        <R2Letra i={i} />
      </Sequence>
    ))}
    <Sequence {...seq('juntas')}>
      <R3Juntas />
    </Sequence>
    <Sequence {...seq('robot')}>
      <R4Robot />
    </Sequence>
    <Sequence {...seq('personas')}>
      <R5Pregunta />
    </Sequence>
    <Sequence {...seq('cierre')}>
      <R6Cierre />
    </Sequence>

    <Sequence {...corte(90, 3)}>
      <Transicion tipo="flash" mitad={3} />
    </Sequence>
    <Sequence {...corte(180, 8)}>
      <Transicion tipo="barras" mitad={8} colores={[C.acento, C.azul, C.fondoB]} />
    </Sequence>
    <Sequence {...corte(270, 7)}>
      <Transicion tipo="persiana" mitad={7} colores={['#1F4596']} />
    </Sequence>
    <Sequence {...corte(360, 8)}>
      <Transicion tipo="papel" mitad={8} />
    </Sequence>
    <Sequence {...corte(450, 3)}>
      <Transicion tipo="flash" mitad={3} />
    </Sequence>
    <Sequence {...corte(570, 9)}>
      <Transicion tipo="iris" mitad={9} colores={['#1F4596']} />
    </Sequence>
    <Sequence {...corte(732, 3)}>
      <Transicion tipo="flash" mitad={3} />
    </Sequence>
    <Sequence {...corte(810, 8)}>
      <Transicion tipo="barras" mitad={8} colores={[C.blanco, C.acento, C.fondoA]} />
    </Sequence>

    {/* grano común para unificar el acabado */}
    <Img src={staticFile('textura.png')} style={{ position: 'absolute', inset: 0, width: 1080, height: 1920, objectFit: 'none', opacity: 0.16, mixBlendMode: 'soft-light' }} />
    {subtitulos && <Subtitulos />}
  </AbsoluteFill>
);
