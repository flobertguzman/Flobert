import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { Camara, Papel, SOMBRA_SUAVE, Trama } from '../componentes/collage';
import { MundoCiencia, MundoIngenieria, MundoMatematicas, MundoTecnologia } from '../componentes/mundos';
import { C, mezcla, rampa, salida } from '../marca';

// 57–60 s · Cierre MESCyT: las cuatro áreas como firma, logo oficial (vertical, SVG) y hashtags.
// Fondo claro porque el logo oficial es azul y rojo y no se lee sobre azul. Al final funde a azul (el reel empieza en azul).
const FIRMA = [
  { l: 'S', Mundo: MundoCiencia, color: C.azul, rot: -5 },
  { l: 'T', Mundo: MundoTecnologia, color: C.blanco, rot: 4 },
  { l: 'E', Mundo: MundoIngenieria, color: C.blanco, rot: -3 },
  { l: 'M', Mundo: MundoMatematicas, color: C.azul, rot: 5 },
];

// el SVG está recortado a su contenido (viewBox 732×607)
const LOGO = { w: 700, h: (700 * 607) / 732 };

export const V8Cierre: React.FC = () => {
  const f = useCurrentFrame();
  const logo = rampa(f, 2, 22, salida);
  const tags = rampa(f, 7, 18, salida); // hashtags legibles ≈ 57,5–59,7 s
  const linea = rampa(f, 5, 20, salida);
  const fuera = 1 - rampa(f, 81, 89);
  return (
    <AbsoluteFill style={{ background: C.fondoA }}>
      <AbsoluteFill style={{ background: '#F2F4FA', opacity: fuera }}>
        <Trama color="rgba(36,58,117,0.2)" paso={24} radio={5} style={{ left: 0, top: 0, width: 1080, height: 760 }} mascara="radial-gradient(70% 60% at 0% 0%, #000 0%, transparent 80%)" />
        <Trama color="rgba(255,90,95,0.25)" paso={20} radio={4} style={{ right: 0, bottom: 0, width: 760, height: 700 }} mascara="radial-gradient(80% 70% at 100% 100%, #000 0%, transparent 80%)" />
        <Papel opacidad={0.6} />
        <Camara dur={90} deriva={[1.04, 1]} origen="50% 50%">
          <div style={{ position: 'absolute', left: 0, right: 0, top: 390, display: 'flex', justifyContent: 'center', gap: 22 }}>
            {FIRMA.map((o, i) => {
              const sp = rampa(f, i * 3, 16 + i * 3, salida);
              const { Mundo } = o;
              return (
                <div key={o.l} style={{ position: 'relative', width: 150, height: 150, overflow: 'hidden', border: `5px solid ${C.azul}`, boxSizing: 'border-box', rotate: `${o.rot + Math.sin((f + i * 9) / 12) * 2.5}deg`, translate: `0px ${Math.sin((f + i * 13) / 11) * 6}px`, scale: String(0.6 + 0.4 * sp), opacity: sp, boxShadow: SOMBRA_SUAVE }}>
                  <Mundo ancho={150} alto={150} desfase={i * 20} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 108, lineHeight: 0.8, color: o.color, paddingBottom: 8 }}>{o.l}</div>
                </div>
              );
            })}
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 630, textAlign: 'center' }}>
            <Img src={staticFile('logo_mescyt_vertical.svg')} style={{ width: LOGO.w, height: LOGO.h, opacity: logo, scale: String(mezcla(0.92, 1, logo)) }} />
            <div style={{ margin: '44px auto 0', width: 110 * linea, height: 8, background: C.rojo }} />
            <div style={{ marginTop: 40, fontWeight: 700, fontSize: 56, lineHeight: 1.25, color: C.azul, opacity: tags, translate: `0px ${(1 - tags) * 24}px` }}>
              #CarrerasSTEM
              <br />
              <span style={{ color: C.rojo }}>#ExploraSTEMRD</span> #MESCyT
            </div>
          </div>
        </Camara>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
