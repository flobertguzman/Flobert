import { Escena, Linea, Persona, TarjetaCarrera } from '../componentes/base';
import { C, X } from '../../marca';
import { palabraEn } from '../../tiempos';

// 35–42 s · «Algunos ejemplos de carreras STEM: biología, informática, ingeniería civil y estadística.»
const EJEMPLOS = [
  { area: 'CIENCIA', carrera: 'Biología', palabra: 'biología' },
  { area: 'TECNOLOGÍA', carrera: 'Informática', palabra: 'informática' },
  { area: 'INGENIERÍA', carrera: 'Ingeniería civil', palabra: 'ingeniería' },
  { area: 'MATEMÁTICAS', carrera: 'Estadística', palabra: 'estadística' },
];

export const A5Ejemplos: React.FC<{ dur: number; inicio: number }> = ({ dur, inicio }) => (
  <Escena dur={dur} inicio={inicio} entrada="fundido" salida="fundido">
    <div style={{ position: 'absolute', left: X, top: 262, width: 960 }}>
      <Linea entra={8} style={{ fontWeight: 700, fontSize: 58, lineHeight: 1.05, color: C.suave }}>
        Algunos ejemplos de
      </Linea>
      <Linea entra={16} style={{ fontWeight: 900, fontSize: 112, lineHeight: 1.02, letterSpacing: -3.5 }}>
        carreras <span style={{ color: C.acento }}>STEM</span>
      </Linea>
    </div>
    {EJEMPLOS.map((e, i) => (
      <TarjetaCarrera key={e.carrera} area={e.area} carrera={e.carrera} entra={palabraEn('ejemplos', e.palabra) - 5} style={{ position: 'absolute', left: X, top: 540 + i * 150, width: 470 }} />
    ))}
    <Persona cual="elias" ancho={560} left={500} top={880} entra={20} />
  </Escena>
);
