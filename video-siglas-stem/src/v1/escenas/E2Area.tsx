import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BandaZona } from '../componentes/BandaZona';
import { C, X, rampa, salida } from '../../marca';
import { AREAS } from '../tiempos30';

/**
 * 3 s por letra: la inicial golpea → aparece la palabra en inglés (con la inicial resaltada)
 * → una flecha dibujada a mano → la palabra en español. Detrás, la zona de esa área en la banda.
 * `i`: 0 = S, 1 = T, 2 = E, 3 = M.
 */
export const E2Area: React.FC<{ i: number }> = ({ i }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = AREAS[i];

  // la inicial golpea con rebote y sacude un poco la pantalla
  const sp = spring({ frame: f - 1, fps, config: { damping: 9, stiffness: 230, mass: 0.7 } });
  const escala = 1.75 - 0.75 * sp;
  const golpe = Math.max(0, f - 2);
  const sacudida = Math.sin(golpe * 2.4) * 16 * Math.exp(-golpe / 3.2);

  const en = rampa(f, 19, 31);
  const flecha = rampa(f, 31, 42, salida);
  const es = rampa(f, 40, 54);
  const fuera = 1 - rampa(f, 85, 89);

  return (
    <>
      <BandaZona zona={i} desde={Math.max(0, i - 1)} f={f} top={850} alto={600} opacidad={i === 0 ? rampa(f, 0, 12) : 1} />
      <div style={{ opacity: fuera }}>

        {/* inicial gigante */}
        <div
          style={{
            position: 'absolute',
            left: 30,
            top: 222,
            fontSize: 560,
            fontWeight: 900,
            lineHeight: 0.84,
            letterSpacing: -16,
            color: C.blanco,
            transform: `translate(${sacudida}px, ${-sacudida * 0.4}px) scale(${escala})`,
            transformOrigin: '34% 58%',
            opacity: rampa(f, 0, 3),
            textShadow: '0 0 60px rgba(90,160,255,0.45)',
          }}
        >
          {a.letra}
        </div>

        {/* palabra en inglés */}
        <div style={{ position: 'absolute', left: 548, top: 340, width: 480, clipPath: `inset(0 ${(1 - en) * 100}% 0 0)`, transform: `translateX(${(1 - en) * -24}px)` }}>
          <div style={{ fontWeight: 700, fontSize: 22, letterSpacing: 5, color: C.tenue }}>EN INGLÉS</div>
          <div style={{ marginTop: 8, fontWeight: 700, fontSize: 54, letterSpacing: 4, color: C.acento, whiteSpace: 'nowrap', lineHeight: 1.05 }}>
            <span style={{ color: C.blanco, fontWeight: 900 }}>{a.letra}</span>
            {a.resto}
          </div>
        </div>

        {/* flecha dibujada a mano: del inglés al español */}
        <svg width={420} height={190} viewBox="0 0 420 190" style={{ position: 'absolute', left: 540, top: 490, overflow: 'visible' }}>
          <path
            d="M 330 12 C 400 70, 330 130, 150 150 C 110 154, 80 156, 40 156"
            fill="none"
            stroke={C.acento}
            strokeWidth={7}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - flecha}
          />
          <path
            d="M 78 126 L 36 156 L 80 184"
            fill="none"
            stroke={C.acento}
            strokeWidth={7}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={rampa(f, 38, 43)}
          />
        </svg>

        {/* palabra en español */}
        <div style={{ position: 'absolute', left: X, top: 676, width: 952 }}>
          <div style={{ fontWeight: 700, fontSize: 22, letterSpacing: 5, color: C.tenue, opacity: es }}>EN ESPAÑOL</div>
          <div style={{ overflow: 'hidden', paddingBottom: 14, marginTop: 4 }}>
            <div
              style={{
                fontWeight: 900,
                fontSize: 138,
                lineHeight: 1,
                letterSpacing: -4,
                transform: `translateY(${(1 - es) * 120}%)`,
                whiteSpace: 'nowrap',
              }}
            >
              {a.es}
            </div>
          </div>
          <div style={{ marginTop: 2, height: 8, width: 240 * es, background: C.acento, borderRadius: 4 }} />
        </div>
      </div>
    </>
  );
};
