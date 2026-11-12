import React from "react";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
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
import { BRAND, MUSIC, SCENES, TOTAL, TRANSITION, VOICE } from "./theme";
import { Cierre } from "./scenes/Cierre";
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
    {/* Instrumental dramático (Magnific / ElevenLabs Music), ya mezclado
        con compresión lateral para que baje cuando habla la voz. */}
    <Audio src={staticFile(MUSIC)} volume={1} />
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
        durationInFrames={SCENES.importa + (BRAND.logo ? T : 0)}
      >
        <Importa />
      </TransitionSeries.Sequence>
      {BRAND.logo ? (
        <TransitionSeries.Transition
          presentation={zoomThrough()}
          timing={timing}
        />
      ) : null}
      {BRAND.logo ? (
        <TransitionSeries.Sequence
          name="Cierre"
          durationInFrames={SCENES.cierre}
        >
          <Cierre />
        </TransitionSeries.Sequence>
      ) : null}
    </TransitionSeries>
    <Sequence
      name="Cabecera"
      durationInFrames={TOTAL - SCENES.cierre}
      layout="none"
    >
      <Chrome total={TOTAL - SCENES.cierre} />
    </Sequence>
    <Sequence
      name="Grano y viñeta"
      durationInFrames={TOTAL - SCENES.cierre}
      layout="none"
    >
      <FilmLook />
    </Sequence>
    {BRAND.logo ? null : <FadeOut frames={20} />}
  </AbsoluteFill>
);
