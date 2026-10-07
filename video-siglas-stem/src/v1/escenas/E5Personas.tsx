import { Img, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { ALTO, C, SCRIPT_ROT, SOMBRA_PERSONA, X, mezcla, rampa } from '../../marca';
import { SCRIPT } from '../../fonts';

// Camila y Elías entran desde los lados (el recorte se parte en el punto donde se tocan) y preguntan.
const IMG_W = 1500;
const IMG_H = 1862;
const CORTE = 735 / IMG_W; // línea donde Camila y Elías se tocan en el recorte
const ESC = 0.6445;
const W = IMG_W * ESC;
const H = IMG_H * ESC;
const LEFT = (1080 - W) / 2;
const TOP = ALTO - H + 30;
const AREAS = ['Ciencia', 'Tecnología', 'Ingeniería', 'Matemáticas'];

export const E5Personas: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fuera = 1 - rampa(f, 73, 77);
  const camila = spring({ frame: f, fps, config: { damping: 15, stiffness: 170, mass: 0.75 } });
  const elias = spring({ frame: f - 3, fps, config: { damping: 15, stiffness: 170, mass: 0.75 } });
  const t1 = rampa(f, 0, 10);
  const t2 = rampa(f, 4, 20);

  const img = (clip: string, dx: number) => (
    <Img
      src={staticFile('car/recorte_a.png')}
      style={{ position: 'absolute', left: LEFT, top: TOP, width: W, height: H, clipPath: clip, transform: `translateX(${dx}px)`, filter: SOMBRA_PERSONA }}
    />
  );

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: fuera }}>
      <div style={{ position: 'absolute', left: X, top: 222, width: 952 }}>
        <div style={{ overflow: 'hidden', paddingBottom: 4 }}>
          <div style={{ fontWeight: 700, fontSize: 64, lineHeight: 1.05, color: C.suave, transform: `translateY(${(1 - t1) * 110}%)` }}>¿Qué área te da más</div>
        </div>
        <div
          style={{
            marginTop: -4,
            fontFamily: `${SCRIPT}, cursive`,
            fontWeight: 700,
            fontSize: 200,
            lineHeight: 1,
            color: C.acento,
            transform: `rotate(${SCRIPT_ROT}deg) translateY(${(1 - t2) * 60}px) scale(${mezcla(0.85, 1, t2)})`,
            transformOrigin: 'left center',
            opacity: t2,
            whiteSpace: 'nowrap',
          }}
        >
          curiosidad?
        </div>
      </div>

      <div style={{ position: 'absolute', left: X, top: 590, width: 952, display: 'flex', gap: 14 }}>
        {AREAS.map((a, i) => {
          const sp = spring({ frame: f - 14 - i * 3, fps, config: { damping: 11, stiffness: 220, mass: 0.6 } });
          return (
            <div key={a} style={{ flex: 1, textAlign: 'center', padding: '16px 0 18px', borderRadius: 22, background: C.vidrio, border: `2px solid ${C.vidrioLinea}`, fontWeight: 700, fontSize: 27, transform: `scale(${Math.max(0, sp)})`, opacity: Math.min(1, sp * 2) }}>
              {a}
            </div>
          );
        })}
      </div>

      {img(`inset(0 ${(1 - CORTE) * 100}% 0 0)`, (1 - camila) * -760)}
      {img(`inset(0 0 0 ${CORTE * 100}%)`, (1 - elias) * 760)}
    </div>
  );
};
