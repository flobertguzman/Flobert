import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Camara, Papel, Sello, Sticker, Titular, Trama } from '../componentes/collage';
import { C, X, rampa, salida } from '../marca';
import { palabraEn } from '../tiempos';

// 28,2–35 s · «Estudian cómo funciona el mundo y nos ayudan a investigar, crear herramientas y resolver problemas.»
// Tres sellos con su icono dibujado a mano, cada uno cuando se dice; Camila con las gafas de realidad virtual.
const ICONOS: Record<string, string> = {
  lupa: 'M 30 30 m -18 0 a 18 18 0 1 0 36 0 a 18 18 0 1 0 -36 0 M 43 43 L 60 60',
  herramienta: 'M 14 58 L 38 34 M 38 34 C 32 22, 40 8, 54 10 L 46 18 L 48 26 L 56 28 L 64 20 C 66 34, 52 40, 42 36',
  idea: 'M 36 8 C 22 8, 14 18, 14 28 C 14 38, 22 42, 26 50 L 46 50 C 50 42, 58 38, 58 28 C 58 18, 50 8, 36 8 Z M 28 58 L 44 58 M 30 66 L 42 66',
};
const ACCIONES = [
  { texto: 'INVESTIGAR', icono: 'lupa', palabra: 'investigar', fondo: C.azul, color: C.blanco, rot: -3 },
  { texto: 'CREAR HERRAMIENTAS', icono: 'herramienta', palabra: 'herramientas', fondo: C.blanco, color: C.azul, rot: 2 },
  { texto: 'RESOLVER PROBLEMAS', icono: 'idea', palabra: 'problemas', fondo: C.fondoB, color: C.blanco, rot: -2 },
];

export const V3Mundo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.acento }}>
      <Trama color="rgba(36,58,117,0.28)" paso={24} radio={5} style={{ right: 0, bottom: 0, width: 1080, height: 1100 }} mascara="radial-gradient(80% 70% at 100% 100%, #000 0%, transparent 75%)" />
      <Papel opacidad={0.35} modo="soft-light" />
      <Camara dur={204}>
        <div style={{ position: 'absolute', left: X, top: 220, width: 960 }}>
          <Titular entra={6} style={{ fontWeight: 900, fontSize: 76, lineHeight: 1.1, letterSpacing: -1.5 }}>
            CUATRO ÁREAS PARA
          </Titular>
          <Titular entra={14} style={{ fontWeight: 900, fontSize: 124, lineHeight: 1, letterSpacing: -4, color: C.fondoB }}>
            ENTENDER
          </Titular>
          <Titular entra={20} style={{ fontWeight: 900, fontSize: 124, lineHeight: 1, letterSpacing: -4, color: C.blanco }}>
            EL MUNDO
          </Titular>
        </div>
        {ACCIONES.map((a, i) => {
          const entra = palabraEn('mundo', a.palabra) - 6;
          const dibujo = rampa(f, entra + 6, entra + 26, salida);
          return (
            <Sello
              key={a.texto}
              entra={entra}
              fondo={a.fondo}
              color={a.color}
              left={X}
              top={630 + i * 150}
              rot={a.rot}
              tam={66}
              texto={
                <span style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
                  <svg width={66} height={66} viewBox="0 0 72 72">
                    <path d={ICONOS[a.icono]} fill="none" stroke={a.fondo === C.blanco ? C.acento : C.blanco} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - dibujo} />
                  </svg>
                  {a.texto}
                </span>
              }
            />
          );
        })}
        <Sticker cual="camila" ancho={640} left={430} top={1010} rot={-2} entra={20} desde="derecha" />
      </Camara>
    </AbsoluteFill>
  );
};
