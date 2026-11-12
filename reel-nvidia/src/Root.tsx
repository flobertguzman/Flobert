import React from "react";
import { Composition, Still } from "remotion";
import { Portada } from "./Portada";
import { Reel } from "./Reel";
import { FPS, TOTAL } from "./theme";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Reel"
      component={Reel}
      durationInFrames={TOTAL}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Still id="Portada" component={Portada} width={1080} height={1920} />
  </>
);
