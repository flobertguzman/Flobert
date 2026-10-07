import { Escena, Linea, Persona, Sube, vidrio, useF } from '../componentes/base';
import { C, X, rampa, salida } from '../../marca';
import { AREAS, palabraEn } from '../../tiempos';

// 11–28 s · Una letra cada 4,3 s: la inicial → la palabra en inglés → la palabra en español → ejemplos de carreras.
// La banda de vidrio (capa global) se acerca a la zona de cada área.
const ESCENA = ['areaS', 'areaT', 'areaE', 'areaM'] as const;
const PERSONA = [null, { cual: 'camila' as const, ancho: 620, left: 470, top: 1090 }, null, { cual: 'elias' as const, ancho: 540, left: 520, top: 1020 }];

export const A3Letra: React.FC<{ i: number; dur: number; inicio: number }> = ({ i, dur, inicio }) => {
  const f = useF();
  const a = AREAS[i];
  const en = palabraEn(ESCENA[i], a.en);
  const es = palabraEn(ESCENA[i], a.es);
  const tEn = rampa(f, en - 4, en + 12, salida);
  const flecha = rampa(f, en + 10, es - 2, salida);
  const tLetra = rampa(f, 4, 26, salida);
  const p = PERSONA[i];
  return (
    <Escena dur={dur} inicio={inicio} entrada="deslizar" salida={i === 3 ? 'fundido' : 'deslizar'}>
      {/* progreso S · T · E · M */}
      <div style={{ position: 'absolute', left: X, top: 226, display: 'flex', gap: 22 }}>
        {AREAS.map((b, k) => (
          <div key={b.letra} style={{ fontWeight: 900, fontSize: 34, lineHeight: 1, paddingBottom: 6, color: k === i ? C.blanco : 'rgba(255,255,255,0.32)', borderBottom: `4px solid ${k === i ? C.acento : 'transparent'}` }}>
            {b.letra}
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', left: 34, top: 300, fontWeight: 900, fontSize: 560, lineHeight: 0.84, letterSpacing: -16, opacity: tLetra, scale: String(1.06 - 0.06 * tLetra), transformOrigin: '20% 60%' }}>{a.letra}</div>

      <div style={{ position: 'absolute', left: 560, top: 372, width: 500, clipPath: `inset(-10% ${(1 - tEn) * 100}% -10% 0)` }}>
        <div style={{ fontWeight: 700, fontSize: 22, letterSpacing: 5, color: C.tenue }}>EN INGLÉS</div>
        <div style={{ marginTop: 10, fontWeight: 700, fontSize: 54, letterSpacing: 4, color: C.acento, whiteSpace: 'nowrap', lineHeight: 1.05 }}>
          <span style={{ color: C.blanco, fontWeight: 900 }}>{a.letra}</span>
          {a.resto}
        </div>
      </div>
      <svg width={360} height={200} viewBox="0 0 360 200" style={{ position: 'absolute', left: 600, top: 500, overflow: 'visible' }}>
        <path d="M 290 6 C 350 70, 300 150, 120 168 L 40 172" fill="none" stroke={C.acento} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - flecha} />
        <path d="M 72 146 L 36 172 L 74 196" fill="none" stroke={C.acento} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={rampa(f, es - 6, es - 1)} />
      </svg>

      <div style={{ position: 'absolute', left: X, top: 760, width: 952 }}>
        <Sube entra={es - 4} dist={14} style={{ fontWeight: 700, fontSize: 22, letterSpacing: 5, color: C.tenue }}>
          EN ESPAÑOL
        </Sube>
        <div style={{ marginTop: 6 }}>
          <Linea entra={es - 3} dur={20} style={{ fontWeight: 900, fontSize: 136, lineHeight: 1, letterSpacing: -4 }}>
            {a.es}
          </Linea>
        </div>
        <div style={{ marginTop: 10, height: 7, width: 240 * rampa(f, es + 4, es + 22, salida), background: C.acento, borderRadius: 4 }} />
      </div>

      <div style={{ position: 'absolute', left: X, top: 1010, display: 'flex', gap: 12, flexWrap: 'wrap', width: 952 }}>
        {a.carreras.map((c, k) => (
          <Sube key={c} entra={es + 26 + k * 6} dist={20} style={{ ...vidrio(999), padding: '12px 26px', fontWeight: 700, fontSize: 32, whiteSpace: 'nowrap' }}>
            {c}
          </Sube>
        ))}
      </div>

      {p && <Persona cual={p.cual} ancho={p.ancho} left={p.left} top={p.top} entra={6} />}
    </Escena>
  );
};
