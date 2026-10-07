import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { Camara, Papel, SOMBRA_SUAVE, Trama } from '../componentes/collage';
import { MundoCiencia, MundoIngenieria, MundoMatematicas, MundoTecnologia } from '../componentes/mundos';
import { C, mezcla, rampa, salida } from '../marca';

// 57–60 s · Cierre MESCyT: las cuatro áreas como firma, logo oficial, hashtags e «Imagen creada con IA». Fundido a azul.
const FIRMA = [
  { l: 'S', Mundo: MundoCiencia, color: C.azul, rot: -5 },
  { l: 'T', Mundo: MundoTecnologia, color: C.blanco, rot: 4 },
  { l: 'E', Mundo: MundoIngenieria, color: C.blanco, rot: -3 },
  { l: 'M', Mundo: MundoMatematicas, color: C.azul, rot: 5 },
];

export const V8Cierre: React.FC = () => {
  const f = useCurrentFrame();
  const logo = rampa(f, 2, 22, salida);
  const tags = rampa(f, 7, 18, salida); // hashtags legibles ≈ 57,5–59,7 s
  const ia = rampa(f, 11, 22, salida);
  const linea = rampa(f, 5, 20, salida);
  const fuera = 1 - rampa(f, 81, 89);
  return (
    <AbsoluteFill style={{ background: C.fondoA }}>
      <Trama color="rgba(255,255,255,0.1)" paso={26} radio={5} style={{ inset: 0 }} mascara="radial-gradient(70% 45% at 50% 50%, transparent 30%, #000 100%)" />
      <Papel opacidad={0.35} modo="soft-light" />
      <Camara dur={90} deriva={[1.04, 1]} origen="50% 50%">
        <div style={{ position: 'absolute', inset: 0, opacity: fuera }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 430, display: 'flex', justifyContent: 'center', gap: 22 }}>
            {FIRMA.map((o, i) => {
              const sp = rampa(f, i * 3, 16 + i * 3, salida);
              const { Mundo } = o;
              return (
                <div key={o.l} style={{ position: 'relative', width: 150, height: 150, overflow: 'hidden', border: '5px solid #fff', boxSizing: 'border-box', rotate: `${o.rot + Math.sin((f + i * 9) / 12) * 2.5}deg`, translate: `0px ${Math.sin((f + i * 13) / 11) * 6}px`, scale: String(0.6 + 0.4 * sp), opacity: sp, boxShadow: SOMBRA_SUAVE }}>
                  <Mundo ancho={150} alto={150} desfase={i * 20} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 108, lineHeight: 0.8, color: o.color, paddingBottom: 8 }}>{o.l}</div>
                </div>
              );
            })}
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 720, textAlign: 'center' }}>
            <Img src={staticFile('logo_mescyt_h_blanco.png')} style={{ width: 900, height: (900 * 398) / 1600, opacity: logo, scale: String(mezcla(0.92, 1, logo)) }} />
            <div style={{ margin: '40px auto 0', width: 110 * linea, height: 8, background: C.acento }} />
            <div style={{ marginTop: 40, fontWeight: 700, fontSize: 52, lineHeight: 1.25, opacity: tags, translate: `0px ${(1 - tags) * 24}px` }}>
              #CarrerasSTEM
              <br />
              <span style={{ color: C.acento }}>#ExploraSTEMRD</span> #MESCyT
            </div>
            <div style={{ marginTop: 34, fontWeight: 400, fontSize: 30, color: C.tenue, opacity: ia }}>Imagen creada con IA</div>
          </div>
        </div>
      </Camara>
    </AbsoluteFill>
  );
};
