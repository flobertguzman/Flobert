import { spring, useVideoConfig } from 'remotion';
import { C, rampa } from '../marca';

/**
 * Robot ilustrado y animado (SVG). Se arma por partes, una por cada suma de la escena:
 * cabeza = programación · cuerpo = ingeniería · pecho con π = matemáticas.
 * Entradas: fotograma en que llega cada parte y fotograma en que «cobra vida».
 */
type P = {
  f: number; // fotograma local
  cabeza: number;
  cuerpo: number;
  pecho: number;
  vivo: number;
  ancho?: number;
  revelado?: number; // 0–1: el plano punteado se dibuja de arriba abajo
  linea?: string; // contorno de cabeza y cuerpo (contraste sobre fondos claros)
};

const resorte = { damping: 11, stiffness: 170, mass: 0.8 };

export const Robot: React.FC<P> = ({ f, cabeza, cuerpo, pecho, vivo, ancho = 470, revelado = 1, linea = 'rgba(36,58,117,0.28)' }) => {
  const { fps } = useVideoConfig();
  const sCab = spring({ frame: f - cabeza, fps, config: resorte });
  const sCue = spring({ frame: f - cuerpo, fps, config: resorte });
  const sPec = spring({ frame: f - pecho, fps, config: { damping: 9, stiffness: 200, mass: 0.7 } });
  const hay = (inicio: number) => (f >= inicio ? 1 : 0);
  const vida = rampa(f, vivo, vivo + 10);
  const t = Math.max(0, f - vivo);
  const parpadeo = vida > 0 && t % 70 > 64 ? 0.12 : 1;
  const saludo = vida * (0.5 + 0.5 * Math.sin(t / 4.2)) * 14; // 0–14° hacia fuera
  const flota = vida * Math.sin(t / 14) * 7;
  const pulso = 0.6 + 0.4 * Math.sin(f / 5);
  const fantasma = 0.85 * (1 - Math.min(1, (hay(cabeza) + hay(cuerpo) + hay(pecho)) / 3));

  const trazo = { fill: 'none', stroke: 'rgba(255,255,255,0.8)', strokeWidth: 4.5, strokeDasharray: '12 9' } as const;

  return (
    <svg width={ancho} height={(ancho * 640) / 440} viewBox="0 0 440 640" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="r-blanco" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#C9D9FF" />
        </linearGradient>
        <linearGradient id="r-metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A9BDF0" />
          <stop offset="1" stopColor="#6F8AD0" />
        </linearGradient>
        <clipPath id="r-revelado">
          <rect x="-50" y="-50" width="540" height={50 + 700 * revelado} />
        </clipPath>
        <filter id="r-brillo" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      <ellipse cx="220" cy="618" rx={130 + flota * 2} ry="15" fill="rgba(2,8,40,0.4)" />

      <g transform={`translate(0, ${-flota})`}>
        {/* silueta de plano que se llena al sumar las áreas */}
        <g opacity={fantasma} clipPath="url(#r-revelado)">
          <rect x="70" y="95" width="300" height="195" rx="64" {...trazo} />
          <rect x="105" y="300" width="230" height="230" rx="60" {...trazo} />
          <rect x="48" y="318" width="50" height="170" rx="25" {...trazo} />
          <rect x="342" y="318" width="50" height="170" rx="25" {...trazo} />
          <rect x="150" y="520" width="52" height="80" rx="16" {...trazo} />
          <rect x="238" y="520" width="52" height="80" rx="16" {...trazo} />
        </g>

        {/* ingeniería: cuerpo, brazos y piernas */}
        <g opacity={hay(cuerpo)} transform={`translate(0, ${(1 - sCue) * 150}) `}>
          <rect x="150" y="520" width="52" height="82" rx="16" fill="url(#r-metal)" />
          <rect x="238" y="520" width="52" height="82" rx="16" fill="url(#r-metal)" />
          <rect x="132" y="580" width="88" height="30" rx="15" fill="#E7EEFF" />
          <rect x="220" y="580" width="88" height="30" rx="15" fill="#E7EEFF" />
          <g transform="rotate(7 73 330)">
            <rect x="48" y="318" width="50" height="172" rx="25" fill="url(#r-blanco)" />
            <circle cx="73" cy="494" r="27" fill="url(#r-metal)" />
          </g>
          <g transform={`rotate(${-6 - saludo} 367 336)`}>
            <rect x="342" y="318" width="50" height="172" rx="25" fill="url(#r-blanco)" />
            <circle cx="367" cy="494" r="27" fill="url(#r-metal)" />
          </g>
          <rect x="105" y="300" width="230" height="230" rx="60" fill="url(#r-blanco)" />
          <rect x="105" y="468" width="230" height="26" fill={C.acento} />
          <rect x="105" y="300" width="230" height="230" rx="60" fill="none" stroke={linea} strokeWidth="4" />
          <g transform={`rotate(${t * 3.2} 220 481)`}>
            <circle cx="220" cy="481" r="27" fill="none" stroke={C.azul} strokeWidth="13" strokeDasharray="9.6 9.6" />
            <circle cx="220" cy="481" r="19" fill={C.azul} />
            <circle cx="220" cy="481" r="7" fill="#fff" />
          </g>
        </g>

        {/* matemáticas: panel del pecho con π */}
        <g opacity={hay(pecho)} transform={`translate(220 372) scale(${sPec}) translate(-220 -372)`}>
          <rect x="145" y="326" width="150" height="104" rx="26" fill={C.fondoB} />
          <rect x="145" y="326" width="150" height="104" rx="26" fill="none" stroke={C.cian} strokeOpacity={0.55} strokeWidth="3" />
          <text x="220" y="402" textAnchor="middle" fontFamily="Hurme, sans-serif" fontWeight={900} fontSize="74" fill={C.cian}>π</text>
        </g>

        {/* programación: cabeza con pantalla */}
        <g opacity={hay(cabeza)} transform={`translate(0, ${(1 - sCab) * -190})`}>
          <rect x="195" y="282" width="50" height="30" rx="10" fill="url(#r-metal)" />
          <line x1="220" y1="98" x2="220" y2="48" stroke="#A9BDF0" strokeWidth="9" strokeLinecap="round" />
          <circle cx="220" cy="34" r={26 * (0.8 + 0.2 * pulso)} fill={C.acento} opacity={0.5 * vida} filter="url(#r-brillo)" />
          <circle cx="220" cy="34" r="16" fill={C.acento} />
          <rect x="48" y="165" width="30" height="76" rx="15" fill={C.acento} />
          <rect x="362" y="165" width="30" height="76" rx="15" fill={C.acento} />
          <rect x="70" y="95" width="300" height="195" rx="64" fill="url(#r-blanco)" />
          <rect x="70" y="95" width="300" height="195" rx="64" fill="none" stroke={linea} strokeWidth="4" />
          <rect x="100" y="124" width="240" height="138" rx="44" fill={C.fondoB} />
          <text x="220" y="156" textAnchor="middle" fontFamily="Hurme, sans-serif" fontWeight={700} fontSize="21" fill={C.cian} opacity={0.75 - 0.25 * vida}>{'</>'}</text>
          <g opacity={0.2 + 0.8 * vida} style={{ transformOrigin: '220px 198px' }} transform={`translate(0 ${198 * (1 - parpadeo)}) scale(1 ${parpadeo})`}>
            <rect x="148" y="170" width="44" height="58" rx="22" fill={C.cian} />
            <rect x="248" y="170" width="44" height="58" rx="22" fill={C.cian} />
          </g>
          <path d="M 190 240 Q 220 258 250 240" fill="none" stroke={C.cian} strokeWidth="6" strokeLinecap="round" opacity={0.2 + 0.8 * vida} />
        </g>

        {/* chispas al cobrar vida */}
        {[
          [30, 120, 0],
          [410, 90, 6],
          [20, 430, 10],
          [425, 400, 3],
        ].map(([x, y, d], i) => {
          const k = rampa(t - d, 0, 10) * (1 - rampa(t - d, 18, 34));
          return vida > 0 ? (
            <g key={i} transform={`translate(${x} ${y}) scale(${k * 1.2}) rotate(${t * 4})`}>
              <path d="M 0 -20 L 5 -5 L 20 0 L 5 5 L 0 20 L -5 5 L -20 0 L -5 -5 Z" fill={i % 2 ? C.fondoB : '#fff'} /> {/* sobre el fondo rojo: blanco y azul marino (el cian se perdía) */}
            </g>
          ) : null;
        })}
      </g>
    </svg>
  );
};
