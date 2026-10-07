import './index.css';
import { AbsoluteFill, Composition } from 'remotion';
import { Etiqueta } from './componentes/Etiqueta';
import { Fondo } from './componentes/Fondo';
import { E1Letras } from './escenas/E1Letras';
import { E2Area } from './escenas/E2Area';
import { E3Juntas } from './escenas/E3Juntas';
import { E4Robot } from './escenas/E4Robot';
import { E5Personas } from './escenas/E5Personas';
import { E6Cierre } from './escenas/E6Cierre';
import { FONT } from './fonts';
import { ALTO, ANCHO, FPS } from './marca';
import { ESCENAS, TOTAL } from './tiempos';
import { Video } from './Video';

// Cada escena como composición independiente para revisarla sola en el Studio.
const Sola: React.FC<{ children: React.ReactNode; activa?: number; etiqueta: boolean }> = ({ children, activa, etiqueta }) => (
  <AbsoluteFill style={{ fontFamily: `${FONT}, sans-serif`, color: '#fff' }}>
    <Fondo />
    {children}
    {etiqueta && <Etiqueta activa={activa} />}
  </AbsoluteFill>
);
const comp = (id: string, dur: number, nodo: React.ReactNode, activa?: number, etiqueta = true) => (
  <Composition key={id} id={id} component={() => <Sola activa={activa} etiqueta={etiqueta}>{nodo}</Sola>} durationInFrames={dur} fps={FPS} width={ANCHO} height={ALTO} />
);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="STEM-siglas" component={Video} durationInFrames={TOTAL} fps={FPS} width={ANCHO} height={ALTO} defaultProps={{ subtitulos: true }} />
    {comp('E1-letras', ESCENAS.letras.dur, <E1Letras />)}
    {comp('E2-S-ciencia', ESCENAS.areaS.dur, <E2Area i={0} />, 0)}
    {comp('E2-T-tecnologia', ESCENAS.areaT.dur, <E2Area i={1} />, 1)}
    {comp('E2-E-ingenieria', ESCENAS.areaE.dur, <E2Area i={2} />, 2)}
    {comp('E2-M-matematicas', ESCENAS.areaM.dur, <E2Area i={3} />, 3)}
    {comp('E3-juntas', ESCENAS.juntas.dur, <E3Juntas />)}
    {comp('E4-robot', ESCENAS.robot.dur, <E4Robot />)}
    {comp('E5-personas', ESCENAS.personas.dur, <E5Personas />)}
    {comp('E6-cierre', ESCENAS.cierre.dur, <E6Cierre />, undefined, false)}
  </>
);
