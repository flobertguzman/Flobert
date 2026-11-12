import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, Series, staticFile } from "remotion";
import { Cierre } from "./scenes/Cierre";
import { Hook } from "./scenes/Hook";
import { Importa } from "./scenes/Importa";
import { Mercado } from "./scenes/Mercado";
import { PorQue } from "./scenes/PorQue";
import { QuePaso } from "./scenes/QuePaso";
import { Relevo } from "./scenes/Relevo";
import { SCENES, TOTAL } from "./theme";
import { Backdrop, Chrome } from "./ui";

export const Reel: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    <Audio src={staticFile("sfx/drone.wav")} volume={0.5} />
    <Series>
      <Series.Sequence name="Hook" durationInFrames={SCENES.hook}>
        <Hook />
      </Series.Sequence>
      <Series.Sequence name="Qué pasó" durationInFrames={SCENES.quePaso}>
        <QuePaso />
      </Series.Sequence>
      <Series.Sequence name="Por qué" durationInFrames={SCENES.porQue}>
        <PorQue />
      </Series.Sequence>
      <Series.Sequence name="Mercado" durationInFrames={SCENES.mercado}>
        <Mercado />
      </Series.Sequence>
      <Series.Sequence name="Relevo" durationInFrames={SCENES.relevo}>
        <Relevo />
      </Series.Sequence>
      <Series.Sequence name="Importa" durationInFrames={SCENES.importa}>
        <Importa />
      </Series.Sequence>
      <Series.Sequence name="Cierre" durationInFrames={SCENES.cierre}>
        <Cierre />
      </Series.Sequence>
    </Series>
    <Sequence
      name="Cabecera"
      durationInFrames={TOTAL - SCENES.cierre}
      layout="none"
    >
      <Chrome total={TOTAL - SCENES.cierre} />
    </Sequence>
  </AbsoluteFill>
);
