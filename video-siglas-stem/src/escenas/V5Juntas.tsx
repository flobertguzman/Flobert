import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Camara, Papel, SOMBRA_SUAVE, Sello, Titular, Trama, Trazo } from '../componentes/collage';
import { MundoCiencia, MundoIngenieria, MundoMatematicas, MundoTecnologia } from '../componentes/mundos';
import { C, mezcla, rampa, salida } from '../marca';
import { palabraEn } from '../tiempos';

// 42–46,8 s · «Cada área tiene sus propias carreras, pero muchas trabajan juntas.»
// Pantalla partida en cuatro franjas (una por mundo) con sus carreras; luego las franjas se van
// y las cuatro letras se juntan en una sola fila.

const AREAS = [
  { l: 'S', nombre: 'CIENCIA', Mundo: MundoCiencia, letra: C.azul, carreras: ['Biología', 'Química', 'Física'] },
  { l: 'T', nombre: 'TECNOLOGÍA', Mundo: MundoTecnologia, letra: C.blanco, carreras: ['Informática', 'Desarrollo de software'] },
  { l: 'E', nombre: 'INGENIERÍA', Mundo: MundoIngenieria, letra: C.blanco, carreras: ['Civil', 'Eléctrica', 'Mecánica', 'Industrial'] },
  { l: 'M', nombre: 'MATEMÁTICAS', Mundo: MundoMatematicas, letra: C.azul, carreras: ['Matemáticas', 'Estadística'] },
];
const FRANJA = 270;
const SALEN = palabraEn('juntas', 'pero') - 4; // «pero…»: las franjas se van y las letras se juntan
const TRABAJAN = palabraEn('juntas', 'trabajan');
const JUNTAS = palabraEn('juntas', 'juntas');
const TILE = { w: 232, h: 270, y: 470, gap: 8 };

const Franja: React.FC<{ i: number }> = ({ i }) => {
  const f = useCurrentFrame();
  const a = AREAS[i];
  const { Mundo } = a;
  const entra = rampa(f, i * 3, 20 + i * 3, salida);
  const sale = rampa(f, SALEN + i * 2, SALEN + 16 + i * 2, salida);
  const dir = i % 2 ? 1 : -1;
  return (
    <div style={{ position: 'absolute', left: i * FRANJA, top: 0, width: FRANJA, height: 1920, overflow: 'hidden', translate: `0px ${dir * ((1 - entra) * 1920 + sale * 1920)}px`, borderRight: i < 3 ? `4px solid ${C.fondoB}` : undefined }}>
      <Mundo ancho={FRANJA} alto={1920} desfase={i * 25} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', fontWeight: 700, fontSize: 20, letterSpacing: 4, color: a.letra, opacity: rampa(f, 10, 16) }}>{a.nombre}</div>
      {a.carreras.map((c, k) => {
        const sp = rampa(f, 22 + i * 4 + k * 6, 34 + i * 4 + k * 6, salida);
        const claro = i === 0 || i === 3;
        return (
          <div
            key={c}
            style={{
              position: 'absolute',
              left: 22,
              width: FRANJA - 44,
              top: 640 + k * 132,
              boxSizing: 'border-box',
              padding: '14px 12px',
              textAlign: 'center',
              background: claro ? (k % 2 ? C.acento : C.azul) : k % 2 ? C.acento : C.blanco,
              color: claro ? C.blanco : k % 2 ? C.blanco : C.azul,
              fontWeight: 700,
              fontSize: 31,
              lineHeight: 1.1,
              rotate: `${(k % 2 ? 3 : -3) * (i % 2 ? -1 : 1)}deg`,
              scale: String(0.7 + 0.3 * sp),
              opacity: sp,
            }}
          >
            {c}
          </div>
        );
      })}
    </div>
  );
};

export const V5Juntas: React.FC = () => {
  const f = useCurrentFrame();
  const fondo = rampa(f, SALEN, SALEN + 6);
  return (
    <AbsoluteFill style={{ background: C.acento }}>
      <Trama color="rgba(36,58,117,0.3)" paso={24} radio={5} style={{ inset: 0 }} mascara="radial-gradient(70% 50% at 50% 45%, transparent 30%, #000 100%)" />
      <Papel opacidad={0.35} modo="soft-light" />
      <Camara dur={144} deriva={[1, 1.03]}>
        {AREAS.map((_, i) => (
          <Franja key={i} i={i} />
        ))}

        {/* las cuatro letras: arriba de su franja → juntas en una fila, cada una con su mundo dentro */}
        {AREAS.map((a, i) => {
          const { Mundo } = a;
          const t = rampa(f, SALEN + i * 2, SALEN + 24 + i * 2, salida);
          const x = mezcla(i * FRANJA, 64 + i * (TILE.w + TILE.gap), t);
          const y = mezcla(190, TILE.y, t);
          const w = mezcla(FRANJA, TILE.w, t);
          const h = mezcla(330, TILE.h, t);
          const pop = rampa(f, 4 + i * 3, 20 + i * 3, salida);
          return (
            <div key={a.l} style={{ position: 'absolute', left: x, top: y, width: w, height: h, overflow: 'hidden', borderRadius: mezcla(0, 18, t), boxShadow: t > 0.5 ? SOMBRA_SUAVE : undefined }}>
              <div style={{ position: 'absolute', inset: 0, opacity: t }}>
                <Mundo ancho={TILE.w} alto={TILE.h} desfase={i * 25} />
              </div>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: mezcla(250, 220, t), lineHeight: 0.8, letterSpacing: -6, color: a.letra, scale: String(1.15 - 0.15 * pop), paddingBottom: 14, opacity: pop }}>{a.l}</div>
            </div>
          );
        })}

        <Trazo
          d="M 520 40 C 900 30, 1010 120, 960 200 C 900 300, 300 320, 90 250 C -40 200, 10 60, 300 34 C 420 24, 520 30, 600 44"
          color={C.blanco}
          ancho={11}
          desde={TRABAJAN - 2}
          dur={18}
          viewBox="0 0 1040 330"
          style={{ left: 20, top: 440, width: 1040, height: 330, opacity: fondo }}
        />

        <div style={{ position: 'absolute', left: 0, right: 0, top: 850, display: 'flex', justifyContent: 'center' }}>
          <Titular entra={TRABAJAN - 4} style={{ fontWeight: 900, fontSize: 150, lineHeight: 1, letterSpacing: -4, color: C.blanco }}>
            TRABAJAN
          </Titular>
        </div>
        <Sello texto="JUNTAS" fondo={C.azul} color={C.blanco} left={230} top={1030} rot={-4} tam={190} entra={JUNTAS - 4} origen="50% 50%" />
      </Camara>
    </AbsoluteFill>
  );
};
