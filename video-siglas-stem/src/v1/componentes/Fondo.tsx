import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { ALTO, ANCHO, C } from '../../marca';

/** Degradado azul MESCyT + resplandor que se desplaza despacio + grano de papel. */
export const Fondo: React.FC = () => {
  const frame = useCurrentFrame();
  const gx = 540 + Math.sin(frame / 95) * 150;
  const gy = 30 + Math.cos(frame / 120) * 4;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.fondoA} 0%, ${C.fondoB} 100%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(62% 30% at ${gx}px ${gy}%, rgba(70,150,255,0.26), rgba(70,150,255,0) 72%)` }} />
      <Img
        src={staticFile('textura.png')}
        style={{ position: 'absolute', inset: 0, width: ANCHO, height: ALTO, objectFit: 'none', opacity: 0.22, mixBlendMode: 'soft-light' }}
      />
    </AbsoluteFill>
  );
};
