import './index.css';
import { AbsoluteFill, Composition, Folder } from 'remotion';
import { R1Gancho } from './escenas/R1Gancho';
import { R2Letra } from './escenas/R2Letra';
import { R3Juntas } from './escenas/R3Juntas';
import { R4Robot } from './escenas/R4Robot';
import { R5Pregunta } from './escenas/R5Pregunta';
import { R6Cierre } from './escenas/R6Cierre';
import { FONT } from './fonts';
import { ALTO, ANCHO, FPS } from './marca';
import { ESCENAS, TOTAL } from './tiempos';
import { Video } from './Video';
import { VideoV1 } from './v1/Video';

// Cada escena como composición independiente para revisarla sola en el Studio.
const Sola: React.FC<{ children: React.ReactNode }> = ({ children }) => <AbsoluteFill style={{ fontFamily: `${FONT}, sans-serif`, color: '#fff' }}>{children}</AbsoluteFill>;
const comp = (id: string, dur: number, nodo: React.ReactNode) => (
  <Composition key={id} id={id} component={() => <Sola>{nodo}</Sola>} durationInFrames={dur} fps={FPS} width={ANCHO} height={ALTO} />
);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="STEM-siglas" component={Video} durationInFrames={TOTAL} fps={FPS} width={ANCHO} height={ALTO} defaultProps={{ subtitulos: true }} />
    <Folder name="escenas">
      {comp('R1-gancho', ESCENAS.letras.dur, <R1Gancho />)}
      {comp('R2-S-ciencia', ESCENAS.areaS.dur, <R2Letra i={0} />)}
      {comp('R2-T-tecnologia', ESCENAS.areaT.dur, <R2Letra i={1} />)}
      {comp('R2-E-ingenieria', ESCENAS.areaE.dur, <R2Letra i={2} />)}
      {comp('R2-M-matematicas', ESCENAS.areaM.dur, <R2Letra i={3} />)}
      {comp('R3-juntas', ESCENAS.juntas.dur, <R3Juntas />)}
      {comp('R4-robot', ESCENAS.robot.dur, <R4Robot />)}
      {comp('R5-pregunta', ESCENAS.personas.dur, <R5Pregunta />)}
      {comp('R6-cierre', ESCENAS.cierre.dur, <R6Cierre />)}
    </Folder>
    <Folder name="version-1">
      <Composition id="STEM-siglas-v1" component={VideoV1} durationInFrames={TOTAL} fps={FPS} width={ANCHO} height={ALTO} defaultProps={{ subtitulos: true }} />
    </Folder>
  </>
);
