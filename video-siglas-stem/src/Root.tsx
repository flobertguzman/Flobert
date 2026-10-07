import './index.css';
import { Composition, Folder, Sequence } from 'remotion';
import { ALTO, ANCHO, FPS } from './marca';
import { ESCENAS, TOTAL } from './tiempos';
import { Video } from './Video';
import { VideoV1 } from './v1/Video';
import { VideoV2 } from './v2/Video';

// Cada escena como composición propia: es el mismo reel recortado a su tramo (banda, marca y subtítulos incluidos).
const Tramo: React.FC<{ desde: number; subtitulos: boolean }> = ({ desde, subtitulos }) => (
  <Sequence from={-desde}>
    <Video subtitulos={subtitulos} />
  </Sequence>
);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="STEM-siglas" component={Video} durationInFrames={TOTAL} fps={FPS} width={ANCHO} height={ALTO} defaultProps={{ subtitulos: true }} />
    <Folder name="escenas">
      {Object.entries(ESCENAS).map(([k, e], i) => (
        <Composition key={k} id={`${String(i + 1).padStart(2, '0')}-${k}`} component={Tramo} durationInFrames={e.dur} fps={FPS} width={ANCHO} height={ALTO} defaultProps={{ desde: e.from, subtitulos: true }} />
      ))}
    </Folder>
    <Folder name="versiones-anteriores">
      <Composition id="STEM-siglas-v1" component={VideoV1} durationInFrames={900} fps={FPS} width={ANCHO} height={ALTO} defaultProps={{ subtitulos: true }} />
      <Composition id="STEM-siglas-v2" component={VideoV2} durationInFrames={900} fps={FPS} width={ANCHO} height={ALTO} defaultProps={{ subtitulos: true }} />
    </Folder>
  </>
);
