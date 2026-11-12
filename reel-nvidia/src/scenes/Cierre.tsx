import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { BRAND, CLAMP } from "../theme";
import { Camera } from "../motion";
import { Sfx } from "../ui";

const OUT = Easing.bezier(0.16, 1, 0.3, 1);

/**
 * Cierre: placa clara con el logo de la marca en sus colores originales
 * (el azul marino del logo no se lee sobre el fondo oscuro del reel).
 */
export const Cierre: React.FC = () => {
  const frame = useCurrentFrame();
  if (!BRAND.logo) return null;
  return (
    <AbsoluteFill style={{ background: "#f7f8f8" }}>
      <Camera move={{ zoom: [1.1, 1.0], settle: 34 }}>
        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <Sfx at={6} src="confirm" volume={0.7} />
          <div
            style={{
              position: "relative",
              width: 780,
              clipPath: `inset(0 ${interpolate(frame, [4, 26], [100, 0], {
                ...CLAMP,
                easing: OUT,
              })}% 0 0)`,
              filter: `blur(${interpolate(frame, [4, 22], [14, 0], CLAMP)}px)`,
              translate: interpolate(frame, [4, 30], ["0px 30px", "0px 0px"], {
                ...CLAMP,
                easing: OUT,
              }),
            }}
          >
            <Img
              src={staticFile(BRAND.logo)}
              style={{ width: "100%", display: "block" }}
            />
            {/* Brillo que cruza el logo una vez */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(105deg, transparent 35%, rgba(255,255,255,.75) 50%, transparent 65%)",
                backgroundSize: "260% 100%",
                backgroundPosition: `${interpolate(frame, [30, 60], [130, -30], CLAMP)}% 0`,
                mixBlendMode: "screen",
                WebkitMaskImage: `url(${staticFile(BRAND.logo)})`,
                WebkitMaskSize: "100% 100%",
                maskImage: `url(${staticFile(BRAND.logo)})`,
                maskSize: "100% 100%",
              }}
            />
          </div>
        </AbsoluteFill>
      </Camera>
    </AbsoluteFill>
  );
};
