import React from "react";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  staticFile,
} from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import {
  Backdrop,
  FadeOut,
  FilmLook,
  shutter,
  whip,
  zoomThrough,
} from "./motion";
import { Hook } from "./scenes/Hook";
import { Importa } from "./scenes/Importa";
import { Mercado } from "./scenes/Mercado";
import { PorQue } from "./scenes/PorQue";
import { QuePaso } from "./scenes/QuePaso";
import { Relevo } from "./scenes/Relevo";
import { SCENES, TOTAL, TRANSITION, VOICE } from "./theme";
import { Chrome } from "./ui";

// Cada escena dura TRANSITION frames más porque se solapa con la siguiente;
// así el total sigue siendo exactamente TOTAL (36,5 s).
const T = TRANSITION;
const timing = linearTiming({
  durationInFrames: T,
  easing: Easing.bezier(0.7, 0, 0.3, 1),
});

export const Reel: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    <Audio
      src={staticFile("sfx/drone.wav")}
      volume={(f) =>
        interpolate(f, [TOTAL - 45, TOTAL - 1], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }) * (VOICE ? 0.22 : 0.5)
      }
    />
    {VOICE ? <Audio src={staticFile(VOICE)} volume={1} /> : null}
    <TransitionSeries>
      <TransitionSeries.Sequence name="Hook" durationInFrames={SCENES.hook + T}>
        <Hook />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={zoomThrough()}
        timing={timing}
      />
      <TransitionSeries.Sequence
        name="Qué pasó"
        durationInFrames={SCENES.quePaso + T}
      >
        <QuePaso />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={whip("left")}
        timing={timing}
      />
      <TransitionSeries.Sequence
        name="Contexto"
        durationInFrames={SCENES.porQue + T}
      >
        <PorQue />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={shutter()} timing={timing} />
      <TransitionSeries.Sequence
        name="Mercado"
        durationInFrames={SCENES.mercado + T}
      >
        <Mercado />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={whip("up")} timing={timing} />
      <TransitionSeries.Sequence
        name="Relevo"
        durationInFrames={SCENES.relevo + T}
      >
        <Relevo />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={whip("left")}
        timing={timing}
      />
      <TransitionSeries.Sequence
        name="Importa"
        durationInFrames={SCENES.importa}
      >
        <Importa />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Sequence name="Cabecera" durationInFrames={TOTAL} layout="none">
      <Chrome total={TOTAL} />
    </Sequence>
    <FilmLook />
    <FadeOut frames={20} />
  </AbsoluteFill>
);
