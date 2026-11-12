import React from "react";
import { C, mono } from "../theme";
import { Headline, Rise, Scene, Sfx } from "../ui";

const STATS = [
  { v: "US$96.2 mil M", l: "vendió Nvidia en su último trimestre" },
  { v: "~US$730 mil M", l: "invertirán 4 gigantes tecnológicas en IA en 2026" },
];

export const Importa: React.FC = () => (
  <Scene
    eyebrow="Por qué importa"
    source="Nvidia, 2T año fiscal 2027; guías de capex 3T 2026 de Amazon, Alphabet, Microsoft y Meta."
  >
    <Sfx at={0} src="hit" volume={0.5} />
    <Sfx at={62} src="boom" volume={0.6} />
    <Headline a="Toda la IA corre" b="sobre sus chips." />
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 18,
        marginTop: 40,
      }}
    >
      {STATS.map((s, i) => (
        <Rise key={s.v} at={18 + i * 12}>
          <div
            style={{
              background: C.s1,
              border: `1.5px solid ${C.hair}`,
              borderRadius: 24,
              padding: "26px 34px",
            }}
          >
            <div
              style={{
                fontSize: 76,
                fontWeight: 600,
                letterSpacing: -3.4,
                color: i === 0 ? C.accH : C.ink,
              }}
            >
              {s.v}
            </div>
            <div style={{ fontSize: 40, color: C.inkS, marginTop: 4 }}>
              {s.l}
            </div>
          </div>
        </Rise>
      ))}
    </div>
    <Rise at={62} style={{ marginTop: 34 }}>
      <div
        style={{
          position: "relative",
          background: C.s2,
          border: `1.5px solid ${C.hair2}`,
          borderRadius: 24,
          padding: "34px 34px 34px 64px",
        }}
      >
        <i
          style={{
            position: "absolute",
            left: 32,
            top: 34,
            bottom: 34,
            width: 6,
            borderRadius: 3,
            background: C.acc,
          }}
        />
        <div style={{ fontFamily: mono, fontSize: 26, color: C.inkT }}>
          La pregunta
        </div>
        <div
          style={{
            fontSize: 68,
            fontWeight: 600,
            letterSpacing: -2.8,
            lineHeight: 1.08,
            marginTop: 10,
          }}
        >
          ¿Nvidia sin Jensen sigue siendo Nvidia?
        </div>
      </div>
    </Rise>
  </Scene>
);
