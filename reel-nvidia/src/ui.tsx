import React from "react";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { C, CLAMP, mono, sans, VOICE } from "./theme";
import { Camera, type CameraMove, Words } from "./motion";

import { OUT } from "./motion";

/** Entrada: aparece y sube desde `at`. */
export const Rise: React.FC<{
  at: number;
  children: React.ReactNode;
  y?: number;
  dur?: number;
  style?: React.CSSProperties;
}> = ({ at, children, y = 44, dur = 18, style }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        opacity: interpolate(frame, [at, at + dur * 0.7], [0, 1], CLAMP),
        filter: `blur(${interpolate(frame, [at, at + dur * 0.8], [12, 0], CLAMP)}px)`,
        rotate: interpolate(
          frame,
          [at, at + dur],
          ["1 0 0 18deg", "1 0 0 0deg"],
          {
            ...CLAMP,
            easing: OUT,
          },
        ),
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
    <Audio
      src={staticFile(`sfx/${src}.wav`)}
      volume={volume * (VOICE ? 0.55 : 1)}
    />
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
    <div>
      <Words text={a} at={at} />
    </div>
    {b ? (
      <div style={{ color: C.inkT }}>
        <Words text={b} at={at + a.split(" ").length * 3 + 2} />
      </div>
    ) : null}
  </div>
);

/** Marco de escena: márgenes seguros para Reels, etiqueta, fuente y salida. */
export const Scene: React.FC<{
  eyebrow?: string;
  source?: string;
  camera?: CameraMove;
  children: React.ReactNode;
}> = ({ eyebrow, source, camera, children }) => {
  const frame = useCurrentFrame();
  return (
    <Camera move={camera}>
      <AbsoluteFill
        style={{
          padding: "340px 80px 400px",
          fontFamily: sans,
          color: C.ink,
          perspective: 1400,
        }}
      >
        <div
          style={{
            height: 1150,
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
    </Camera>
  );
};

/** Cabecera fija: "Última hora", fecha y barra de avance. */
export const Chrome: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, #010102 0%, #010102 185px, rgba(1,1,2,0) 250px)",
        }}
      />
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
    </AbsoluteFill>
  );
};
