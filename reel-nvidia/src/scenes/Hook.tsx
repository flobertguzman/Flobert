import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { C, CLAMP, sans } from "../theme";
import { Rise, Scene, Sfx } from "../ui";

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Scene>
      <Sfx at={0} src="boom" volume={0.9} />
      <Sfx at={34} src="hit" volume={0.7} />
      <div
        style={{
          fontFamily: sans,
          fontWeight: 600,
          fontSize: 104,
          whiteSpace: "nowrap",
          lineHeight: 1.02,
          letterSpacing: -5,
        }}
      >
        <Rise at={4}>El hombre detrás</Rise>
        <Rise at={14}>del boom de la IA</Rise>
        <Rise at={30} style={{ color: C.red }}>
          acaba de renunciar.
        </Rise>
      </div>
      <div
        style={{
          height: 4,
          background: C.red,
          borderRadius: 2,
          marginTop: 40,
          width: `${interpolate(frame, [36, 60], [0, 100], {
            ...CLAMP,
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          })}%`,
        }}
      />
      <Rise at={62} style={{ marginTop: 54 }}>
        <div
          style={{
            fontSize: 60,
            fontWeight: 600,
            letterSpacing: -2,
            color: C.ink,
          }}
        >
          Jensen Huang deja Nvidia.
        </div>
        <div
          style={{
            fontSize: 46,
            color: C.inkS,
            marginTop: 14,
            letterSpacing: -1,
          }}
        >
          Tras 33 años al mando. Esto es lo que se sabe.
        </div>
      </Rise>
    </Scene>
  );
};
