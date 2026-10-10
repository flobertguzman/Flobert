import React from "react";
import {
  AbsoluteFill,
  Easing,
  Html5Audio,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { loadFont } from "@remotion/fonts";
import type { NamePart, ReelProps } from "./reels";

// Fuentes locales (public/fonts) para que el render no dependa de internet
const inter = "Inter";
const montserrat = "Montserrat";
for (const weight of ["400", "700", "800"]) {
  loadFont({
    family: inter,
    url: staticFile(`fonts/inter-latin-${weight}-normal.woff2`),
    weight,
  });
}
for (const weight of ["600", "700"]) {
  loadFont({
    family: montserrat,
    url: staticFile(`fonts/montserrat-latin-${weight}-normal.woff2`),
    weight,
  });
}

export const C = {
  bg: "#0f2147",
  bgDeep: "#0a1733",
  cream: "#F3EEE6",
  orange: "#F39A1F",
  line: "rgba(243, 238, 230, 0.45)",
};

// Línea de tiempo (30 fps, 450 frames = 15 s)
export const T = {
  introEnd: 84,
  posterIn: 76,
  posterOut: 332,
  lineIn: 346,
  logoIn: 356,
  endText: 378,
  total: 450,
};

const outExpo = Easing.bezier(0.16, 1, 0.3, 1);
const inOut = Easing.bezier(0.65, 0, 0.35, 1);

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const ramp = (
  frame: number,
  start: number,
  dur: number,
  from = 0,
  to = 1,
  easing = outExpo,
) => interpolate(frame, [start, start + dur], [from, to], { ...clamp, easing });

/* ---------- Fondo ---------- */

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = 0.9 + Math.sin(frame / 22) * 0.1;
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, #112552 0%, ${C.bg} 50%, ${C.bgDeep} 100%)`,
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 45% 32%, rgba(64, 112, 190, 0.45) 0%, rgba(64, 112, 190, 0) 55%)",
          opacity: glow,
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------- Intro: palabras rápidas ---------- */

const Intro: React.FC<{ props: ReelProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const n = props.introWords.length;
  const per = Math.floor(T.introEnd / n);
  const idx = Math.min(n - 1, Math.floor(frame / per));
  const local = frame - idx * per;
  const word = props.introWords[idx];
  const isLast = idx === n - 1;

  return (
    <AbsoluteFill>
      {/* Primer plano de la foto, muy oscuro, con zoom lento */}
      <AbsoluteFill
        style={{
          opacity: interpolate(frame, [0, 8, T.introEnd - 10, T.introEnd], [0, 0.32, 0.32, 0], clamp),
        }}
      >
        <Img
          src={staticFile(props.photo)}
          style={{
            position: "absolute",
            height: 2600,
            left: "50%",
            top: -260,
            translate: "-50% 0",
            scale: interpolate(frame, [0, T.introEnd], [1.08, 1.22], clamp),
            filter: "grayscale(1) contrast(1.15)",
          }}
        />
        <AbsoluteFill style={{ backgroundColor: C.bg, mixBlendMode: "multiply" }} />
      </AbsoluteFill>

      {/* Barras de ecualizador */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          gap: 10,
          paddingTop: 420,
          opacity: interpolate(frame, [T.introEnd - 8, T.introEnd], [0.9, 0], clamp),
        }}
      >
        {new Array(23).fill(true).map((_, i) => {
          const h =
            18 +
            Math.abs(Math.sin(frame / 3.1 + i * 0.9) * Math.cos(frame / 5.3 + i * 0.37)) *
              (90 - Math.abs(i - 11) * 6);
          return (
            <div
              key={i}
              style={{
                width: 8,
                height: h,
                borderRadius: 4,
                backgroundColor: i === 11 ? C.orange : "rgba(243, 238, 230, 0.35)",
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* Palabra activa */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: interpolate(frame, [T.introEnd - 6, T.introEnd], [1, 0], clamp),
        }}
      >
        <div
          style={{
            fontFamily: inter,
            fontWeight: 800,
            fontSize: 150,
            letterSpacing: "-0.02em",
            color: isLast ? C.orange : C.cream,
            scale: ramp(local, 0, 10, 1.25, 1),
            opacity: ramp(local, 0, 3),
            filter: `blur(${ramp(local, 0, 6, 12, 0)}px)`,
            whiteSpace: "nowrap",
          }}
        >
          {word}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- Póster ---------- */

const Square: React.FC<{
  x: number;
  y: number;
  size: number;
  filled?: boolean;
  delay: number;
  drift?: number;
}> = ({ x, y, size, filled, delay, drift = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + Math.sin((frame + drift * 20) / 18) * 4,
        width: size,
        height: size,
        boxSizing: "border-box",
        border: filled ? "none" : `3px solid ${C.orange}`,
        backgroundColor: filled ? C.cream : "transparent",
        scale: ramp(frame, delay, 14, 0, 1),
        rotate: `${ramp(frame, delay, 18, -90, 0)}deg`,
      }}
    />
  );
};

const NameLine: React.FC<{ parts: NamePart[]; delay: number; top: number }> = ({
  parts,
  delay,
  top,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: 34,
        top,
        height: 140,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          fontFamily: inter,
          fontWeight: 800,
          fontSize: 150,
          lineHeight: "140px",
          letterSpacing: "-0.03em",
          whiteSpace: "nowrap",
          translate: `0 ${ramp(frame, delay, 18, 150, 0)}px`,
        }}
      >
        {parts.map((p, i) => (
          <span key={i} style={{ color: p.accent ? C.orange : C.cream }}>
            {p.text}
          </span>
        ))}
      </div>
    </div>
  );
};

const Divider: React.FC<{ y: number; delay: number }> = ({ y, delay }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        top: y,
        width: 1000,
        height: 2,
        backgroundColor: C.line,
        transformOrigin: "left center",
        scale: `${ramp(frame, delay, 22, 0, 1, inOut)} 1`,
      }}
    />
  );
};

const Poster: React.FC<{ props: ReelProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const photoUrl = `url(${staticFile(props.photo)})`;
  const fadeMask = "linear-gradient(180deg, #000 0%, #000 72%, transparent 97%)";

  const textStyle: React.CSSProperties = {
    fontFamily: inter,
    color: C.cream,
  };

  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(frame, [T.posterOut - T.posterIn, T.posterOut - T.posterIn + 12], [1, 0], {
          ...clamp,
          easing: inOut,
        }),
      }}
    >
      {/* Palabra gigante con contorno deslizándose */}
      <div
        style={{
          position: "absolute",
          top: 210,
          left: 0,
          whiteSpace: "nowrap",
          fontFamily: inter,
          fontWeight: 800,
          fontSize: 420,
          letterSpacing: "-0.02em",
          color: "transparent",
          WebkitTextStroke: "2px rgba(243, 154, 31, 0.28)",
          translate: `${interpolate(frame, [0, 300], [80, -620])}px 0`,
          opacity: ramp(frame, 6, 20),
        }}
      >
        {props.backdropWord} {props.backdropWord}
      </div>

      {/* Foto: eco naranja + recorte */}
      <div
        style={{
          position: "absolute",
          left: props.photoLeft,
          top: props.photoTop,
          height: props.photoHeight,
          width: props.photoHeight,
          opacity: ramp(frame, 0, 20),
          translate: `0 ${ramp(frame, 0, 26, 90, 0)}px`,
          scale: interpolate(frame, [0, 260], [1, 1.045], clamp),
          transformOrigin: "40% 100%",
          WebkitMaskImage: fadeMask,
          maskImage: fadeMask,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: C.orange,
            WebkitMaskImage: photoUrl,
            WebkitMaskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "left bottom",
            translate: `${ramp(frame, 10, 24, 0, 22)}px ${ramp(frame, 10, 24, 0, -14)}px`,
            opacity: 0.9,
          }}
        />
        <Img
          src={staticFile(props.photo)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "left bottom",
            filter: "contrast(1.05) saturate(0.9) drop-shadow(0 30px 60px rgba(0,0,0,0.45))",
          }}
        />
      </div>

      {/* Degradado para leer el bloque derecho */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(270deg, rgba(10, 23, 51, 0.75) 0%, rgba(10, 23, 51, 0) 38%)",
        }}
      />

      {/* Logo arriba a la derecha */}
      <Img
        src={staticFile("logo-eldiego.png")}
        style={{
          position: "absolute",
          right: 90,
          top: 300,
          width: 180,
          opacity: ramp(frame, 20, 16),
          translate: `0 ${ramp(frame, 20, 20, -20, 0)}px`,
        }}
      />

      {/* "DJ set en vivo / Piso 9" */}
      <div
        style={{
          ...textStyle,
          position: "absolute",
          left: 760,
          top: 506,
          fontSize: 25,
          lineHeight: "32px",
          fontWeight: 400,
          opacity: ramp(frame, 26, 16),
          translate: `${ramp(frame, 26, 18, 20, 0)}px 0`,
          textShadow: "0 2px 12px rgba(0,0,0,0.5)",
        }}
      >
        {props.tagline}
        <br />
        Piso 9
      </div>
      <Square x={958} y={500} size={74} delay={24} drift={1} />
      <Square x={40} y={660} size={72} delay={30} drift={2} />

      {/* Hora / fecha */}
      <div
        style={{
          ...textStyle,
          position: "absolute",
          left: 700,
          top: 840,
          fontWeight: 800,
          lineHeight: 1.02,
          letterSpacing: "-0.01em",
          textShadow: "0 4px 20px rgba(0,0,0,0.55)",
        }}
      >
        {[props.time, props.day, props.monthYear].map((t, i) => (
          <div
            key={t}
            style={{
              fontSize: i === 0 ? 58 : 46,
              opacity: ramp(frame, 32 + i * 5, 14),
              translate: `${ramp(frame, 32 + i * 5, 20, 40, 0)}px 0`,
            }}
          >
            {t}
          </div>
        ))}
      </div>

      {/* Nombre */}
      <Divider y={1266} delay={8} />
      <NameLine parts={props.nameTop} delay={14} top={1288} />
      <NameLine parts={props.nameBottom} delay={20} top={1420} />
      <Square x={980} y={1422} size={60} delay={34} drift={3} />
      <Square x={980} y={1496} size={60} filled delay={38} drift={4} />
      <Divider y={1566} delay={16} />

      {/* Pie */}
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 1604,
          fontFamily: montserrat,
          fontWeight: 700,
          fontSize: 19,
          letterSpacing: "0.32em",
          lineHeight: "31px",
          color: C.orange,
          opacity: ramp(frame, 40, 18),
        }}
      >
        PISO 9 DEL HOTEL HAMPTON BY HILTON
        <br />
        SANTIAGO DE LOS CABALLEROS
      </div>
      <div
        style={{
          position: "absolute",
          right: 34,
          top: 1635,
          fontFamily: montserrat,
          fontWeight: 700,
          fontSize: 19,
          letterSpacing: "0.32em",
          color: C.cream,
          opacity: ramp(frame, 46, 18),
        }}
      >
        EL DIEGO ROOFTOP BAR
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Cierre con logo ---------- */

const EndCard: React.FC<{ props: ReelProps }> = ({ props }) => {
  const frame = useCurrentFrame(); // 0 = T.lineIn
  const logoStart = T.logoIn - T.lineIn;
  const textStart = T.endText - T.lineIn;
  const lineY = 1050;

  return (
    <AbsoluteFill>
      {/* Halo y anillos */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 46%, rgba(40, 84, 160, 0.55) 0%, rgba(40, 84, 160, 0) 50%)",
          opacity: ramp(frame, 0, 30),
        }}
      />
      {[0, 1, 2, 3].map((i) => {
        const r = 300 + i * 170 + frame * 0.8;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 540 - r,
              top: 890 - r,
              width: r * 2,
              height: r * 2,
              borderRadius: "50%",
              border: "1.5px solid rgba(243, 238, 230, 0.05)",
              opacity: ramp(frame, logoStart, 30),
            }}
          />
        );
      })}

      {/* Línea naranja */}
      <div
        style={{
          position: "absolute",
          left: 90,
          top: lineY,
          width: 900,
          height: 3,
          backgroundColor: C.orange,
          scale: `${ramp(frame, 0, 14, 0, 1, inOut)} 1`,
          opacity: interpolate(frame, [textStart - 6, textStart + 6], [1, 0], clamp),
          boxShadow: `0 0 18px ${C.orange}`,
        }}
      />

      {/* Logo que sube desde la línea */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: lineY,
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile("logo-eldiego.png")}
          style={{
            position: "absolute",
            width: 640,
            left: 220,
            top: 700,
            translate: `0 ${ramp(frame, logoStart, 22, 360, 0)}px`,
          }}
        />
      </div>

      {/* Datos */}
      <div
        style={{
          position: "absolute",
          top: 1110,
          left: 0,
          right: 0,
          textAlign: "center",
          color: C.cream,
        }}
      >
        <div
          style={{
            fontFamily: inter,
            fontWeight: 800,
            fontSize: 40,
            opacity: ramp(frame, textStart, 14),
            translate: `0 ${ramp(frame, textStart, 18, 20, 0)}px`,
          }}
        >
          {props.endLine}
        </div>
        <div
          style={{
            fontFamily: inter,
            fontWeight: 800,
            fontSize: 64,
            color: C.orange,
            marginTop: 14,
            opacity: ramp(frame, textStart + 6, 14),
            scale: ramp(frame, textStart + 6, 18, 0.8, 1),
          }}
        >
          {props.time}
        </div>
        <div
          style={{
            fontFamily: montserrat,
            fontWeight: 700,
            fontSize: 21,
            letterSpacing: "0.32em",
            lineHeight: "34px",
            marginTop: 40,
            opacity: ramp(frame, textStart + 12, 16),
          }}
        >
          <span style={{ color: C.orange }}>PISO 9 DEL HOTEL HAMPTON BY HILTON</span>
          <br />
          SANTIAGO DE LOS CABALLEROS
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Reel completo ---------- */

export const Reel: React.FC<ReelProps> = (props) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bgDeep }}>
      <Background />
      <Sequence durationInFrames={T.introEnd} name="Intro">
        <Intro props={props} />
      </Sequence>
      <Sequence from={T.posterIn} durationInFrames={T.lineIn - T.posterIn} name="Póster">
        <Poster props={props} />
      </Sequence>
      <Sequence from={T.lineIn} name="Cierre">
        <EndCard props={props} />
      </Sequence>
      {/* Fundido final */}
      <AbsoluteFill
        style={{
          backgroundColor: "#000",
          opacity: interpolate(frame, [T.total - 8, T.total], [0, 1], clamp),
          pointerEvents: "none",
        }}
      />
      {props.audio ? <Html5Audio src={staticFile(props.audio)} /> : null}
    </AbsoluteFill>
  );
};
