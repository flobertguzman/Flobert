import { AbsoluteFill, Sequence } from 'remotion';
import { EtiquetaFija } from './componentes/Etiqueta';
import { Fondo } from './componentes/Fondo';
import { Subtitulos } from './componentes/Subtitulos';
import { E1Letras } from './escenas/E1Letras';
import { E2Area } from './escenas/E2Area';
import { E3Juntas } from './escenas/E3Juntas';
import { E4Robot } from './escenas/E4Robot';
import { E5Personas } from './escenas/E5Personas';
import { E6Cierre } from './escenas/E6Cierre';
import { FONT } from './fonts';
import { ESCENAS } from './tiempos';

export type PropsVideo = { subtitulos: boolean };

const seq = (k: keyof typeof ESCENAS) => ({ from: ESCENAS[k].from, durationInFrames: ESCENAS[k].dur, name: k });

/** Composición principal: las escenas una tras otra sobre el fondo común. */
export const Video: React.FC<PropsVideo> = ({ subtitulos }) => (
  <AbsoluteFill style={{ fontFamily: `${FONT}, sans-serif`, color: '#fff' }}>
    <Fondo />
    <Sequence {...seq('letras')}>
      <E1Letras />
    </Sequence>
    {(['areaS', 'areaT', 'areaE', 'areaM'] as const).map((k, i) => (
      <Sequence key={k} {...seq(k)}>
        <E2Area i={i} />
      </Sequence>
    ))}
    <Sequence {...seq('juntas')}>
      <E3Juntas />
    </Sequence>
    <Sequence {...seq('robot')}>
      <E4Robot />
    </Sequence>
    <Sequence {...seq('personas')}>
      <E5Personas />
    </Sequence>
    <Sequence {...seq('cierre')}>
      <E6Cierre />
    </Sequence>
    <EtiquetaFija />
    {subtitulos && <Subtitulos />}
  </AbsoluteFill>
);
