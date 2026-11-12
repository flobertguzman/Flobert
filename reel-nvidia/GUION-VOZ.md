# Guion de voz: reel Nvidia (36,5 s)

Voz: tu voz clonada en Magnific ("Flobert (HEAVY)"), modelo ElevenLabs v4, acelerada a 1.04×.
Los audios originales están en `public/voz/raw/` y la pista final sincronizada en `public/voz/voz.wav`.

| Entra en | Escena | Texto |
|---|---|---|
| 0:00 | Gancho | El hombre detrás del boom de la inteligencia artificial... acaba de renunciar. |
| 0:05 | Qué pasó | Jensen Huang deja Nvidia, con efecto inmediato, tras treinta y tres años al mando. |
| 0:11 | Contexto | Nvidia no dijo por qué. Pero la prensa reporta relaciones extramatrimoniales... una, con una presunta espía china. |
| 0:19 | Mercado | Wall Street no esperó: la acción cayó casi un diez por ciento. |
| 0:24 | Relevo | Colette Kress, su directora financiera, queda como CEO interina. |
| 0:29 | Por qué importa | Toda la IA corre sobre sus chips. ¿Nvidia sin Jensen... sigue siendo Nvidia? |

Para cambiar la voz: reemplaza `public/voz/voz.wav` (36,5 s, con cada línea en su tiempo) y vuelve a renderizar.
Para quitarla: en `src/theme.ts` pon `VOICE = null`.
