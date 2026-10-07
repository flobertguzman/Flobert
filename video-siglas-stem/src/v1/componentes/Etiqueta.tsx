import { useCurrentFrame } from 'remotion';
import { C, X, rampa } from '../../marca';
import { ESCENAS } from '../../tiempos';

/** Etiqueta superior «ACELERADORES STEM» con guion rojo + indicador S T E M (activa = índice resaltado). */
export const Etiqueta: React.FC<{ top?: number; activa?: number; opacidad?: number }> = ({ top = 150, activa, opacidad = 1 }) => (
  <div style={{ opacity: opacidad }}>
    <div style={{ position: 'absolute', left: X, top, display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 32, height: 5, background: C.acento, borderRadius: 3 }} />
      <div style={{ fontWeight: 700, fontSize: 24, letterSpacing: 5, color: C.blanco }}>ACELERADORES STEM</div>
    </div>
    <div style={{ position: 'absolute', right: X, top: top - 4, display: 'flex', gap: 18 }}>
      {['S', 'T', 'E', 'M'].map((l, i) => {
        const on = activa === undefined || activa === i;
        return (
          <div key={l} style={{ fontWeight: 900, fontSize: 32, letterSpacing: 2, color: on ? C.blanco : 'rgba(255,255,255,0.32)', borderBottom: `4px solid ${activa === i ? C.acento : 'transparent'}`, paddingBottom: 2, lineHeight: 1 }}>
            {l}
          </div>
        );
      })}
    </div>
  </div>
);

/** La etiqueta superior se mantiene fija entre escenas (no parpadea en los cortes) y se va con el cierre. */
export const EtiquetaFija: React.FC = () => {
  const f = useCurrentFrame();
  const areas = [ESCENAS.areaS, ESCENAS.areaT, ESCENAS.areaE, ESCENAS.areaM];
  const i = areas.findIndex((a) => f >= a.from && f < a.from + a.dur);
  const fin = ESCENAS.cierre.from;
  return <Etiqueta activa={i >= 0 ? i : undefined} opacidad={rampa(f, 0, 8) * (1 - rampa(f, fin - 6, fin))} />;
};
