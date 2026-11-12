import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { C, CLAMP, mono } from "../theme";
import { Flash } from "../motion";
import { Headline, Panel, Pill, Rise, Scene, Sfx } from "../ui";

// Trazo ilustrativo de la caída del día (no es la serie real de precios).
const LINE =
  "M0,38 L60,32 L120,42 L180,30 L240,40 L300,34 L360,44 L420,36 L470,46 L520,104 L570,138 L630,128 L690,150 L750,142 L810,158 L860,152";

const TICKERS = [
  { n: "AMD", v: "+3%", up: true },
  { n: "Broadcom", v: "+6%", up: true },
  { n: "CoreWeave", v: "−12%", up: false },
  { n: "Nebius", v: "−19%", up: false },
];

export const Mercado: React.FC = () => {
  const frame = useCurrentFrame();
  const drop = interpolate(frame, [44, 92], [0, 10], {
    ...CLAMP,
    easing: Easing.bezier(0.5, 0, 0.2, 1),
  });
  return (
    <>
      <Scene
        camera={{
          zoom: [1.01, 1.07],
          roll: [0.6, -0.6],
          pan: [
            [0, 30],
            [0, -15],
          ],
          shakes: [{ at: 92, power: 1.4 }],
        }}
        eyebrow="El mercado"
        source="CNBC y Yahoo Finance (12/11/2026). Suben rivales, caen socios."
      >
        <Sfx at={0} src="hit" volume={0.5} />
        <Sfx at={74} src="swell" volume={0.5} />
        <Headline a="Wall Street" b="no esperó." />
        <Rise at={20} style={{ marginTop: 34 }}>
          <Panel
            title="NVDA · 12 nov 2026"
            right={<Pill tone="red">En caída</Pill>}
          >
            <div style={{ padding: "26px 34px 22px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    fontSize: 160,
                    fontWeight: 600,
                    letterSpacing: -8,
                    lineHeight: 0.9,
                    color: C.red,
                  }}
                >
                  ≈−{Math.round(drop)}%
                </div>
                <div
                  style={{
                    textAlign: "right",
                    fontFamily: mono,
                    fontSize: 26,
                    color: C.inkS,
                    lineHeight: 1.5,
                  }}
                >
                  acción de
                  <br />
                  Nvidia hoy
                </div>
              </div>
              <svg
                viewBox="0 0 860 170"
                style={{ width: "100%", marginTop: 22, display: "block" }}
              >
                <line
                  x1="0"
                  y1="38"
                  x2="860"
                  y2="38"
                  stroke={C.hair2}
                  strokeWidth="2"
                  strokeDasharray="8 10"
                />
                <path
                  d={LINE}
                  fill="none"
                  stroke={C.red}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset={interpolate(frame, [30, 92], [1, 0], {
                    ...CLAMP,
                    easing: Easing.bezier(0.5, 0, 0.2, 1),
                  })}
                />
              </svg>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                borderTop: `1.5px solid ${C.hair}`,
                background: C.s2,
                opacity: interpolate(frame, [96, 106], [0, 1], CLAMP),
              }}
            >
              <div
                style={{
                  padding: "24px 34px",
                  borderRight: `1.5px solid ${C.hair}`,
                }}
              >
                <div style={{ fontFamily: mono, fontSize: 24, color: C.inkT }}>
                  Valor de mercado
                </div>
                <div
                  style={{
                    fontSize: 46,
                    fontWeight: 600,
                    letterSpacing: -1.6,
                    marginTop: 6,
                  }}
                >
                  &lt; US$4 billones
                </div>
              </div>
              <div style={{ padding: "24px 34px" }}>
                <div style={{ fontFamily: mono, fontSize: 24, color: C.inkT }}>
                  Último mes
                </div>
                <div
                  style={{
                    fontSize: 46,
                    fontWeight: 600,
                    letterSpacing: -1.6,
                    marginTop: 6,
                  }}
                >
                  más de −20%
                </div>
              </div>
            </div>
          </Panel>
        </Rise>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 18,
            marginTop: 22,
          }}
        >
          {TICKERS.map((t, i) => (
            <Rise key={t.n} at={100 + i * 6} y={24}>
              <Sfx at={100 + i * 6} src="tick" volume={0.5} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: C.s1,
                  border: `1.5px solid ${C.hair}`,
                  borderRadius: 20,
                  padding: "22px 28px",
                }}
              >
                <span
                  style={{ fontSize: 38, fontWeight: 500, letterSpacing: -0.8 }}
                >
                  {t.n}
                </span>
                <span
                  style={{
                    fontSize: 44,
                    fontWeight: 600,
                    letterSpacing: -1.4,
                    color: t.up ? "#4cd26a" : "#ff8a8a",
                  }}
                >
                  {t.v}
                </span>
              </div>
            </Rise>
          ))}
        </div>
      </Scene>
      <Flash at={92} color="#eb5757" peak={0.28} />
    </>
  );
};
