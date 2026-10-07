import { Img, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { ANCHO, C, X, mezcla, rampa } from '../../marca';

// Las cuatro letras vuelven a juntarse y la banda completa cruza la pantalla de lado a lado.
const TILES = [
  { l: 'S', es: 'CIENCIA', dx: -480, dy: -330, rot: -28, pulso: 14 },
  { l: 'T', es: 'TECNOLOGÍA', dx: 480, dy: -330, rot: 26, pulso: 26 },
  { l: 'E', es: 'INGENIERÍA', dx: -480, dy: 360, rot: 24, pulso: 38 },
  { l: 'M', es: 'MATEMÁTICAS', dx: 480, dy: 360, rot: -26, pulso: 50 },
];
const W = 222;

export const E3Juntas: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fuera = 1 - rampa(f, 115, 119);
  const t1 = rampa(f, 3, 16);
  const t2 = rampa(f, 9, 24);
  const junta = rampa(f, 62, 84); // los cuatro bloques se pegan en una sola tira
  const hueco = mezcla(24, 3, junta);

  // la banda completa entra desde la derecha y cruza hasta quedar centrada
  const cruce = rampa(f, 3, 34);
  const bandaX = mezcla(ANCHO + 120, 0, cruce);
  const sy = 0.8;
  const esc = ANCHO / 1500;
  const mascara = 'linear-gradient(180deg, transparent 0%, #000 22%, #000 78%, transparent 100%)';

  return (
    <>
      <div style={{ position: 'absolute', left: bandaX, top: 1180 - 925 * esc * sy, width: ANCHO, height: 1862 * esc * sy, maskImage: mascara, WebkitMaskImage: mascara, opacity: fuera }}>
        <Img src={staticFile('car/banda_b.png')} style={{ width: ANCHO, height: 1862 * esc * sy, display: 'block' }} />
        <div style={{ position: 'absolute', top: 0, bottom: 0, width: 220, left: mezcla(-300, ANCHO + 80, rampa(f, 30, 70)), background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.4), rgba(255,255,255,0))', transform: 'skewX(-18deg)', mixBlendMode: 'screen' }} />
      </div>

      <div style={{ opacity: fuera }}>
        <div style={{ position: 'absolute', left: X, top: 222, width: 952 }}>
          <div style={{ overflow: 'hidden', paddingBottom: 6 }}>
            <div style={{ fontWeight: 700, fontSize: 54, lineHeight: 1.05, color: C.suave, transform: `translateY(${(1 - t1) * 110}%)` }}>Las cuatro áreas</div>
          </div>
          <div style={{ overflow: 'hidden', paddingBottom: 12 }}>
            <div style={{ fontWeight: 900, fontSize: 112, lineHeight: 1.02, letterSpacing: -3.5, transform: `translateY(${(1 - t2) * 110}%)`, whiteSpace: 'nowrap' }}>
              trabajan <span style={{ color: C.acento }}>juntas</span>
            </div>
          </div>
        </div>

        {TILES.map((t, i) => {
          const sp = spring({ frame: f - 2 - i * 2, fps, config: { damping: 15, stiffness: 150, mass: 0.9 } });
          const pulso = Math.max(0, 1 - Math.abs(f - t.pulso - 3) / 7);
          const x = X + i * (W + hueco) + (952 - (4 * W + 3 * hueco)) / 2;
          return (
            <div
              key={t.l}
              style={{
                position: 'absolute',
                left: x,
                top: 520,
                width: W,
                height: 270,
                boxSizing: 'border-box',
                borderRadius: mezcla(30, 22, junta),
                background: `rgba(255,255,255,${0.08 + 0.2 * pulso})`,
                border: `3px solid ${pulso > 0.05 ? C.acento : C.vidrioLinea}`,
                boxShadow: `0 0 ${50 * pulso}px rgba(255,90,95,${0.7 * pulso})`,
                transform: `translate(${(1 - sp) * t.dx}px, ${(1 - sp) * t.dy}px) rotate(${(1 - sp) * t.rot}deg) scale(${1 + 0.08 * pulso})`,
                opacity: rampa(f, 0, 4),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ fontWeight: 900, fontSize: 190, lineHeight: 0.85, letterSpacing: -6, marginTop: 4 }}>{t.l}</div>
              <div style={{ marginTop: 14, fontWeight: 700, fontSize: 17, letterSpacing: 3, color: C.acento, whiteSpace: 'nowrap' }}>{t.es}</div>
            </div>
          );
        })}
      </div>
    </>
  );
};
