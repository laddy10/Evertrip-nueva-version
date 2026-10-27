# SEO Change Log — EverTrip

## 2026-10-27 — Tarea #1: Optimización SERP Ruta Palomino - Valledupar

- **Date and client/site:** 2026-10-27 | evertripviajes.com
- **Task / approval reference:** Aprobación explícita en chat por el usuario para optimización de snippet SERP en `/es/palomino-to-valledupar/`.
- **URL(s) or system affected:** `https://evertripviajes.com/es/palomino-to-valledupar/` (`src/data/routes.ts`)
- **Before:**
  - Title (es): `"Transporte privado Palomino - Valledupar | EverTrip"`
  - Meta Description (es): `"Traslado privado entre Palomino y Valledupar con recogida en hotel, dirección o punto accesible. Equipaje y paradas coordinadas por WhatsApp."`
- **After:**
  - Title (es): `"Transporte Palomino a Valledupar Puerta a Puerta | EverTrip"`
  - Meta Description (es): `"Servicio privado puerta a puerta entre Palomino y Valledupar. Vehículos climatizados, paradas flexibles y cotización inmediata por WhatsApp con EverTrip."`
- **Evidence and rationale:** GSC mostró 28 impresiones y 0 clics (0% CTR) con posición promedio 9.0 en primera página para la consulta *"palomino a valledupar"*. El snippet anterior carecía de intención transaccional clara (*"puerta a puerta"*, *"cotización inmediata"*).
- **Validation performed and result:** `npx tsc --noEmit` verificado con 0 errores en `src/`. Modificación limpia en `src/data/routes.ts`.
- **Backup / rollback:** Valores previos preservados en este log y en el historial de Git.
- **GSC baseline and period:** 0 clics / 28 impresiones / 0% CTR / Posición 9.0 (Periodo: 29 sep – 27 oct 2026).
- **GA4 baseline and period:** 0 sesiones (Propiedad creada el 2026-10-27).
- **Follow-up date:** 2026-11-27 (30 días de observación tras indexación).
- **Observed result:** Pendiente de recolección en fecha de seguimiento.
- **Limitations (seasonality, delay, tracking, attribution):** Google puede demorar entre 7 y 14 días en re-rastrear y actualizar el snippet en las SERPs.

## 2026-10-27 — Tarea #2: Optimización SERP Ruta Valledupar - Minca

- **Date and client/site:** 2026-10-27 | evertripviajes.com
- **Task / approval reference:** Aprobación explícita en chat por el usuario para optimización de snippet SERP en `/es/valledupar-to-minca/`.
- **URL(s) or system affected:** `https://evertripviajes.com/es/valledupar-to-minca/` (`src/data/routes.ts`)
- **Before:**
  - Title (es): `"Transporte privado Valledupar - Minca | EverTrip"`
  - Meta Description (es): `"Traslado privado entre Valledupar y Minca con recogida en hotel, dirección o punto accesible. Equipaje, paradas coordinadas y acceso según la vía."`
- **After:**
  - Title (es): `"Transporte Valledupar a Minca Puerta a Puerta | EverTrip"`
  - Meta Description (es): `"Viaja cómodo y directo entre Valledupar y Minca. Vehículos climatizados puerta a puerta, paradas coordinadas y reserva rápida por WhatsApp con EverTrip."`
- **Evidence and rationale:** GSC mostró 11 impresiones y 0 clics (0% CTR) con posición promedio 6.4 en primera página. El snippet anterior no comunicaba el beneficio clave de climatización ni la inmediatez de cotización puerta a puerta frente a opciones públicas complejas.
- **Validation performed and result:** `src/data/routes.ts` actualizado limpiamente.
- **Backup / rollback:** Valores previos preservados en este log y en el historial de Git.
- **GSC baseline and period:** 0 clics / 11 impresiones / 0% CTR / Posición 6.4 (Periodo: 29 sep – 27 oct 2026).
- **GA4 baseline and period:** 0 sesiones (Propiedad creada el 2026-10-27).
- **Follow-up date:** 2026-11-27 (30 días de observación tras indexación).
- **Observed result:** Pendiente de recolección en fecha de seguimiento.
- **Limitations (seasonality, delay, tracking, attribution):** Google puede demorar entre 7 y 14 días en re-rastrear y actualizar el snippet en las SERPs.

## 2026-10-27 — Tarea #3: Optimización SERP y Relevancia Local en Homepage

- **Date and client/site:** 2026-10-27 | evertripviajes.com
- **Task / approval reference:** Aprobación explícita en chat por el usuario para alinear el título y meta descripción de la Home con la intención de búsqueda local y de IA ("Transporte privado Santa Marta", "traslados puerta a puerta").
- **URL(s) or system affected:** `https://evertripviajes.com/` y `https://evertripviajes.com/es/` (`src/app/[locale]/layout.tsx` y `src/app/(root)/layout.tsx`)
- **Before:**
  - Title (es): `"Transporte privado y tours en el Caribe colombiano | EverTrip"`
  - Meta Description (es): `"Traslados privados puerta a puerta y experiencias turísticas por el Caribe colombiano. Explora rutas, tours y cotiza por WhatsApp con EverTrip."`
  - Title (en): `"Private transfers and tours in the Colombian Caribbean | EverTrip"`
- **After:**
  - Title (es): `"Transporte Privado en Santa Marta y Traslados Caribe | EverTrip"`
  - Meta Description (es): `"Transporte privado puerta a puerta en Santa Marta y el Caribe. Traslados a aeropuertos, Palomino, Tayrona, Minca y Cartagena. Cotiza por WhatsApp con EverTrip."`
  - Title (en): `"Private Transfers in Santa Marta & Caribbean Tours | EverTrip"`
  - Meta Description (en): `"Private door-to-door transportation in Santa Marta and the Caribbean. Airport transfers to Palomino, Tayrona, Minca & Cartagena. Book via WhatsApp with EverTrip."`
- **Evidence and rationale:** Búsqueda en Google de *"transporte santa marta"* y *"viajes privados santa marta"* confirmó que los 3 competidores en Top 1-3 (SMR Travel, Bukap, RTC) y las sugerencias de la IA de Google (AI Overview) incluyen la ciudad ancla "Santa Marta" y "puerta a puerta". El título anterior de EverTrip era demasiado genérico a nivel regional.
- **Validation performed and result:** `src/app/[locale]/layout.tsx` y `src/app/(root)/layout.tsx` actualizados y validados sintácticamente.
- **Backup / rollback:** Valores previos preservados en este log y en el historial de Git.
- **GSC baseline and period:** 2 clics / 20 impresiones / 10% CTR / Posición 3.1 para la Home `/es/` (Periodo: 29 sep – 27 oct 2026).
- **GA4 baseline and period:** 0 sesiones (Propiedad creada el 2026-10-27).
- **Follow-up date:** 2026-11-27 (30 días de observación tras indexación).
- **Observed result:** Pendiente de recolección en fecha de seguimiento.
- **Limitations (seasonality, delay, tracking, attribution):** Requiere re-crawling de Google de la Home para impactar en las SERPs y en Google AI Overview.
