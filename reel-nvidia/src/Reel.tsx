import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, Sequence, staticFile } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { Backdrop, FilmLook, shutter, whip, zoomThrough } from "./motion";
import { Cierre } from "./scenes/Cierre";
import { Hook } from "./scenes/Hook";
import { Importa } from "./scenes/Importa";
import { Mercado } from "./scenes/Mercado";
import { PorQue } from "./scenes/PorQue";
import { QuePaso } from "./scenes/QuePaso";
import { Relevo } from "./scenes/Relevo";
import { SCENES, TOTAL, TRANSITION, VOICE } from "./theme";
import { Chrome } from "./ui";

// Cada escena dura TRANSITION frames más porque se solapa con la siguiente;
// así el total sigue siendo exactamente TOTAL (40 s).
const T = TRANSITION;
const timing = linearTiming({
  durationInFrames: T,
  easing: Easing.bezier(0.7, 0, 0.3, 1),
});

export const Reel: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    <Audio src={staticFile("sfx/drone.wav")} volume={VOICE ? 0.22 : 0.5} />
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
        durationInFrames={SCENES.importa + T}
      >
        <Importa />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={zoomThrough()}
        timing={timing}
      />
      <TransitionSeries.Sequence name="Cierre" durationInFrames={SCENES.cierre}>
        <Cierre />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Sequence
      name="Cabecera"
      durationInFrames={TOTAL - SCENES.cierre}
      layout="none"
    >
      <Chrome total={TOTAL - SCENES.cierre} />
    </Sequence>
    <FilmLook />
  </AbsoluteFill>
);
