import { Img, staticFile } from 'remotion';
import { Escena, Sube, useF } from '../componentes/base';
import { C, mezcla, rampa, salida } from '../marca';

// 57–60 s · Cierre MESCyT: logo oficial, hashtags (legibles más de 2 s) e «Imagen creada con IA». Fundido a azul.
export const A9Cierre: React.FC<{ dur: number; inicio: number }> = ({ dur, inicio }) => {
  const f = useF();
  const logo = rampa(f, 2, 24, salida);
  const fuera = 1 - rampa(f, 78, 90);
  return (
    <Escena dur={dur} inicio={inicio} entrada="fundido" salida="nada">
      <div style={{ position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', opacity: fuera }}>
        <Img src={staticFile('logo_mescyt_h_blanco.png')} style={{ width: 860, height: (860 * 398) / 1600, opacity: logo, scale: String(mezcla(0.94, 1, logo)) }} />
        <div style={{ margin: '42px auto 0', width: 110 * rampa(f, 8, 26, salida), height: 7, borderRadius: 4, background: C.acento }} />
        <Sube entra={10} dist={24} style={{ marginTop: 40, fontWeight: 700, fontSize: 50, lineHeight: 1.3 }}>
          #CarrerasSTEM
          <br />
          <span style={{ color: C.acento }}>#ExploraSTEMRD</span> #MESCyT
        </Sube>
        <Sube entra={16} dist={16} style={{ marginTop: 32, fontWeight: 400, fontSize: 30, color: C.tenue }}>
          Imagen creada con IA
        </Sube>
      </div>
    </Escena>
  );
};
