import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { C, CLAMP } from "./theme";

export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

/* ---------------------------------------------------------------- Cámara */

export type CameraMove = {
  /** Zoom al inicio y al final de la escena. */
  zoom?: [number, number];
  /** Desplazamiento (px) al inicio y al final. */
  pan?: [[number, number], [number, number]];
  /** Giro (grados) al inicio y al final. */
  roll?: [number, number];
  /** Frames de la escena con un golpe: temblor + zoom puntual. */
  shakes?: Array<{ at: number; power?: number }>;
  /** Frames que dura la entrada de cámara (con easing) antes de la deriva lenta. */
  settle?: number;
};

const shakeAt = (frame: number, at: number, power: number) => {
  if (frame < at) return { x: 0, y: 0, s: 0, r: 0 };
  const k = interpolate(frame, [at, at + 16], [1, 0], {
    ...CLAMP,
    easing: Easing.out(Easing.quad),
  });
  const t = frame - at;
  return {
    x: Math.sin(t * 2.9) * 22 * power * k,
    y: Math.cos(t * 3.7) * 16 * power * k,
    s: 0.045 * power * k,
    r: Math.sin(t * 2.3) * 0.9 * power * k,
  };
};

/** Cámara virtual: zoom, paneo y giro con easing, deriva de mano y golpes. */
export const Camera: React.FC<{
  move?: CameraMove;
  children: React.ReactNode;
}> = ({ move = {}, children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const {
    zoom = [1.0, 1.05],
    pan = [
      [0, 0],
      [0, 0],
    ],
    roll = [0, 0],
    shakes = [],
    settle,
  } = move;

  const end = Math.max(durationInFrames - 1, 1);
  const p = settle
    ? interpolate(frame, [0, settle, end], [0, 0.82, 1], {
        ...CLAMP,
        easing: [OUT, Easing.linear],
      })
    : interpolate(frame, [0, end], [0, 1], { ...CLAMP, easing: IN_OUT });

  const lerp = (a: number, b: number) => a + (b - a) * p;

  // Deriva "de mano": suma de senos lentos, sin repetir patrón visible.
  const driftX = Math.sin(frame / 37) * 7 + Math.sin(frame / 13.7) * 2.5;
  const driftY = Math.cos(frame / 43) * 7 + Math.sin(frame / 17.3) * 2;
  const driftR = Math.sin(frame / 61) * 0.35;

  const hit = shakes.reduce(
    (acc, s) => {
      const v = shakeAt(frame, s.at, s.power ?? 1);
      return { x: acc.x + v.x, y: acc.y + v.y, s: acc.s + v.s, r: acc.r + v.r };
    },
    { x: 0, y: 0, s: 0, r: 0 },
  );

  return (
    <AbsoluteFill
      style={{
        scale: lerp(zoom[0], zoom[1]) + hit.s,
        translate: `${lerp(pan[0][0], pan[1][0]) + driftX + hit.x}px ${
          lerp(pan[0][1], pan[1][1]) + driftY + hit.y
        }px`,
        rotate: `${lerp(roll[0], roll[1]) + driftR + hit.r}deg`,
        transformOrigin: "50% 30%",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ Tipografía */

/** Texto que entra palabra por palabra: desenfoque, subida y giro 3D. */
export const Words: React.FC<{
  text: string;
  at: number;
  stagger?: number;
  dur?: number;
  style?: React.CSSProperties;
  wordStyle?: (i: number) => React.CSSProperties | undefined;
}> = ({ text, at, stagger = 3, dur = 16, style, wordStyle }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  return (
    <span style={{ display: "inline", perspective: 900, ...style }}>
      {words.map((w, i) => {
        const s = at + i * stagger;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              opacity: interpolate(frame, [s, s + dur * 0.6], [0, 1], CLAMP),
              translate: interpolate(
                frame,
                [s, s + dur],
                ["0px 0.55em", "0px 0em"],
                {
                  ...CLAMP,
                  easing: OUT,
                },
              ),
              rotate: interpolate(
                frame,
                [s, s + dur],
                ["1 0 0 -55deg", "1 0 0 0deg"],
                {
                  ...CLAMP,
                  easing: OUT,
                },
              ),
              filter: `blur(${interpolate(frame, [s, s + dur * 0.8], [14, 0], CLAMP)}px)`,
              ...wordStyle?.(i),
            }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </span>
  );
};

/** Separación RGB breve (glitch) sobre un bloque de texto. */
export const glitchShadow = (frame: number, at: number, len = 10) => {
  if (frame < at || frame > at + len) return undefined;
  const k = interpolate(frame, [at, at + len], [1, 0], CLAMP);
  const j = Math.sin(frame * 7.1) * 10 * k;
  return `${j}px 0 0 rgba(255,40,60,.85), ${-j}px 0 0 rgba(40,220,255,.85)`;
};

/* ---------------------------------------------------------------- Capas */

/** Destello a pantalla completa en un frame dado. */
export const Flash: React.FC<{ at: number; color?: string; peak?: number }> = ({
  at,
  color = "#fff",
  peak = 0.55,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at - 1, at, at + 4], [0, peak, 0], CLAMP);
  if (o <= 0) return null;
  return (
    <AbsoluteFill
      style={{ background: color, opacity: o, mixBlendMode: "screen" }}
    />
  );
};

/** Fondo con profundidad: retícula en perspectiva que avanza y un halo que respira. */
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.canvas, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          left: "-50%",
          right: "-50%",
          top: "38%",
          height: "140%",
          perspective: 700,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "50% 0%",
            rotate: "1 0 0 68deg",
            backgroundImage: `linear-gradient(${C.hair2} 2px, transparent 2px), linear-gradient(90deg, ${C.hair2} 2px, transparent 2px)`,
            backgroundSize: "140px 140px",
            backgroundPosition: `0px ${frame * 2.2}px`,
            opacity: 0.55,
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 35%, black 60%, transparent 100%)",
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.hair} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.hair} 1.5px, transparent 1.5px)`,
          backgroundSize: "120px 120px",
          backgroundPosition: `${Math.sin(frame / 90) * 30}px ${-frame * 0.4}px`,
          opacity: 0.22,
          maskImage:
            "radial-gradient(ellipse 70% 45% at 50% 30%, black 0%, transparent 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          left: 90 + Math.sin(frame / 70) * 160,
          top: 360 + Math.cos(frame / 85) * 140,
          background:
            "radial-gradient(circle, rgba(94,106,210,.16) 0%, transparent 65%)",
          scale: 1 + Math.sin(frame / 40) * 0.08,
        }}
      />
    </AbsoluteFill>
  );
};

/** Grano de película animado + viñeta. */
export const FilmLook: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = frame % 8;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ opacity: 0.065, mixBlendMode: "screen" }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 540 960"
          preserveAspectRatio="none"
        >
          <filter id={`g${seed}`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              seed={seed}
              stitchTiles="stitch"
            />
            <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.2 -0.25" />
          </filter>
          <rect width="540" height="960" filter={`url(#g${seed})`} />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 85% 70% at 50% 45%, transparent 55%, rgba(0,0,0,.75) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- Transiciones */

const ZoomThrough: React.FC<
  TransitionPresentationComponentProps<Record<string, never>>
> = ({ children, presentationDirection, presentationProgress: p }) => {
  const entering = presentationDirection === "entering";
  return (
    <AbsoluteFill
      style={{
        scale: entering
          ? interpolate(p, [0, 1], [0.82, 1])
          : interpolate(p, [0, 1], [1, 1.6]),
        opacity: entering
          ? interpolate(p, [0.25, 0.7], [0, 1], CLAMP)
          : interpolate(p, [0.3, 0.75], [1, 0], CLAMP),
        filter: `blur(${entering ? interpolate(p, [0, 1], [26, 0]) : interpolate(p, [0, 1], [0, 30])}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** El plano saliente "atraviesa" la cámara y el entrante llega desde atrás. */
export const zoomThrough = (): TransitionPresentation<
  Record<string, never>
> => ({
  component: ZoomThrough,
  props: {},
});

type WhipProps = { dir: "left" | "up" };
const Whip: React.FC<TransitionPresentationComponentProps<WhipProps>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
  passedProps,
}) => {
  const entering = presentationDirection === "entering";
  const dist = passedProps.dir === "left" ? 1080 : 1920;
  const off = entering
    ? interpolate(p, [0, 1], [dist, 0])
    : interpolate(p, [0, 1], [0, -dist]);
  const blur = interpolate(p, [0, 0.5, 1], [0, 34, 0]);
  return (
    <AbsoluteFill
      style={{
        translate: passedProps.dir === "left" ? `${off}px 0px` : `0px ${off}px`,
        filter: `blur(${blur}px)`,
        rotate: `${interpolate(p, [0, 0.5, 1], [0, entering ? -2 : 2, 0])}deg`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Barrido rápido de cámara (whip pan) con desenfoque de movimiento. */
export const whip = (
  dir: WhipProps["dir"],
): TransitionPresentation<WhipProps> => ({
  component: Whip,
  props: { dir },
});

const Shutter: React.FC<
  TransitionPresentationComponentProps<Record<string, never>>
> = ({ children, presentationDirection, presentationProgress: p }) => {
  const entering = presentationDirection === "entering";
  if (!entering) {
    return (
      <AbsoluteFill
        style={{
          scale: interpolate(p, [0, 1], [1, 0.94]),
          filter: `brightness(${interpolate(p, [0, 1], [1, 0.4])})`,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }
  const cut = interpolate(p, [0, 1], [100, 0], { easing: OUT });
  return (
    <AbsoluteFill
      style={{
        clipPath: `inset(${cut / 2}% 0% ${cut / 2}% 0%)`,
        scale: interpolate(p, [0, 1], [1.08, 1]),
      }}
    >
      {children}
      <AbsoluteFill
        style={{
          background: C.accH,
          opacity: interpolate(p, [0, 0.4], [0.14, 0], CLAMP),
          mixBlendMode: "screen",
        }}
      />
    </AbsoluteFill>
  );
};

/** Apertura tipo obturador: el nuevo plano se abre desde el centro. */
export const shutter = (): TransitionPresentation<Record<string, never>> => ({
  component: Shutter,
  props: {},
});

/** Fundido a negro al final de la composición. */
export const FadeOut: React.FC<{ frames: number }> = ({ frames }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const o = interpolate(
    frame,
    [durationInFrames - frames, durationInFrames - 1],
    [0, 1],
    CLAMP,
  );
  if (o <= 0) return null;
  return <AbsoluteFill style={{ background: "#000", opacity: o }} />;
};
