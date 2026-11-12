import React from "react";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, CLAMP, mono, sans } from "./theme";

const OUT = Easing.bezier(0.16, 1, 0.3, 1);

/** Entrada: aparece y sube desde `at`. */
export const Rise: React.FC<{
  at: number;
  children: React.ReactNode;
  y?: number;
  dur?: number;
  style?: React.CSSProperties;
}> = ({ at, children, y = 44, dur = 16, style }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        opacity: interpolate(frame, [at, at + dur * 0.7], [0, 1], CLAMP),
        translate: interpolate(
          frame,
          [at, at + dur],
          [`0px ${y}px`, "0px 0px"],
          {
            ...CLAMP,
            easing: OUT,
          },
        ),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Sonido corto colocado en un frame de la escena. */
export const Sfx: React.FC<{ at: number; src: string; volume?: number }> = ({
  at,
  src,
  volume = 0.6,
}) => (
  <Sequence from={at} layout="none">
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={volume} />
  </Sequence>
);

export const Pill: React.FC<{
  children: React.ReactNode;
  tone?: "neutral" | "red" | "green" | "acc";
  size?: number;
}> = ({ children, tone = "neutral", size = 28 }) => {
  const tones = {
    neutral: { color: C.inkM, border: C.hair, bg: C.s3 },
    red: {
      color: "#ff8a8a",
      border: "rgba(235,87,87,.5)",
      bg: "rgba(235,87,87,.14)",
    },
    green: {
      color: "#4cd26a",
      border: "rgba(39,166,68,.5)",
      bg: "rgba(39,166,68,.14)",
    },
    acc: {
      color: C.accH,
      border: "rgba(94,106,210,.5)",
      bg: "rgba(94,106,210,.14)",
    },
  }[tone];
  return (
    <span
      style={{
        fontFamily: sans,
        fontWeight: 500,
        fontSize: size,
        color: tones.color,
        background: tones.bg,
        border: `1.5px solid ${tones.border}`,
        borderRadius: 9999,
        padding: `${size * 0.28}px ${size * 0.6}px`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
};

export const Panel: React.FC<{
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ title, right, children, style }) => (
  <div
    style={{
      background: C.s1,
      border: `1.5px solid ${C.hair}`,
      borderRadius: 28,
      boxShadow: "inset 0 1.5px 0 rgba(255,255,255,.05)",
      overflow: "hidden",
      ...style,
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "24px 34px",
        background: C.s2,
        borderBottom: `1.5px solid ${C.hair}`,
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          fontFamily: mono,
          fontWeight: 500,
          fontSize: 26,
          color: C.inkS,
        }}
      >
        <span style={{ display: "flex", gap: 9 }}>
          {[0, 1, 2].map((i) => (
            <i
              key={i}
              style={{
                width: 13,
                height: 13,
                borderRadius: "50%",
                background: C.hair2,
              }}
            />
          ))}
        </span>
        {title}
      </span>
      {right}
    </div>
    {children}
  </div>
);

export const Headline: React.FC<{
  a: string;
  b?: string;
  at?: number;
  size?: number;
}> = ({ a, b, at = 0, size = 104 }) => (
  <div
    style={{
      fontFamily: sans,
      fontWeight: 600,
      fontSize: size,
      lineHeight: 1.04,
      letterSpacing: -size * 0.04,
      color: C.ink,
    }}
  >
    <Rise at={at}>{a}</Rise>
    {b ? (
      <Rise at={at + 8} style={{ color: C.inkT }}>
        {b}
      </Rise>
    ) : null}
  </div>
);

/** Marco de escena: márgenes seguros para Reels, etiqueta, fuente y salida. */
export const Scene: React.FC<{
  eyebrow?: string;
  source?: string;
  children: React.ReactNode;
}> = ({ eyebrow, source, children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        padding: "300px 80px 400px",
        fontFamily: sans,
        color: C.ink,
        opacity: interpolate(
          frame,
          [durationInFrames - 8, durationInFrames - 1],
          [1, 0],
          CLAMP,
        ),
      }}
    >
      <div
        style={{
          height: 1190,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {eyebrow ? (
          <Rise at={0} y={20} style={{ marginBottom: 34 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 14,
                fontFamily: sans,
                fontWeight: 500,
                fontSize: 30,
                color: C.inkM,
                background: C.s2,
                border: `1.5px solid ${C.hair}`,
                borderRadius: 9999,
                padding: "12px 26px 12px 20px",
              }}
            >
              <i
                style={{
                  width: 13,
                  height: 13,
                  borderRadius: "50%",
                  background: C.acc,
                }}
              />
              {eyebrow}
            </span>
          </Rise>
        ) : null}
        {children}
      </div>
      {source ? (
        <div
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            bottom: 330,
            fontFamily: mono,
            fontSize: 24,
            lineHeight: 1.5,
            color: C.inkT,
            opacity: interpolate(frame, [20, 34], [0, 1], CLAMP),
          }}
        >
          <span style={{ color: C.inkS }}>Fuente:</span> {source}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/** Fondo: lienzo casi negro con retícula muy tenue que se desplaza. */
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.canvas }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.hair} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.hair} 1.5px, transparent 1.5px)`,
          backgroundSize: "120px 120px",
          backgroundPosition: `0px ${interpolate(frame, [0, 1200], [0, -240])}px`,
          opacity: 0.35,
          maskImage:
            "radial-gradient(ellipse 75% 60% at 50% 45%, black 0%, transparent 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

/** Cabecera fija: "Última hora", fecha y barra de avance. */
export const Chrome: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ padding: "190px 80px 0", fontFamily: sans }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            background: C.red,
            color: "#fff",
            fontWeight: 600,
            fontSize: 30,
            letterSpacing: 0.4,
            borderRadius: 10,
            padding: "10px 20px",
            scale: interpolate(frame, [0, 10], [0.6, 1], {
              ...CLAMP,
              easing: Easing.bezier(0.34, 1.56, 0.64, 1),
            }),
          }}
        >
          <i
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#fff",
              opacity: interpolate(frame % 30, [0, 15, 30], [1, 0.25, 1]),
            }}
          />
          ÚLTIMA HORA
        </span>
        <span style={{ fontFamily: mono, fontSize: 26, color: C.inkS }}>
          12 NOV 2026
        </span>
      </div>
      <div
        style={{
          height: 4,
          background: C.hair,
          borderRadius: 2,
          marginTop: 26,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            background: C.inkM,
            width: `${interpolate(frame, [0, total], [0, 100], CLAMP)}%`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
