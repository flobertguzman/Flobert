import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { C, CLAMP, sans } from "../theme";
import { Flash, glitchShadow, Words } from "../motion";
import { Rise, Scene, Sfx } from "../ui";

const HIT = 30;

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <Scene
        camera={{
          zoom: [1.14, 1.0],
          settle: 28,
          roll: [-2.2, 0],
          pan: [
            [0, 60],
            [0, 0],
          ],
          shakes: [{ at: HIT, power: 1.5 }],
        }}
      >
        <Sfx at={0} src="boom" volume={0.9} />
        <Sfx at={HIT} src="hit" volume={0.8} />
        <div
          style={{
            fontFamily: sans,
            fontWeight: 600,
            fontSize: 104,
            lineHeight: 1.03,
            letterSpacing: -4.4,
            whiteSpace: "nowrap",
          }}
        >
          <div>
            <Words text="El hombre detrás" at={2} stagger={4} />
          </div>
          <div>
            <Words text="del boom de la IA" at={12} stagger={4} />
          </div>
          <div
            style={{
              color: C.red,
              textShadow: glitchShadow(frame, HIT, 12),
              scale: interpolate(
                frame,
                [HIT, HIT + 4, HIT + 14],
                [1.06, 0.985, 1],
                {
                  ...CLAMP,
                  easing: Easing.out(Easing.quad),
                },
              ),
              transformOrigin: "0% 50%",
              opacity: frame < HIT ? 0 : 1,
            }}
          >
            acaba de renunciar.
          </div>
        </div>
        <div
          style={{
            height: 5,
            background: C.red,
            borderRadius: 3,
            marginTop: 40,
            boxShadow: `0 0 24px ${C.red}`,
            width: `${interpolate(frame, [HIT + 4, HIT + 26], [0, 100], {
              ...CLAMP,
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            })}%`,
          }}
        />
        <Rise at={62} style={{ marginTop: 54 }}>
          <div
            style={{
              fontSize: 62,
              fontWeight: 600,
              letterSpacing: -2,
              color: C.ink,
            }}
          >
            Jensen Huang deja Nvidia.
          </div>
        </Rise>
        <Rise at={72} style={{ marginTop: 14 }}>
          <div
            style={{
              fontSize: 46,
              color: C.inkS,
              letterSpacing: -1,
              lineHeight: 1.3,
            }}
          >
            Tras 33 años al mando. Esto es lo que se sabe.
          </div>
        </Rise>
      </Scene>
      <Flash at={HIT} peak={0.3} />
    </>
  );
};
