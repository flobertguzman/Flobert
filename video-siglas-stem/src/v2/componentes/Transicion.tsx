import { Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { C, suave } from '../../marca';

/**
 * Transiciones entre escenas. Se colocan centradas en el corte: cubren la pantalla justo en el fotograma del corte
 * y la destapan después. `mitad` = fotogramas a cada lado del corte.
 */
type Tipo = 'flash' | 'barras' | 'persiana' | 'papel' | 'iris';

export const Transicion: React.FC<{ tipo: Tipo; mitad: number; colores?: string[] }> = ({ tipo, mitad, colores = [C.acento, C.azul, C.fondoB] }) => {
  const f = useCurrentFrame();
  const total = mitad * 2;

  if (tipo === 'flash') {
    return <div style={{ position: 'absolute', inset: 0, background: '#fff', opacity: 0.85 * Math.max(0, 1 - Math.abs(f - mitad) / mitad) }} />;
  }

  if (tipo === 'barras') {
    return (
      <>
        {colores.map((color, k) => {
          const x = interpolate(f, [k * 2, total - (colores.length - 1 - k) * 2], [1400, -2300], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: suave });
          return <div key={k} style={{ position: 'absolute', top: -300, left: x, width: 2100, height: 2520, background: color, transform: 'skewX(-14deg)' }} />;
        })}
      </>
    );
  }

  if (tipo === 'persiana') {
    const cubre = f < mitad;
    const t = cubre ? interpolate(f, [0, mitad], [0, 1], { extrapolateRight: 'clamp', easing: suave }) : interpolate(f, [mitad, total], [1, 0], { extrapolateRight: 'clamp', easing: suave });
    return (
      <>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} style={{ position: 'absolute', top: 0, left: i * 180, width: 181, height: 1920, background: colores[0], scale: `${Math.min(1, t * 1.15 - i * 0.03 + 0.15)} 1`, transformOrigin: cubre ? '0% 50%' : '100% 50%' }} />
        ))}
      </>
    );
  }

  if (tipo === 'papel') {
    const y = interpolate(f, [0, mitad, total], [1960, 0, -2100], { extrapolateRight: 'clamp', easing: suave });
    const dientes = Array.from({ length: 28 }, (_, i) => `${(i / 27) * 100}% ${i % 2 ? 0 : 1.6}%`).join(', ');
    return (
      <div style={{ position: 'absolute', left: 0, top: y - 40, width: 1080, height: 2080, background: '#F7F8FC', clipPath: `polygon(${dientes}, 100% 98.4%, ${Array.from({ length: 28 }, (_, i) => `${100 - (i / 27) * 100}% ${i % 2 ? 100 : 98.4}%`).join(', ')})`, overflow: 'hidden' }}>
        <Img src={staticFile('papel.jpg')} style={{ width: 1080, height: 2080, objectFit: 'cover', mixBlendMode: 'multiply', opacity: 0.7 }} />
      </div>
    );
  }

  // iris: un círculo crece hasta tapar todo; la escena nueva tiene el mismo color de fondo y el círculo se disuelve
  const r = interpolate(f, [0, mitad], [0, 1150], { extrapolateRight: 'clamp', easing: suave });
  const sale = interpolate(f, [mitad, total], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <div style={{ position: 'absolute', left: 540 - r, top: 960 - r, width: r * 2, height: r * 2, borderRadius: '50%', background: colores[0], opacity: sale }} />;
};
