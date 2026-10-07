import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Camara, Cinta, FotoCinta, LetraGigante, Sello, Sticker, Tag, Trazo, sacudida } from '../componentes/collage';
import { MundoCiencia, MundoIngenieria, MundoMatematicas, MundoTecnologia } from '../componentes/mundos';
import { C, rampa, salida } from '../marca';

/**
 * Una letra cada 3 s, cada una en su propio «mundo» de collage:
 * la inicial golpea → la palabra en inglés cruza en una cinta → la palabra en español cae como un sello.
 * `en` y `es` son los fotogramas (locales) en que la voz dice cada palabra.
 */
type Config = {
  letra: string;
  ingles: string;
  espanol: string;
  en: number;
  es: number;
  Mundo: React.FC;
  letraColor: string;
  letraTrama: string;
  letraPos: { left: number; top: number; tam: number };
  foto?: { src: string; left: number; top: number; ancho: number; rot: number };
  sticker?: { cual: 'camila' | 'elias'; ancho: number; left: number; top: number; rot: number };
  cinta: { fondo: string; color: string; estrella: string; top: number; rot: number; sentido: 1 | -1 };
  sello: { fondo: string; color: string; left: number; top: number; rot: number; tam: number };
  tagEn: { left: number; top: number; fondo: string; color: string };
  tagEs: { left: number; top: number; fondo: string; color: string };
  flecha?: boolean;
  entradaCentrada?: boolean; // la S llega por corte de continuidad desde la apertura
};

export const LETRAS: Config[] = [
  {
    letra: 'S',
    ingles: 'SCIENCE',
    espanol: 'Ciencia',
    en: 23,
    es: 42,
    Mundo: () => <MundoCiencia />,
    letraColor: C.azul,
    letraTrama: 'rgba(255,255,255,0.16)',
    letraPos: { left: -10, top: 150, tam: 1000 },
    foto: { src: 'fotos/ciencia.jpg', left: 610, top: 200, ancho: 340, rot: 7 },
    cinta: { fondo: C.acento, color: C.blanco, estrella: C.azul, top: 905, rot: -7, sentido: 1 },
    sello: { fondo: C.azul, color: C.blanco, left: 64, top: 1226, rot: -3, tam: 168 },
    tagEn: { left: 64, top: 846, fondo: C.azul, color: C.blanco },
    tagEs: { left: 80, top: 1166, fondo: C.acento, color: C.blanco },
    flecha: true,
    entradaCentrada: true,
  },
  {
    letra: 'T',
    ingles: 'TECHNOLOGY',
    espanol: 'Tecnología',
    en: 18,
    es: 43,
    Mundo: () => <MundoTecnologia />,
    letraColor: C.blanco,
    letraTrama: 'rgba(36,58,117,0.22)',
    letraPos: { left: -40, top: 780, tam: 900 },
    sticker: { cual: 'camila', ancho: 760, left: 330, top: 700, rot: -3 },
    cinta: { fondo: C.blanco, color: C.azul, estrella: C.acento, top: 280, rot: 6, sentido: -1 },
    sello: { fondo: C.acento, color: C.blanco, left: 44, top: 566, rot: -4, tam: 148 },
    tagEn: { left: 64, top: 196, fondo: C.acento, color: C.blanco },
    tagEs: { left: 64, top: 506, fondo: C.blanco, color: C.azul },
  },
  {
    letra: 'E',
    ingles: 'ENGINEERING',
    espanol: 'Ingeniería',
    en: 15,
    es: 37,
    Mundo: () => <MundoIngenieria />,
    letraColor: C.blanco,
    letraTrama: 'rgba(36,58,117,0.25)',
    letraPos: { left: -10, top: 150, tam: 1000 },
    foto: { src: 'fotos/ingenieria.jpg', left: 600, top: 220, ancho: 340, rot: -6 },
    cinta: { fondo: C.acento, color: C.blanco, estrella: C.blanco, top: 905, rot: 6, sentido: -1 },
    sello: { fondo: C.blanco, color: C.azul, left: 64, top: 1236, rot: -3, tam: 160 },
    tagEn: { left: 64, top: 790, fondo: C.blanco, color: C.azul },
    tagEs: { left: 80, top: 1180, fondo: C.acento, color: C.blanco },
  },
  {
    letra: 'M',
    ingles: 'MATHEMATICS',
    espanol: 'Matemáticas',
    en: 14,
    es: 34,
    Mundo: () => <MundoMatematicas />,
    letraColor: C.azul,
    letraTrama: 'rgba(255,255,255,0.18)',
    letraPos: { left: -30, top: 800, tam: 820 },
    sticker: { cual: 'elias', ancho: 620, left: 450, top: 740, rot: 3 },
    cinta: { fondo: C.azul, color: C.blanco, estrella: C.acento, top: 300, rot: -6, sentido: 1 },
    sello: { fondo: C.acento, color: C.blanco, left: 44, top: 632, rot: -3, tam: 128 },
    tagEn: { left: 64, top: 214, fondo: C.azul, color: C.blanco },
    tagEs: { left: 64, top: 578, fondo: C.azul, color: C.blanco },
  },
];

export const R2Letra: React.FC<{ i: number }> = ({ i }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = LETRAS[i];
  const { Mundo } = c;

  // la inicial: golpe con rebote (o llegada desde el centro en la S, que viene del zoom de la apertura)
  const sp = spring({ frame: f - 1, fps, config: { damping: 10, stiffness: 220, mass: 0.7 } });
  const llega = rampa(f, 0, 13, salida);
  const dx = c.entradaCentrada ? (1 - llega) * 250 : sacudida(f, 2, 16);
  const dy = c.entradaCentrada ? (1 - llega) * 410 : -sacudida(f, 2, 8);
  const esc = c.entradaCentrada ? 1.2 - 0.2 * llega : 1.7 - 0.7 * sp;

  return (
    <>
      <Mundo />
      <Camara dur={90} golpes={[2, c.en - 1, c.es]}>
        <LetraGigante
          letra={c.letra}
          tam={c.letraPos.tam}
          color={c.letraColor}
          trama={c.letraTrama}
          left={c.letraPos.left}
          top={c.letraPos.top}
          style={{ translate: `${dx}px ${dy}px`, scale: String(esc), transformOrigin: '40% 55%' }}
        />
        {c.foto && <FotoCinta src={c.foto.src} left={c.foto.left} top={c.foto.top} ancho={c.foto.ancho} rot={c.foto.rot} entra={6} />}
        {c.sticker && <Sticker cual={c.sticker.cual} ancho={c.sticker.ancho} left={c.sticker.left} top={c.sticker.top} rot={c.sticker.rot} entra={5} desde="abajo" />}

        <Cinta texto={c.ingles} fondo={c.cinta.fondo} color={c.cinta.color} estrella={c.cinta.estrella} top={c.cinta.top} rot={c.cinta.rot} entra={c.en - 3} sentido={c.cinta.sentido} />
        <Tag texto="EN INGLÉS" fondo={c.tagEn.fondo} color={c.tagEn.color} left={c.tagEn.left} top={c.tagEn.top} entra={c.en - 5} />

        {c.flecha && (
          <Trazo
            d="M 150 10 C 230 80, 200 170, 60 190 M 60 190 L 112 160 M 60 190 L 104 226"
            color={c.cinta.fondo === C.acento ? C.acento : C.blanco}
            ancho={9}
            desde={c.es - 8}
            dur={9}
            viewBox="0 0 260 240"
            style={{ left: 760, top: 1080, width: 260, height: 240 }}
          />
        )}
        <Tag texto="EN ESPAÑOL" fondo={c.tagEs.fondo} color={c.tagEs.color} left={c.tagEs.left} top={c.tagEs.top} entra={c.es - 2} />
        <Sello texto={c.espanol} fondo={c.sello.fondo} color={c.sello.color} left={c.sello.left} top={c.sello.top} rot={c.sello.rot} tam={c.sello.tam} entra={c.es} />

        {/* chispas alrededor del sello cuando aterriza */}
        {[
          [c.sello.left + 40, c.sello.top - 40, 0],
          [c.sello.left + c.sello.tam * 4.6, c.sello.top - 20, 3],
          [c.sello.left + c.sello.tam * 4.2, c.sello.top + c.sello.tam * 1.25, 5],
        ].map(([x, y, d], k) => {
          const t = rampa(f, c.es + 3 + d, c.es + 10 + d);
          return (
            <svg key={k} width={70} height={70} viewBox="-20 -20 40 40" style={{ position: 'absolute', left: x, top: y, scale: String(t * (1 - rampa(f, c.es + 30 + d, c.es + 40 + d))), rotate: `${f * 3}deg` }}>
              <path d="M 0 -18 L 4.5 -4.5 L 18 0 L 4.5 4.5 L 0 18 L -4.5 4.5 L -18 0 L -4.5 -4.5 Z" fill={k === 1 ? C.acento : c.letraColor === C.azul ? C.azul : C.blanco} />
            </svg>
          );
        })}
      </Camara>
    </>
  );
};
