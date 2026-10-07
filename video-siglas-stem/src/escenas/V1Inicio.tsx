import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Camara, Papel, SOMBRA_SUAVE, Sticker, Tag, Titular, Trama } from '../componentes/collage';
import { C, X, entrada, mezcla, rampa, salida, suave } from '../marca';
import { AREAS, palabra } from '../tiempos';

// 0–11 s en un solo plano continuo (STEM no sale de pantalla):
// «¿Qué son las carreras STEM?» → «Son cuatro áreas para entender el mundo.» → «Cuatro letras que reúnen muchas carreras.»
// Al final la cámara entra en la S y empieza la escena de Ciencia.

const TILE = { w: 232, h: 320, gap: 8 };
const BLOQUES = [
  { fondo: '#F2F4FA', color: C.azul, rot: -2.5 },
  { fondo: C.acento, color: C.blanco, rot: 2 },
  { fondo: C.fondoB, color: C.blanco, rot: -1.5 },
  { fondo: '#F2F4FA', color: C.acento, rot: 2.5 },
];
const CARRERAS = [
  { t: 'Biología', x: 70, y: 1040, rot: -5, fondo: C.blanco, color: C.azul },
  { t: 'Química', x: 610, y: 1010, rot: 4, fondo: C.acento, color: C.blanco },
  { t: 'Física', x: 360, y: 1130, rot: -2, fondo: C.fondoB, color: C.blanco },
  { t: 'Informática', x: 640, y: 1170, rot: 6, fondo: C.blanco, color: C.azul },
  { t: 'Desarrollo de software', x: 70, y: 1250, rot: 3, fondo: C.acento, color: C.blanco },
  { t: 'Ingeniería civil', x: 560, y: 1330, rot: -4, fondo: C.fondoB, color: C.blanco },
  { t: 'Ingeniería mecánica', x: 110, y: 1400, rot: -2, fondo: C.blanco, color: C.azul },
  { t: 'Estadística', x: 690, y: 1440, rot: 5, fondo: C.acento, color: C.blanco },
];

export const V1Inicio: React.FC = () => {
  const f = useCurrentFrame();
  const stem = palabra('STEM', 1);
  const areas = palabra('áreas', 3);
  const mundo = palabra('mundo', 3);
  const cuatro = palabra('Cuatro', 7);
  const reunen = palabra('reúnen', 7);
  const muchas = palabra('muchas', 7);
  const carreras = palabra('carreras', 8.5);

  const cambio = rampa(f, cuatro - 14, cuatro + 2, suave); // sale la pregunta, entra «Cuatro letras…»
  const filaY = mezcla(560, 650, cambio);
  // zoom final hacia la S (corte de continuidad con la escena de Ciencia)
  const zoom = rampa(f, 304, 330, entrada);
  const sx = X + TILE.w / 2;
  const sy = filaY + TILE.h / 2;

  return (
    <AbsoluteFill style={{ background: C.fondoA }}>
      <Trama color="rgba(255,255,255,0.1)" paso={26} radio={5} style={{ inset: 0 }} mascara="linear-gradient(160deg, #000 0%, transparent 60%)" />
      <Papel opacidad={0.35} modo="soft-light" />
      <div style={{ position: 'absolute', inset: 0, scale: String(1 + zoom * 3.65), transformOrigin: `${sx}px ${sy}px` }}>
        <Camara dur={330} deriva={[1, 1.03]} origen={`${sx}px ${sy}px`}>
          {/* 1 · la pregunta */}
          <div style={{ position: 'absolute', left: X, top: 220, width: 960, opacity: 1 - cambio, translate: `0px ${-cambio * 80}px` }}>
            <Titular entra={palabra('Qué', 0) - 4} style={{ fontWeight: 900, fontSize: 96, lineHeight: 1, letterSpacing: -2 }}>
              ¿QUÉ SON LAS
            </Titular>
            <Titular entra={palabra('carreras', 1) - 4} style={{ fontWeight: 900, fontSize: 168, lineHeight: 0.95, letterSpacing: -5 }}>
              CARRERAS
            </Titular>
          </div>
          {/* 2 · «Cuatro letras que reúnen muchas carreras» */}
          <div style={{ position: 'absolute', left: X, top: 220, width: 960, opacity: rampa(f, cuatro - 6, cuatro) }}>
            <Titular entra={cuatro - 4} style={{ fontWeight: 900, fontSize: 118, lineHeight: 1, letterSpacing: -3 }}>
              CUATRO LETRAS
            </Titular>
            <Titular entra={reunen - 6} style={{ fontWeight: 700, fontSize: 64, lineHeight: 1.15, color: C.suave }}>
              que reúnen muchas
            </Titular>
            <Titular entra={carreras - 4} style={{ fontWeight: 900, fontSize: 118, lineHeight: 1, letterSpacing: -3, color: C.acento }}>
              CARRERAS
            </Titular>
          </div>

          {/* S · T · E · M: caen una a una cuando se dice «STEM» y se quedan */}
          {AREAS.map((a, i) => {
            const b = BLOQUES[i];
            const t = rampa(f, stem - 6 + i * 5, stem + 12 + i * 5, salida);
            const tag = rampa(f, areas - 6 + i * 6, areas + 6 + i * 6, salida);
            return (
              <div key={a.letra} style={{ position: 'absolute', left: X + i * (TILE.w + TILE.gap), top: filaY, width: TILE.w }}>
                <div
                  style={{
                    height: TILE.h,
                    background: b.fondo,
                    borderRadius: 18,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    rotate: `${b.rot + (1 - t) * (i % 2 ? 8 : -8)}deg`,
                    translate: `0px ${(1 - t) * 120}px`,
                    scale: String(0.8 + 0.2 * t),
                    opacity: Math.min(1, t * 2),
                    boxShadow: SOMBRA_SUAVE,
                  }}
                >
                  <div style={{ fontWeight: 900, fontSize: 250, lineHeight: 0.8, letterSpacing: -8, color: b.color, paddingBottom: 14 }}>{a.letra}</div>
                </div>
                <div style={{ marginTop: 18, textAlign: 'center', fontWeight: 700, fontSize: 19, letterSpacing: 3, color: C.blanco, opacity: tag * (1 - rampa(f, cuatro - 10, cuatro)), translate: `0px ${(1 - tag) * 14}px` }}>{a.nombre}</div>
              </div>
            );
          })}
          {/* signo de pregunta como sticker sobre la M */}
          <div style={{ position: 'absolute', left: X + 3 * (TILE.w + TILE.gap) + 150, top: filaY - 70, width: 140, height: 140, borderRadius: 70, background: C.acento, border: '6px solid #fff', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 104, lineHeight: 1, paddingBottom: 8, scale: String(rampa(f, stem + 14, stem + 28, salida)), rotate: `${12 - 12 * rampa(f, stem + 14, stem + 28, salida)}deg`, opacity: 1 - rampa(f, cuatro - 10, cuatro) }}>
            ?
          </div>
          <div style={{ opacity: 1 - rampa(f, cuatro - 10, cuatro) }}>
            <Tag texto="PARA ENTENDER EL MUNDO" fondo={C.blanco} color={C.azul} left={X} top={filaY + TILE.h + 80} rot={-2} entra={mundo - 18} tam={34} />
          </div>

          {/* Camila y Elías: suben con la pregunta y se van cuando cambia el título */}
          <Sticker cual="pareja" ancho={820} left={150} top={1090} entra={stem + 20} sale={cuatro - 16} desde="abajo" />

          {/* «muchas carreras»: las carreras salen desde las letras */}
          {CARRERAS.map((c, i) => {
            const e = muchas - 2 + i * 3;
            const t = rampa(f, e, e + 16, salida);
            const ox = X + (i % 4) * (TILE.w + TILE.gap) + 60;
            return (
              <div key={c.t} style={{ position: 'absolute', left: mezcla(ox, c.x, t), top: mezcla(filaY + 200, c.y, t), rotate: `${c.rot * t}deg`, opacity: Math.min(1, t * 2), padding: '12px 22px', background: c.fondo, color: c.color, fontWeight: 700, fontSize: 38, whiteSpace: 'nowrap', lineHeight: 1 }}>
                {c.t}
              </div>
            );
          })}
        </Camara>
      </div>
    </AbsoluteFill>
  );
};
