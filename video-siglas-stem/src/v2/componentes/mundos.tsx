// Un «mundo» visual por área. Cada uno llena a su contenedor (sirve a pantalla completa o en una franja).
import { useCurrentFrame } from 'remotion';
import { C, rampa } from '../../marca';
import { Papel, Trama } from './collage';

type M = { ancho?: number; alto?: number; desfase?: number };

const lleno = { position: 'absolute', inset: 0, overflow: 'hidden' } as const;

// ───────── Ciencia: papel claro, trama azul y una doble hélice que gira ─────────
export const MundoCiencia: React.FC<M & { helice?: boolean }> = ({ ancho = 1080, alto = 1920, desfase = 0, helice = true }) => {
  const f = useCurrentFrame() + desfase;
  const cx = ancho * 0.8;
  const A = Math.min(110, ancho * 0.3);
  const fase = f * 0.09;
  const pasos = Math.ceil(alto / 10);
  const curva = (off: number) =>
    Array.from({ length: pasos + 1 }, (_, i) => {
      const y = i * 10;
      return `${i ? 'L' : 'M'} ${cx + A * Math.sin(y * 0.011 + fase + off)} ${y}`;
    }).join(' ');
  return (
    <div style={{ ...lleno, background: '#F2F4FA' }}>
      <Trama color="rgba(36,58,117,0.22)" paso={24} radio={5} style={{ left: 0, top: 0, width: ancho, height: alto * 0.45 }} mascara="radial-gradient(70% 60% at 0% 0%, #000 0%, transparent 80%)" />
      <Trama color="rgba(255,90,95,0.25)" paso={20} radio={4} style={{ right: 0, bottom: 0, width: ancho * 0.7, height: alto * 0.35 }} mascara="radial-gradient(80% 70% at 100% 100%, #000 0%, transparent 80%)" />
      {helice && (
        <svg width={ancho} height={alto} style={{ position: 'absolute', left: 0, top: 0, opacity: 0.9 }}>
          {Array.from({ length: Math.ceil(alto / 46) }, (_, i) => {
            const y = i * 46 + 20;
            const a = Math.sin(y * 0.011 + fase);
            return <line key={i} x1={cx + A * a} y1={y} x2={cx - A * a} y2={y} stroke={C.azul} strokeOpacity={0.12 + 0.18 * Math.abs(Math.cos(y * 0.011 + fase))} strokeWidth={6} strokeLinecap="round" />;
          })}
          <path d={curva(0)} fill="none" stroke={C.azul} strokeOpacity={0.35} strokeWidth={9} />
          <path d={curva(Math.PI)} fill="none" stroke={C.acento} strokeOpacity={0.45} strokeWidth={9} />
        </svg>
      )}
      <Papel opacidad={0.6} />
    </div>
  );
};

// ───────── Tecnología: azul, lluvia de código y pistas de circuito ─────────
const CODIGO = [
  'if (curiosidad) {',
  '  crear();',
  '}',
  '0101 1100',
  'for (i = 0; i < 4; i++)',
  'aprender(STEM);',
  '</>',
  'const futuro = true;',
  'robot.mover();',
  '1010 0110',
  'return idea;',
  '{ }',
  'print("hola")',
  'while (true) explorar();',
];

export const MundoTecnologia: React.FC<M> = ({ ancho = 1080, alto = 1920, desfase = 0 }) => {
  const f = useCurrentFrame() + desfase;
  const cols = Math.max(2, Math.round(ancho / 270));
  const lineH = 52;
  const n = Math.ceil(alto / lineH) + 2;
  return (
    <div style={{ ...lleno, background: `linear-gradient(180deg, ${C.fondoA} 0%, ${C.fondoB} 100%)` }}>
      {Array.from({ length: cols }, (_, c) => {
        const vel = 1.6 + (c % 3) * 0.9;
        const y = -((f * vel + c * 137) % (n * lineH));
        return (
          <div key={c} style={{ position: 'absolute', left: (c * ancho) / cols + 14, top: 0, translate: `0px ${y}px`, fontFamily: 'DejaVu Sans Mono, monospace', fontSize: 26, lineHeight: `${lineH}px`, whiteSpace: 'pre' }}>
            {Array.from({ length: n * 2 }, (_, i) => {
              const t = CODIGO[(i * 5 + c * 3) % CODIGO.length];
              const brillo = (i + c) % 7 === 0;
              return (
                <div key={i} style={{ color: brillo ? 'rgba(127,227,255,0.75)' : 'rgba(127,227,255,0.22)' }}>
                  {t}
                </div>
              );
            })}
          </div>
        );
      })}
      <svg width={ancho} height={alto} style={{ position: 'absolute', inset: 0 }}>
        {[0.18, 0.46, 0.74].map((k, i) => {
          const x = ancho * k;
          const p = rampa(f, 4 + i * 6, 40 + i * 6);
          const d = `M ${x} ${alto} L ${x} ${alto * 0.72} L ${x + 60} ${alto * 0.66} L ${x + 60} ${alto * 0.5} L ${x + 10} ${alto * 0.44} L ${x + 10} ${alto * 0.2}`;
          return (
            <g key={i} opacity={0.55}>
              <path d={d} fill="none" stroke={C.cian} strokeWidth={4} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
              <circle cx={x + 10} cy={alto * 0.2} r={10 * p} fill={C.cian} />
            </g>
          );
        })}
      </svg>
      <Papel opacidad={0.35} modo="soft-light" />
    </div>
  );
};

// ───────── Ingeniería: plano técnico (blueprint) con engranajes ─────────
const engranaje = (r: number, dientes: number) => {
  const pts: string[] = [];
  for (let i = 0; i < dientes * 4; i++) {
    const a = (i / (dientes * 4)) * Math.PI * 2;
    const rr = i % 4 < 2 ? r : r * 0.82;
    pts.push(`${(Math.cos(a) * rr).toFixed(1)},${(Math.sin(a) * rr).toFixed(1)}`);
  }
  return `M ${pts.join(' L ')} Z`;
};

export const Engranaje: React.FC<{ x: number; y: number; r: number; dientes?: number; giro: number; color?: string; grosor?: number }> = ({ x, y, r, dientes = 12, giro, color = 'rgba(255,255,255,0.75)', grosor = 5 }) => (
  <g transform={`translate(${x} ${y}) rotate(${giro})`}>
    <path d={engranaje(r, dientes)} fill="none" stroke={color} strokeWidth={grosor} strokeLinejoin="round" />
    <circle r={r * 0.38} fill="none" stroke={color} strokeWidth={grosor} />
    <circle r={r * 0.1} fill={color} />
  </g>
);

export const MundoIngenieria: React.FC<M & { engranajes?: boolean }> = ({ ancho = 1080, alto = 1920, desfase = 0, engranajes = true }) => {
  const f = useCurrentFrame() + desfase;
  const grid = (paso: number, a: number) =>
    `repeating-linear-gradient(0deg, rgba(255,255,255,${a}) 0 2px, transparent 2px ${paso}px), repeating-linear-gradient(90deg, rgba(255,255,255,${a}) 0 2px, transparent 2px ${paso}px)`;
  return (
    <div style={{ ...lleno, background: '#1F4596' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `${grid(200, 0.2)}, ${grid(40, 0.08)}` }} />
      {engranajes && (
        <svg width={ancho} height={alto} style={{ position: 'absolute', inset: 0 }}>
          <Engranaje x={ancho - 120} y={190} r={110} giro={f * 1.6} />
          <Engranaje x={ancho - 262} y={290} r={64} dientes={8} giro={-f * 2.75 + 12} />
          <Engranaje x={90} y={alto - 150} r={90} dientes={10} giro={-f * 1.2} color="rgba(255,90,95,0.8)" />
        </svg>
      )}
      <Papel opacidad={0.3} modo="soft-light" />
    </div>
  );
};

// ───────── Matemáticas: papel cuadriculado, ejes, una función que se traza y símbolos flotando ─────────
const SIMBOLOS = ['π', '√', '∑', '∞', 'x²', '÷', '=', '+', '%', '∫'];

export const MundoMatematicas: React.FC<M & { curva?: boolean; simbolos?: boolean }> = ({ ancho = 1080, alto = 1920, desfase = 0, curva = true, simbolos = true }) => {
  const f = useCurrentFrame() + desfase;
  const grid = (paso: number, a: number) =>
    `repeating-linear-gradient(0deg, rgba(36,58,117,${a}) 0 2px, transparent 2px ${paso}px), repeating-linear-gradient(90deg, rgba(36,58,117,${a}) 0 2px, transparent 2px ${paso}px)`;
  const ejeY = alto * 0.3;
  const p = rampa(f, 2, 70);
  const pts = Array.from({ length: 61 }, (_, i) => {
    const x = (i / 60) * ancho;
    const y = ejeY - Math.sin((i / 60) * Math.PI * 3 + 0.4) * 120 * (0.6 + 0.4 * Math.cos(i / 25));
    return `${i ? 'L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
  return (
    <div style={{ ...lleno, background: '#F7F8FC' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `${grid(180, 0.16)}, ${grid(36, 0.07)}` }} />
      {curva && (
        <svg width={ancho} height={alto} style={{ position: 'absolute', inset: 0 }}>
          <line x1={0} y1={ejeY} x2={ancho} y2={ejeY} stroke={C.azul} strokeOpacity={0.5} strokeWidth={4} />
          <line x1={ancho * 0.12} y1={0} x2={ancho * 0.12} y2={alto} stroke={C.azul} strokeOpacity={0.5} strokeWidth={4} />
          <path d={pts} fill="none" stroke={C.acento} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
        </svg>
      )}
      {simbolos &&
        SIMBOLOS.map((s, i) => {
          const x = ((i * 0.37 + 0.07) % 1) * ancho;
          const y = ((i * 0.53 + 0.18) % 1) * alto;
          return (
            <div
              key={s}
              style={{
                position: 'absolute',
                left: x,
                top: y + Math.sin((f + i * 20) / 18) * 16,
                fontWeight: 900,
                fontSize: 70 + (i % 3) * 22,
                color: i % 2 ? C.acento : C.azul,
                opacity: 0.22,
                rotate: `${Math.sin((f + i * 30) / 30) * 12}deg`,
              }}
            >
              {s}
            </div>
          );
        })}
      <Papel opacidad={0.55} />
    </div>
  );
};

export const MUNDOS = [MundoCiencia, MundoTecnologia, MundoIngenieria, MundoMatematicas];
