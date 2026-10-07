import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Camara, Papel, SOMBRA_SUAVE, Sticker, Titular, Trama } from '../componentes/collage';
import { MundoCiencia, MundoIngenieria, MundoMatematicas, MundoTecnologia } from '../componentes/mundos';
import { C, X, rampa, salida } from '../marca';
import { palabraEn } from '../tiempos';

// 35–42 s · «Algunos ejemplos de carreras STEM: biología, informática, ingeniería civil y estadística.»
// Cada ejemplo entra como una tarjeta pegada, con su área y la letra en su mundo.
const EJEMPLOS = [
  { letra: 'S', area: 'CIENCIA', carrera: 'Biología', palabra: 'biología', Mundo: MundoCiencia, colorLetra: C.azul, rot: -2 },
  { letra: 'T', area: 'TECNOLOGÍA', carrera: 'Informática', palabra: 'informática', Mundo: MundoTecnologia, colorLetra: C.blanco, rot: 1.5 },
  { letra: 'E', area: 'INGENIERÍA', carrera: 'Ingeniería civil', palabra: 'ingeniería', Mundo: MundoIngenieria, colorLetra: C.blanco, rot: -1.5 },
  { letra: 'M', area: 'MATEMÁTICAS', carrera: 'Estadística', palabra: 'estadística', Mundo: MundoMatematicas, colorLetra: C.azul, rot: 2 },
];

export const V4Ejemplos: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: '#F2F4FA' }}>
      <Trama color="rgba(36,58,117,0.2)" paso={24} radio={5} style={{ left: 0, top: 0, width: 1080, height: 900 }} mascara="radial-gradient(70% 60% at 0% 0%, #000 0%, transparent 80%)" />
      <Papel opacidad={0.6} />
      <Camara dur={210}>
        <div style={{ position: 'absolute', left: X, top: 220, width: 960 }}>
          <Titular entra={6} style={{ fontWeight: 700, fontSize: 64, lineHeight: 1.1, color: C.azul }}>
            Algunos ejemplos de
          </Titular>
          <Titular entra={14} style={{ fontWeight: 900, fontSize: 124, lineHeight: 1, letterSpacing: -4, color: C.azul }}>
            carreras <span style={{ color: C.acento }}>STEM</span>
          </Titular>
        </div>
        {EJEMPLOS.map((e, i) => {
          const entra = palabraEn('ejemplos', e.palabra) - 6;
          const t = rampa(f, entra, entra + 16, salida);
          const { Mundo } = e;
          return (
            <div key={e.carrera} style={{ position: 'absolute', left: X, top: 530 + i * 158, width: 560, height: 134, background: C.blanco, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 22, padding: '0 22px 0 14px', boxSizing: 'border-box', rotate: `${e.rot}deg`, translate: `${(1 - t) * -620}px 0px`, opacity: Math.min(1, t * 2), boxShadow: SOMBRA_SUAVE }}>
              <div style={{ position: 'relative', width: 106, height: 106, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                <Mundo ancho={106} alto={106} desfase={i * 20} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 76, lineHeight: 0.8, color: e.colorLetra, paddingBottom: 6 }}>{e.letra}</div>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 20, letterSpacing: 3, color: C.acento }}>{e.area}</div>
                <div style={{ marginTop: 6, fontWeight: 900, fontSize: 46, letterSpacing: -1, color: C.azul, whiteSpace: 'nowrap', lineHeight: 1.05 }}>{e.carrera}</div>
              </div>
            </div>
          );
        })}
        <Sticker cual="elias" ancho={560} left={520} top={930} rot={3} entra={16} desde="derecha" />
      </Camara>
    </AbsoluteFill>
  );
};
