import { Img, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { ANCHO, C, mezcla, rampa, salida } from '../marca';

// Cierre MESCyT: logo oficial, hashtags e «Imagen creada con IA». Fade a azul al final.
export const E6Cierre: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame: f, fps, config: { damping: 14, stiffness: 140, mass: 0.7 } });
  const tags = rampa(f, 6, 16); // hashtags legibles ≈ 27,5–29,8 s (más de 2 s)
  const ia = rampa(f, 10, 20);
  const linea = rampa(f, 4, 18);
  const fuera = 1 - rampa(f, 81, 89);
  const logoW = 780;
  const esc = ANCHO / 1500;
  const sy = 0.8;
  const mascara = 'linear-gradient(180deg, transparent 0%, #000 22%, #000 78%, transparent 100%)';
  const banda = rampa(f, 0, 26, salida);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: fuera }}>
      <div style={{ position: 'absolute', left: mezcla(-60, 0, banda), top: 1290 - 925 * esc * sy, width: ANCHO, height: 1862 * esc * sy, opacity: 0.9 * banda, maskImage: mascara, WebkitMaskImage: mascara }}>
        <Img src={staticFile('car/banda_b.png')} style={{ width: ANCHO, height: 1862 * esc * sy, display: 'block' }} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 470, textAlign: 'center' }}>
        <Img
          src={staticFile('logo_mescyt_h_blanco.png')}
          style={{ width: logoW, height: (logoW * 398) / 1600, opacity: logo, transform: `scale(${mezcla(0.9, 1, logo)})` }}
        />
        <div style={{ margin: '44px auto 0', width: 90 * linea, height: 6, borderRadius: 3, background: C.acento }} />
        <div style={{ marginTop: 40, fontWeight: 700, fontSize: 44, letterSpacing: 0.5, opacity: tags, transform: `translateY(${(1 - tags) * 24}px)` }}>
          <span style={{ color: C.blanco }}>#CarrerasSTEM</span>
          <br />
          <span style={{ color: C.acento }}>#ExploraSTEMRD</span> <span style={{ color: C.blanco }}>#MESCyT</span>
        </div>
        <div style={{ marginTop: 34, fontWeight: 400, fontSize: 28, color: C.tenue, opacity: ia }}>Imagen creada con IA</div>
      </div>
    </div>
  );
};
