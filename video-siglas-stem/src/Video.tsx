import { AbsoluteFill, Img, Sequence, staticFile } from 'remotion';
import { Subtitulos } from './componentes/Subtitulos';
import { Transicion } from './componentes/Transicion';
import { V1Inicio } from './escenas/V1Inicio';
import { V2Letra } from './escenas/V2Letra';
import { V3Mundo } from './escenas/V3Mundo';
import { V4Ejemplos } from './escenas/V4Ejemplos';
import { V5Juntas } from './escenas/V5Juntas';
import { V6Robot } from './escenas/V6Robot';
import { V7Pregunta } from './escenas/V7Pregunta';
import { V8Cierre } from './escenas/V8Cierre';
import { FONT } from './fonts';
import { C } from './marca';
import { ESCENAS } from './tiempos';

export type PropsVideo = { subtitulos: boolean };

const seq = (k: keyof typeof ESCENAS) => ({ from: ESCENAS[k].from, durationInFrames: ESCENAS[k].dur, name: k });
const corte = (en: number, mitad: number) => ({ from: en - mitad, durationInFrames: mitad * 2, name: `transición ${en}` });

/** Reel de 60 s «¿Qué son las carreras STEM?» en collage editorial (versión 4, a partir de la v2). */
export const Video: React.FC<PropsVideo> = ({ subtitulos }) => (
  <AbsoluteFill style={{ fontFamily: `${FONT}, sans-serif`, color: '#fff', background: C.fondoB }}>
    <Sequence from={0} durationInFrames={ESCENAS.areaS.from} name="inicio: ¿qué son las carreras STEM?">
      <V1Inicio />
    </Sequence>
    {(['areaS', 'areaT', 'areaE', 'areaM'] as const).map((k, i) => (
      <Sequence key={k} {...seq(k)}>
        <V2Letra i={i} />
      </Sequence>
    ))}
    <Sequence {...seq('mundo')}>
      <V3Mundo />
    </Sequence>
    <Sequence {...seq('ejemplos')}>
      <V4Ejemplos />
    </Sequence>
    <Sequence {...seq('juntas')}>
      <V5Juntas />
    </Sequence>
    <Sequence {...seq('robot')}>
      <V6Robot />
    </Sequence>
    <Sequence {...seq('pregunta')}>
      <V7Pregunta />
    </Sequence>
    <Sequence {...seq('cierre')}>
      <V8Cierre />
    </Sequence>

    {/* transiciones centradas en cada corte */}
    <Sequence {...corte(ESCENAS.areaS.from, 4)}>
      <Transicion tipo="flash" mitad={4} />
    </Sequence>
    <Sequence {...corte(ESCENAS.areaT.from, 11)}>
      <Transicion tipo="barras" mitad={11} colores={[C.acento, C.azul, C.fondoB]} />
    </Sequence>
    <Sequence {...corte(ESCENAS.areaE.from, 10)}>
      <Transicion tipo="persiana" mitad={10} colores={['#1F4596']} />
    </Sequence>
    <Sequence {...corte(ESCENAS.areaM.from, 11)}>
      <Transicion tipo="papel" mitad={11} />
    </Sequence>
    <Sequence {...corte(ESCENAS.mundo.from, 12)}>
      <Transicion tipo="iris" mitad={12} colores={[C.acento]} />
    </Sequence>
    <Sequence {...corte(ESCENAS.ejemplos.from, 11)}>
      <Transicion tipo="barras" mitad={11} colores={[C.azul, C.fondoB, '#F2F4FA']} />
    </Sequence>
    <Sequence {...corte(ESCENAS.juntas.from, 11)}>
      <Transicion tipo="barras" mitad={11} colores={[C.fondoB, C.azul, C.acento]} />
    </Sequence>
    <Sequence {...corte(ESCENAS.robot.from, 12)}>
      <Transicion tipo="iris" mitad={12} colores={['#1F4596']} />
    </Sequence>
    <Sequence {...corte(ESCENAS.pregunta.from, 12)}>
      <Transicion tipo="iris" mitad={12} colores={[C.fondoA]} />
    </Sequence>
    <Sequence {...corte(ESCENAS.cierre.from, 11)}>
      <Transicion tipo="barras" mitad={11} colores={[C.blanco, C.acento, C.fondoA]} />
    </Sequence>

    {/* grano común para unificar el acabado */}
    <Img src={staticFile('textura.png')} style={{ position: 'absolute', inset: 0, width: 1080, height: 1920, objectFit: 'none', opacity: 0.16, mixBlendMode: 'soft-light' }} />
    {subtitulos && <Subtitulos />}
  </AbsoluteFill>
);
