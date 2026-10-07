import { Escena, Linea, Sube, TarjetaCarrera, useF } from '../componentes/base';
import { Robot } from '../componentes/Robot';
import { C, FPS, X, rampa, salida } from '../../marca';
import { ESCENAS, palabraEn } from '../../tiempos';
import bloques from '../../datos/subtitulos.json';

// 46,8–53,8 s · «Para crear un robot, por ejemplo, se combinan programación, ingeniería y matemáticas.»
// Cada sumando entra cuando se dice y arma una parte del robot; con «= un robot» el robot se enciende.
const SUMANDOS = [
  { area: 'TECNOLOGÍA', nombre: 'Programación', palabra: 'programación' },
  { area: 'INGENIERÍA', nombre: 'Ingeniería', palabra: 'ingeniería' },
  { area: 'MATEMÁTICAS', nombre: 'Matemáticas', palabra: 'matemáticas' },
];
const TOP = 560;
const PASO = 168;

// el resultado aparece justo cuando termina la frase (mismo cálculo que herramientas/audio.py)
const finFrase = (bloques as { inicio: number; fin: number; palabras: { t: string }[] }[]).find((b) => b.inicio > ESCENAS.robot.from / FPS && b.palabras[b.palabras.length - 1].t.startsWith('matemáticas'))!;
const IGUAL = Math.round((finFrase.fin - 0.25) * FPS) - ESCENAS.robot.from;

export const A7Robot: React.FC<{ dur: number; inicio: number }> = ({ dur, inicio }) => {
  const f = useF();
  const entra = SUMANDOS.map((s) => palabraEn('robot', s.palabra) - 5);
  const pill = rampa(f, IGUAL, IGUAL + 16, salida);
  return (
    <Escena dur={dur} inicio={inicio} entrada="fundido" salida="fundido">
      <div style={{ position: 'absolute', left: X, top: 262, width: 960 }}>
        <Linea entra={8} style={{ fontWeight: 700, fontSize: 58, lineHeight: 1.05, color: C.suave }}>
          Para crear
        </Linea>
        <Linea entra={16} style={{ fontWeight: 900, fontSize: 112, lineHeight: 1.02, letterSpacing: -3.5, color: C.acento }}>
          un robot
        </Linea>
      </div>

      {SUMANDOS.map((s, i) => (
        <div key={s.nombre}>
          {i > 0 && (
            <Sube entra={entra[i] - 2} dist={10} style={{ position: 'absolute', left: X + 200, top: TOP + i * PASO - 38, width: 48, height: 48, borderRadius: 24, background: C.acento, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 36, lineHeight: 1, paddingBottom: 4, boxSizing: 'border-box' }}>
              +
            </Sube>
          )}
          <TarjetaCarrera area={s.area} carrera={s.nombre} entra={entra[i]} tam={42} style={{ position: 'absolute', left: X, top: TOP + i * PASO, width: 448 }} />
        </div>
      ))}

      <div style={{ position: 'absolute', left: X, top: TOP + 3 * PASO + 6, display: 'flex', alignItems: 'center', gap: 18, opacity: pill, translate: `0px ${(1 - pill) * 30}px` }}>
        <div style={{ fontWeight: 900, fontSize: 72, lineHeight: 1, color: C.acento }}>=</div>
        <div style={{ padding: '14px 40px', background: C.blanco, borderRadius: 999 }}>
          <span style={{ color: C.azul, fontWeight: 900, fontSize: 50, whiteSpace: 'nowrap' }}>un robot</span>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 528, top: 540 }}>
        <Robot f={f} cabeza={entra[0] + 3} cuerpo={entra[1] + 3} pecho={entra[2] + 3} vivo={IGUAL + 2} ancho={500} revelado={rampa(f, 18, 70)} />
      </div>
    </Escena>
  );
};
