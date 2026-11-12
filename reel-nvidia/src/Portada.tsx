import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Backdrop, FilmLook } from "./motion";
import { BRAND, C, mono, sans } from "./theme";

// Trazo ilustrativo de la caída (no es la serie real de precios).
const LINE =
  "M0,90 L80,78 L160,96 L240,72 L320,88 L400,70 L480,92 L560,80 L620,100 L680,250 L740,330 L820,300 L900,370 L980,350 L1080,400";

/**
 * Portada del reel (1080×1920). Lo esencial va dentro del recorte 3:4
 * (1080×1440, centrado) que Instagram muestra en la cuadrícula del perfil.
 */
export const Portada: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: sans, color: C.ink }}>
    <Backdrop />
    {/* Gráfica de caída, de fondo */}
    <svg
      viewBox="0 0 1080 480"
      style={{
        position: "absolute",
        left: 0,
        top: 1250,
        width: 1080,
        opacity: 0.9,
      }}
    >
      <defs>
        <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(235,87,87,.35)" />
          <stop offset="100%" stopColor="rgba(235,87,87,0)" />
        </linearGradient>
      </defs>
      <path d={`${LINE} L1080,480 L0,480 Z`} fill="url(#fill)" />
      <path
        d={LINE}
        fill="none"
        stroke={C.red}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 18px ${C.red})` }}
      />
      <circle cx="1072" cy="400" r="14" fill={C.red} />
    </svg>

    <AbsoluteFill style={{ padding: "300px 80px 0" }}>
      {/* Etiqueta */}
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            background: C.red,
            color: "#fff",
            fontWeight: 600,
            fontSize: 36,
            letterSpacing: 0.5,
            borderRadius: 12,
            padding: "12px 24px",
          }}
        >
          <i
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "#fff",
            }}
          />
          ÚLTIMA HORA
        </span>
        <span style={{ fontFamily: mono, fontSize: 30, color: C.inkS }}>
          12 NOV 2026
        </span>
      </div>

      {/* Titular */}
      <div
        style={{
          marginTop: 56,
          fontWeight: 600,
          fontSize: 148,
          lineHeight: 0.98,
          letterSpacing: -7,
        }}
      >
        Jensen Huang
        <br />
        <span style={{ color: C.red }}>renuncia</span>
        <br />a Nvidia.
      </div>

      <div
        style={{
          marginTop: 40,
          fontSize: 52,
          fontWeight: 500,
          letterSpacing: -1.6,
          color: C.inkM,
          lineHeight: 1.2,
        }}
      >
        Tras 33 años al mando.
        <br />
        <span style={{ color: C.inkS }}>¿Qué pasa ahora con la IA?</span>
      </div>

      {/* Dato */}
      <div
        style={{
          marginTop: 60,
          display: "inline-flex",
          alignSelf: "flex-start",
          alignItems: "baseline",
          gap: 20,
          background: "#0f1011",
          border: `2px solid ${C.hair2}`,
          borderRadius: 24,
          padding: "22px 32px",
        }}
      >
        <span
          style={{
            fontSize: 88,
            fontWeight: 600,
            letterSpacing: -4,
            color: C.red,
          }}
        >
          ≈−10%
        </span>
        <span style={{ fontSize: 34, color: C.inkS, lineHeight: 1.25 }}>
          la acción
          <br />
          en un día
        </span>
      </div>
    </AbsoluteFill>

    <FilmLook />

    {/* Marca */}
    {BRAND.logo ? (
      <div
        style={{
          position: "absolute",
          left: "50%",
          translate: "-50% 0",
          bottom: 300,
          background: "#f7f8f8",
          borderRadius: 999,
          padding: "20px 44px",
          boxShadow: "0 10px 40px rgba(0,0,0,.45)",
        }}
      >
        <Img
          src={staticFile(BRAND.logo)}
          style={{ height: 64, display: "block" }}
        />
      </div>
    ) : null}
  </AbsoluteFill>
);
