import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { C, CLAMP } from "../theme";
import { Headline, Panel, Pill, Rise, Scene, Sfx } from "../ui";

const ROLES = ["Presidente", "Director ejecutivo (CEO)", "Miembro de la junta"];

export const QuePaso: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Scene
      eyebrow="Qué pasó"
      source="Nvidia, comunicado y formulario 8-K (12/11/2026)."
    >
      <Sfx at={0} src="hit" volume={0.5} />
      <Headline a="Deja todos" b="sus cargos. Ya." />
      <Rise at={22} style={{ marginTop: 44 }}>
        <Panel
          title="comunicado · nvidia"
          right={<Pill tone="red">Efecto inmediato</Pill>}
        >
          <div style={{ padding: "6px 34px" }}>
            {ROLES.map((role, i) => {
              const at = 36 + i * 13;
              return (
                <div
                  key={role}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "28px 0",
                    borderBottom: i < 2 ? `1.5px solid ${C.hair}` : "none",
                    opacity: interpolate(frame, [at - 8, at], [0, 1], CLAMP),
                  }}
                >
                  <Sfx at={at} src="switch" volume={0.45} />
                  <span
                    style={{
                      position: "relative",
                      fontSize: 46,
                      fontWeight: 500,
                      letterSpacing: -1,
                    }}
                  >
                    {role}
                    <i
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "54%",
                        height: 4,
                        background: C.red,
                        borderRadius: 2,
                        width: `${interpolate(frame, [at, at + 12], [0, 100], {
                          ...CLAMP,
                          easing: Easing.bezier(0.16, 1, 0.3, 1),
                        })}%`,
                      }}
                    />
                  </span>
                  <span
                    style={{
                      opacity: interpolate(
                        frame,
                        [at + 6, at + 14],
                        [0, 1],
                        CLAMP,
                      ),
                    }}
                  >
                    <Pill tone="red">Renunció</Pill>
                  </span>
                </div>
              );
            })}
          </div>
        </Panel>
      </Rise>
      <Rise
        at={86}
        style={{
          marginTop: 48,
          display: "flex",
          alignItems: "flex-end",
          gap: 30,
        }}
      >
        {[90, 98, 106, 114].map((t) => (
          <Sfx key={t} at={t} src="tick" volume={0.5} />
        ))}
        <div
          style={{
            fontSize: 230,
            fontWeight: 600,
            letterSpacing: -12,
            lineHeight: 0.86,
            color: C.accH,
          }}
        >
          {Math.round(
            interpolate(frame, [88, 122], [0, 33], {
              ...CLAMP,
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          )}
        </div>
        <div style={{ paddingBottom: 10 }}>
          <div style={{ fontSize: 62, fontWeight: 600, letterSpacing: -2 }}>
            años
          </div>
          <div
            style={{
              fontSize: 42,
              color: C.inkS,
              marginTop: 6,
              lineHeight: 1.3,
            }}
          >
            al frente de la empresa
            <br />
            que cofundó en 1993
          </div>
        </div>
      </Rise>
    </Scene>
  );
};
