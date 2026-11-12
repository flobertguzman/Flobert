import React from "react";
import { C, mono } from "../theme";
import { Headline, Pill, Rise, Scene, Sfx } from "../ui";

const PEOPLE = [
  {
    i: "CK",
    n: "Colette Kress",
    r: "CEO interina. Sigue también como directora financiera.",
    p: "Interina",
  },
  {
    i: "HJ",
    n: "Harvey C. Jones",
    r: "Primer presidente de la junta en la historia de Nvidia.",
    p: "Nuevo cargo",
  },
];

export const Relevo: React.FC = () => (
  <Scene
    camera={{
      zoom: [1.1, 1.0],
      pan: [
        [-40, 0],
        [30, 0],
      ],
      roll: [0.8, -0.3],
    }}
    eyebrow="El relevo"
    source="Nvidia, comunicado y formulario 8-K (12/11/2026)."
  >
    <Sfx at={0} src="hit" volume={0.5} />
    <Headline a="¿Quién manda" b="ahora?" />
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        marginTop: 44,
      }}
    >
      {PEOPLE.map((p, i) => (
        <Rise key={p.n} at={22 + i * 24}>
          <Sfx at={22 + i * 24} src="switch" volume={0.4} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "130px 1fr",
              gap: 30,
              alignItems: "center",
              background: C.s1,
              border: `1.5px solid ${C.hair}`,
              borderRadius: 28,
              padding: "32px 34px",
              boxShadow: "inset 0 1.5px 0 rgba(255,255,255,.05)",
            }}
          >
            <div
              style={{
                width: 130,
                height: 130,
                borderRadius: "50%",
                background: C.s3,
                border: `1.5px solid ${C.hair2}`,
                display: "grid",
                placeItems: "center",
                fontFamily: mono,
                fontSize: 42,
                fontWeight: 500,
                color: C.inkM,
              }}
            >
              {p.i}
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{ fontSize: 52, fontWeight: 600, letterSpacing: -1.8 }}
                >
                  {p.n}
                </span>
                <Pill tone={i === 0 ? "acc" : "neutral"} size={26}>
                  {p.p}
                </Pill>
              </div>
              <div
                style={{
                  fontSize: 40,
                  color: C.inkS,
                  marginTop: 10,
                  lineHeight: 1.3,
                }}
              >
                {p.r}
              </div>
            </div>
          </div>
        </Rise>
      ))}
      <Rise at={84}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            border: `1.5px dashed ${C.hair2}`,
            borderRadius: 28,
            padding: "30px 34px",
          }}
        >
          <div>
            <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: -1.4 }}>
              CEO permanente
            </div>
            <div style={{ fontSize: 38, color: C.inkS, marginTop: 6 }}>
              Candidatos internos y externos
            </div>
          </div>
          <Pill size={26}>Búsqueda abierta</Pill>
        </div>
      </Rise>
    </div>
  </Scene>
);
