import React from "react";
import { C } from "../theme";
import { Headline, Panel, Pill, Rise, Scene, Sfx } from "../ui";

const ITEMS = [
  {
    t: "Relaciones extramatrimoniales",
    s: "reveladas por The New York Times",
  },
  {
    t: "Una, con una presunta espía china",
    s: "según sospechas de la inteligencia de EE. UU.",
  },
  {
    t: "La junta ya lo investigaba",
    s: "con un comité independiente y abogados externos",
  },
];

export const PorQue: React.FC = () => (
  <Scene
    camera={{
      zoom: [1.0, 1.06],
      roll: [-0.8, 0.5],
      pan: [
        [24, 10],
        [-24, -10],
      ],
      shakes: [
        { at: 72, power: 0.3 },
        { at: 142, power: 0.45 },
        { at: 180, power: 0.3 },
      ],
    }}
    eyebrow="El contexto"
    source="The New York Times, CNN y CNBC (11–12/11/2026). Reportes de prensa."
  >
    <Sfx at={0} src="hit" volume={0.5} />
    <Headline a="Nvidia calló." b="La prensa no." />
    <Rise at={24} style={{ marginTop: 44 }}>
      <Panel
        title="según reportes de prensa"
        right={<Pill>No confirmado por Nvidia</Pill>}
      >
        <div style={{ padding: "4px 34px" }}>
          {ITEMS.map((it, i) => (
            <Rise
              key={it.t}
              at={[72, 142, 180][i]}
              y={26}
              style={{
                display: "grid",
                gridTemplateColumns: "70px 1fr",
                padding: "30px 0",
                borderBottom: i < 2 ? `1.5px solid ${C.hair}` : "none",
              }}
            >
              <Sfx at={[72, 142, 180][i]} src="switch" volume={0.4} />
              <span style={{ fontSize: 46, fontWeight: 600, color: C.accH }}>
                {i + 1}
              </span>
              <div>
                <div
                  style={{
                    fontSize: 46,
                    fontWeight: 600,
                    letterSpacing: -1.4,
                    lineHeight: 1.15,
                  }}
                >
                  {it.t}
                </div>
                <div
                  style={{
                    fontSize: 38,
                    color: C.inkS,
                    marginTop: 8,
                    lineHeight: 1.3,
                  }}
                >
                  {it.s}
                </div>
              </div>
            </Rise>
          ))}
        </div>
      </Panel>
    </Rise>
    <Rise
      at={198}
      style={{
        marginTop: 36,
        fontSize: 40,
        color: C.inkM,
        letterSpacing: -0.8,
        lineHeight: 1.3,
      }}
    >
      Varios legisladores ya pedían su salida.
    </Rise>
  </Scene>
);
