import { useCurrentFrame } from 'remotion';
import { Camara, Cinta, FotoCinta, LetraGigante, Sello, Sticker, Tag, Trazo } from '../componentes/collage';
import { MundoCiencia, MundoIngenieria, MundoMatematicas, MundoTecnologia } from '../componentes/mundos';
import { C, rampa, salida } from '../marca';
import { AREAS, palabraEn } from '../tiempos';

/**
 * Una letra cada 4,3 s, cada una en su propio «mundo» de collage:
 * la inicial golpea → la palabra en inglés cruza en una cinta → la palabra en español cae como un sello.
 * Los tiempos salen de la locución (palabraEn). Después del sello aparecen ejemplos de carreras del brief.
 */
type Config = {
  letra: string;
  ingles: string;
  espanol: string;
  Mundo: React.FC;
  letraColor: string;
  letraTrama: string;
  letraPos: { left: number; top: number; tam: number };
  foto?: { src: string; left: number; top: number; ancho: number; rot: number };
  sticker?: { cual: 'camila' | 'elias'; ancho: number; left: number; top: number; rot: number };
  cinta: { fondo: string; color: string; estrella: string; top: number; rot: number; sentido: 1 | -1 };
  sello: { fondo: string; color: string; left: number; top: number; rot: number; tam: number };
  tagEn: { left: number; top: number; fondo: string; color: string; borde?: string };
  tagEs: { left: number; top: number; fondo: string; color: string; borde?: string };
  chispa: string; // color de las chispas: distinto del sello y del fondo
  chips: [string, string][]; // pares fondo/texto que se alternan (contrastan con el fondo de la escena y con el sello)
  flecha?: boolean;
  entradaCentrada?: boolean; // la S llega por corte de continuidad desde la apertura
};

export const LETRAS: Config[] = [
  {
    letra: 'S',
    ingles: 'SCIENCE',
    espanol: 'Ciencia',
    Mundo: () => <MundoCiencia />,
    letraColor: C.azul,
    letraTrama: 'rgba(255,255,255,0.16)',
    letraPos: { left: -10, top: 150, tam: 1000 },
    foto: { src: 'fotos/ciencia.jpg', left: 610, top: 200, ancho: 340, rot: 7 },
    cinta: { fondo: C.acento, color: C.blanco, estrella: C.azul, top: 800, rot: -7, sentido: 1 },
    sello: { fondo: C.azul, color: C.blanco, left: 64, top: 1200, rot: -3, tam: 168 },
    tagEn: { left: 64, top: 880, fondo: C.fondoB, color: C.blanco },
    tagEs: { left: 84, top: 1156, fondo: C.acento, color: C.blanco },
    chispa: C.acento,
    chips: [[C.acento, C.blanco], [C.azul, C.blanco]],
    flecha: true,
    entradaCentrada: true,
  },
  {
    letra: 'T',
    ingles: 'TECHNOLOGY',
    espanol: 'Tecnología',
    Mundo: () => <MundoTecnologia />,
    letraColor: C.blanco,
    letraTrama: 'rgba(36,58,117,0.22)',
    letraPos: { left: -40, top: 780, tam: 900 },
    sticker: { cual: 'camila', ancho: 760, left: 330, top: 700, rot: -3 },
    cinta: { fondo: C.blanco, color: C.azul, estrella: C.acento, top: 205, rot: 6, sentido: -1 },
    sello: { fondo: C.acento, color: C.blanco, left: 44, top: 566, rot: -4, tam: 148 },
    tagEn: { left: 64, top: 160, fondo: C.acento, color: C.blanco, borde: C.blanco },
    tagEs: { left: 64, top: 522, fondo: C.blanco, color: C.azul },
    chispa: C.blanco,
    chips: [[C.blanco, C.azul], [C.acento, C.blanco]],
  },
  {
    letra: 'E',
    ingles: 'ENGINEERING',
    espanol: 'Ingeniería',
    Mundo: () => <MundoIngenieria />,
    letraColor: C.blanco,
    letraTrama: 'rgba(36,58,117,0.25)',
    letraPos: { left: -10, top: 150, tam: 1000 },
    foto: { src: 'fotos/ingenieria.jpg', left: 600, top: 220, ancho: 340, rot: -6 },
    cinta: { fondo: C.acento, color: C.blanco, estrella: C.blanco, top: 875, rot: 6, sentido: -1 },
    sello: { fondo: C.blanco, color: C.azul, left: 64, top: 1200, rot: -3, tam: 160 },
    tagEn: { left: 64, top: 850, fondo: C.blanco, color: C.azul },
    tagEs: { left: 84, top: 1156, fondo: C.acento, color: C.blanco, borde: C.blanco },
    chispa: C.acento,
    chips: [[C.acento, C.blanco], [C.blanco, C.azul]],
  },
  {
    letra: 'M',
    ingles: 'MATHEMATICS',
    espanol: 'Matemáticas',
    Mundo: () => <MundoMatematicas />,
    letraColor: C.azul,
    letraTrama: 'rgba(255,255,255,0.18)',
    letraPos: { left: -30, top: 800, tam: 820 },
    sticker: { cual: 'elias', ancho: 620, left: 450, top: 740, rot: 3 },
    cinta: { fondo: C.azul, color: C.blanco, estrella: C.acento, top: 225, rot: -6, sentido: 1 },
    sello: { fondo: C.acento, color: C.blanco, left: 44, top: 632, rot: -3, tam: 128 },
    tagEn: { left: 64, top: 214, fondo: C.fondoB, color: C.blanco },
    tagEs: { left: 64, top: 588, fondo: C.azul, color: C.blanco },
    chispa: C.azul,
    chips: [[C.azul, C.blanco], [C.acento, C.blanco]],
  },
];

const ESCENA = ['areaS', 'areaT', 'areaE', 'areaM'] as const;

export const V2Letra: React.FC<{ i: number }> = ({ i }) => {
  const f = useCurrentFrame();
  const c = LETRAS[i];
  const { Mundo } = c;
  const en = palabraEn(ESCENA[i], c.ingles);
  const es = palabraEn(ESCENA[i], c.espanol);

  // la inicial: llega con una curva suave (la S viene del zoom de la apertura, centrada y grande)
  const llega = rampa(f, 0, c.entradaCentrada ? 18 : 16, salida);
  const dx = c.entradaCentrada ? (1 - llega) * 250 : 0;
  const dy = c.entradaCentrada ? (1 - llega) * 410 : (1 - llega) * 60;
  const esc = c.entradaCentrada ? 1.2 - 0.2 * llega : 1.12 - 0.12 * llega;
  const chips = es + 40;

  return (
    <>
      <Mundo />
      <Camara dur={129}>
        <LetraGigante
          letra={c.letra}
          tam={c.letraPos.tam}
          color={c.letraColor}
          trama={c.letraTrama}
          left={c.letraPos.left}
          top={c.letraPos.top}
          style={{ translate: `${dx}px ${dy}px`, scale: String(esc), transformOrigin: '40% 55%', opacity: c.entradaCentrada ? 1 : llega }}
        />
        {c.foto && <FotoCinta src={c.foto.src} left={c.foto.left} top={c.foto.top} ancho={c.foto.ancho} rot={c.foto.rot} entra={8} />}
        {c.sticker && <Sticker cual={c.sticker.cual} ancho={c.sticker.ancho} left={c.sticker.left} top={c.sticker.top} rot={c.sticker.rot} entra={6} desde="abajo" />}

        <Cinta texto={c.ingles} fondo={c.cinta.fondo} color={c.cinta.color} estrella={c.cinta.estrella} top={c.cinta.top} rot={c.cinta.rot} entra={en - 6} sentido={c.cinta.sentido} />
        <Tag texto="EN INGLÉS" fondo={c.tagEn.fondo} color={c.tagEn.color} borde={c.tagEn.borde} left={c.tagEn.left} top={c.tagEn.top} entra={en - 8} tam={30} />

        {c.flecha && (
          <Trazo
            d="M 150 10 C 230 80, 200 170, 60 190 M 60 190 L 112 160 M 60 190 L 104 226"
            color={c.cinta.fondo === C.acento ? C.acento : C.blanco}
            ancho={9}
            desde={es - 12}
            dur={12}
            viewBox="0 0 260 240"
            style={{ left: 760, top: 1080, width: 260, height: 240 }}
          />
        )}
        <Tag texto="EN ESPAÑOL" fondo={c.tagEs.fondo} color={c.tagEs.color} borde={c.tagEs.borde} left={c.tagEs.left} top={c.tagEs.top} entra={es - 6} tam={30} />
        <Sello texto={c.espanol} fondo={c.sello.fondo} color={c.sello.color} left={c.sello.left} top={c.sello.top} rot={c.sello.rot} tam={c.sello.tam} entra={es - 3} />

        {/* ejemplos de carreras del área (cuando ya terminó la frase) */}
        <div style={{ position: 'absolute', left: 54, top: 1412, width: 972, display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          {AREAS[i].carreras.map((nombre, k) => {
            const t = rampa(f, chips + k * 5, chips + k * 5 + 12, salida);
            const [fondo, color] = c.chips[k % 2];
            return (
              <div key={nombre} style={{ padding: '11px 20px', background: fondo, color, fontWeight: 700, fontSize: 34, lineHeight: 1, whiteSpace: 'nowrap', rotate: `${k % 2 ? 2.5 : -2.5}deg`, opacity: t, scale: String(0.7 + 0.3 * t) }}>
                {nombre}
              </div>
            );
          })}
        </div>

        {/* chispas alrededor del sello cuando aterriza: colores que contrastan con el fondo de la escena */}
        {[
          [c.sello.left + c.sello.tam * 3.1, c.sello.top - 56, 0],
          [c.sello.left + c.sello.tam * 4.6, c.sello.top - 20, 3],
          [c.sello.left + c.sello.tam * 4.2, c.sello.top + c.sello.tam * 1.3, 5],
        ].map(([x, y, d], k) => {
          const t = rampa(f, es + 3 + d, es + 10 + d);
          const claro = c.letraColor === C.azul; // la letra es azul cuando el fondo es claro
          const relleno = c.chispa;
          return (
            <svg key={k} width={70} height={70} viewBox="-20 -20 40 40" style={{ position: 'absolute', left: x, top: y, scale: String(t * (1 - rampa(f, es + 30 + d, es + 40 + d))), rotate: `${f * 3}deg` }}>
              <path d="M 0 -18 L 4.5 -4.5 L 18 0 L 4.5 4.5 L 0 18 L -4.5 4.5 L -18 0 L -4.5 -4.5 Z" fill={relleno} stroke={claro ? 'none' : C.fondoB} strokeWidth={claro ? 0 : 1.5} />
            </svg>
          );
        })}
      </Camara>
    </>
  );
};
