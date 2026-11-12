import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { BRAND, C, CLAMP, mono, sans } from "../theme";
import { Rise, Sfx } from "../ui";
import { Camera } from "../motion";

export const Cierre: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Camera move={{ zoom: [1.2, 1.0], settle: 34, roll: [1.5, 0] }}>
      <AbsoluteFill
        style={{
          fontFamily: sans,
          color: C.ink,
          alignItems: "center",
          justifyContent: "center",
          padding: "0 80px",
          textAlign: "center",
        }}
      >
        <Sfx at={6} src="confirm" volume={0.7} />
        <div
          style={{
            scale: interpolate(frame, [4, 26], [0.7, 1], {
              ...CLAMP,
              easing: Easing.bezier(0.34, 1.4, 0.64, 1),
            }),
            opacity: interpolate(frame, [4, 14], [0, 1], CLAMP),
            filter: `blur(${interpolate(frame, [4, 20], [16, 0], CLAMP)}px) drop-shadow(0 0 ${30 + Math.sin(frame / 8) * 14}px rgba(94,106,210,.55))`,
          }}
        >
          {BRAND.logo ? (
            <Img
              src={staticFile(BRAND.logo)}
              style={{ width: 360, height: 360, objectFit: "contain" }}
            />
          ) : (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 22,
                fontSize: 104,
                fontWeight: 600,
                letterSpacing: -4.5,
              }}
            >
              <i
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: C.acc,
                }}
              />
              {BRAND.handle}
            </div>
          )}
        </div>
        <Rise
          at={30}
          style={{
            marginTop: 54,
            fontSize: 52,
            fontWeight: 500,
            letterSpacing: -1.6,
            lineHeight: 1.2,
          }}
        >
          {BRAND.tagline}
        </Rise>
        <Rise at={44} style={{ marginTop: 40 }}>
          <span
            style={{
              display: "inline-block",
              background: C.ink,
              color: "#000",
              borderRadius: 14,
              padding: "20px 38px",
              fontSize: 40,
              fontWeight: 600,
              letterSpacing: -0.8,
            }}
          >
            Síguenos {BRAND.logo ? BRAND.handle : ""}
          </span>
        </Rise>
        <Rise
          at={58}
          style={{
            marginTop: 70,
            fontFamily: mono,
            fontSize: 24,
            color: C.inkT,
            lineHeight: 1.6,
          }}
        >
          Fuentes: Nvidia · NYT · CNN · CNBC · Yahoo Finance
          <br />
          Datos al 12/11/2026. No es asesoría financiera.
        </Rise>
      </AbsoluteFill>
    </Camera>
  );
};
