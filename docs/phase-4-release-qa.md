# EverTrip — Fase 4: QA de release

Fecha de revisión: 21 de octubre de 2026. Esta fecha corresponde al QA, no a la vigencia de los documentos legales.

Rama inspeccionada: `astra-redesign`. Navegador: Chromium de Playwright, contra la exportación de producción `out/`, servida en `127.0.0.1:3001` por el servidor de pruebas del proyecto. No se probó una publicación nueva en Hostinger ni se desplegó nada.

## Cobertura

| Área | Idiomas y tamaños realmente renderizados | Comprobaciones |
| --- | --- | --- |
| Homepage completa | ES/EN; 320, 375, 390, 430, 768, 1024, 1440 px | Capturas de hero, rutas, Tours, flota, Tayrona, Aterriza, reseñas, Instagram, FAQ y footer; menú; dock y formulario. |
| Tours | ES/EN; los siete tamaños | Tres experiencias, fotografías cargadas, alternancia en escritorio, cuatro fotos de Cabo en 2×2, tres CTA, anclas y footer. |
| Directorio | ES/EN; los siete tamaños | 23 enlaces, búsqueda con resultados y sin resultados, imagen y texto sin desbordamiento. |
| Rutas representativas | ES/EN; los siete tamaños | Aeropuerto Santa Marta, Santa Marta–Cartagena y rutas personalizadas; capturas, contenido, consulta y preguntas. |
| Todas las rutas | 23 slugs × ES/EN × siete anchos: 322 comprobaciones de ancho | Cada URL abierta en navegador; pasajeros, límite de 30, enlaces WhatsApp y ausencia de overflow. |
| Privacidad y Términos | Cuatro páginas; los siete tamaños | Capturas, lectura, índice desplegable, última sección, cancelaciones y selector de idioma. |
| Utilidad de reseñas | ES/EN; los siete tamaños | QR cargado, composición sin overflow y ejecución del botón de impresión; no se imprimió físicamente. |
| Raíz y 404 | Exportación local | Fallback de `/` a `/es/` y respuesta 404 del servidor de QA a una URL inexistente. No equivale a verificar redirecciones HTTP de Hostinger. |

Se inspeccionaron capturas renderizadas, no solo dimensiones: todas las secciones de homepage en los siete anchos y ambos idiomas, además de muestras de Tours, rutas y documentos legales en móvil, tablet y escritorio. Los otros casos cuentan con capturas y aserciones automatizadas; no se afirma una revisión manual de cada párrafo de las 46 rutas.

Interacciones adicionales: cinco vehículos y sus tres fotos, swipe táctil emulado y arrastre de puntero, ciclo de testimonios, FAQ con teclado, Escape y recuperación de foco en menú/modal, límites de pasajeros, rechazo de origen igual a destino, reserva inversa Palomino → Santa Marta y consulta de ruta personalizada. Se verificaron destinos y mensajes WhatsApp sin enviar mensajes ni reservas. Las galerías de Tours son fotografías estáticas; no tienen un lightbox o carrusel que deba inventarse.

## Defectos confirmados y reparación

| Prioridad | Antes | Reparación y resultado |
| --- | --- | --- |
| P1 | El directorio se extendía 158 px fuera del viewport a 768 px en ES/EN. Las columnas tenían mínimos de 340 y 480 px, más padding y gap. | `.directory-cover`: `minmax(0, 0.82fr) minmax(0, 1.18fr)`. Se mantienen proporciones, contenido y composición. Comprobado en los siete anchos. |
| P1 | Textos pequeños sobre blanco/sal y texto blanco sobre teal no alcanzaban contraste suficiente; footer con opacidad reducida empeoraba el problema. | Nuevo token `--teal-readable: #087772` para texto y superficies con etiquetas blancas. Se mantiene `--brand-teal: #109b96` para acentos decorativos. Blanco/teal pasa de aproximadamente 3.41:1 a 5.40:1; la copia atenuada del footer usa blanco al 90%. |
| P1 | Los botones de rutas tenían `role="listitem"` con `aria-pressed`, combinación inválida que ocultaba su semántica de botón. | Se conserva el botón nativo; el contenedor pasa a `role="group"` con nombre localizado. Interacción y estructura visual intactas. |
| P1 | Vídeo automático en bucle sin control de pausa disponible para todos los visitantes. | Botón localizado de pausa/reanudación de 44×44 px. La pausa se conserva al salir y volver al hero; se respeta movimiento reducido. Sin cambios de imagen, encuadre, altura o textos. |
| P1 | La exportación Windows generaba archivos RSC anidados, mientras el navegador pedía nombres planos: respuestas 404 durante precarga/navegación. | `postbuild` crea los 116 nombres planos esperados copiando los mismos bytes. Conserva originales, rechaza colisiones de contenido y no modifica `node_modules`, rutas ni dependencias. `verify` comprueba la correspondencia sin escribir archivos. |

El contraste se evaluó con las reglas automatizables de WCAG A/AA. La necesidad de pausa corresponde al movimiento automático de más de cinco segundos junto con contenido: [contraste mínimo](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [pausar, detener u ocultar](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html). Esto no constituye una certificación completa WCAG.

### Evidencia de exportación Windows

Se observó, por ejemplo, una petición 404 a `/es/tours/__next.$d$locale.tours.__PAGE__.txt`, mientras el archivo existía como `out/es/tours/__next.$d$locale/tours/__PAGE__.txt`. En Next instalado, `dist/export/index.js` usa rutas relativas del sistema y `convertSegmentPathToStaticExportFilename` solo sustituye `/`; en Windows permanecen separadores de directorio. La discrepancia se confirmó localmente y coincide con la [incidencia del repositorio de Next.js](https://github.com/vercel/next.js/issues/92339).

El nuevo chequeo falló deliberadamente sobre el export previo por nombre ausente. `npm run build` añadió 116 equivalentes planos y la segunda comprobación añadió cero: operación idempotente. El remedio actúa solo sobre artefactos generados; cuando una versión futura de Next exporte correctamente, no habrá carpetas anidadas que normalizar. Usar `npm run build` para incluir `postbuild`; ejecutar `next build` directamente omite ese paso y `npm run verify` detectará el problema.

Las muestras de inicio ES, Tours ES y directorio EN respondieron HTTP 200 con bytes idénticos al export reparado: [evidencia de segmentos](qa/phase-4/navigation-segments.json). No se añadió ninguna redirección o excepción al servidor de QA para ocultar las respuestas 404.

No se atribuye a este defecto el único salto intermitente de ancla observado antes de la reparación: no se pudo demostrar esa relación causal.

Después de la reparación, el flujo de navegación ES/EN a 390 y 1440 px pasó sin errores de consola: cambio de idioma entre inicio, Tours, directorio, Tayrona y Privacidad conservando `?pax=4`; un único indicador activo en Tours; activación del enlace de rutas en homepage; y mensajes WhatsApp con el título y saludo del idioma correcto.

## Archivos modificados en esta fase

| Archivo | Cambio |
| --- | --- |
| `src/app/experience.css` | Grid del directorio, contraste localizado y regla del control de vídeo. |
| `src/components/experience/DestinationAtlas.tsx` | Semántica accesible del selector de rutas. |
| `src/components/experience/CoastalOverture.tsx` | Estado de pausa, control accesible y coordinación con la reproducción existente. |
| `scripts/normalize-static-segments.mjs` | Reparación y verificación de nombres RSC de la exportación Windows. |
| `package.json` | `postbuild` y comando `verify` —este último no existía—; sin dependencias nuevas. |
| `playwright.config.ts` | Opción `PLAYWRIGHT_STATIC_EXPORT` para probar el export real con la infraestructura existente. |
| `tests/e2e/static-server.mjs` | Servidor local de QA con soporte de rangos de vídeo, MIME, barra final y 404. |
| `tests/e2e/release.helpers.ts` | Preparación de páginas, capturas, overflow y validación de enlaces. |
| `tests/e2e/release.spec.ts` | Matriz bilingüe y cobertura de todas las rutas. |
| `tests/e2e/release-interactions.spec.ts` | Interacciones, accesibilidad, navegación, táctil, vídeo y utilidades. |
| `docs/phase-4-release-qa.md` y `docs/qa/phase-4/` | Este informe, cinco imágenes breves, resultados de accesibilidad y muestras HTTP de segmentos. |

Reglas de contraste corregidas en sus ubicaciones existentes: CTA de navegación/dock/formulario; `.trip-dock-intro`; captions y selección del Atlas/flota; enlaces y pasos de `.promise-narrative`; kicker/CTA del journal; `.journey-footer`, `.footer-invitation p`, `.footer-detail`; caption/metadatos/buscador del directorio; nota del formulario; caption del teaser y categoría/numeración de Tours. El placeholder del buscador usa `var(--muted)` y opacidad 1. No se añadió un bloque de overrides ni se alteraron tamaños tipográficos.

El control nuevo usa `.overture-video-toggle`: posición absoluta, `right: 7vw`, `bottom: 240px`, 44×44 px, fondo `rgba(7,59,58,.8)` y borde circular. Se comprobó su posición también a 320×568 px. El resto del hero conserva su composición.

Una comparación SHA-256 de los 78 archivos de origen/documentación/pruebas presentes al comienzo confirma cambios únicamente en los tres archivos de producto indicados; los 75 restantes se conservaron. Los nuevos archivos e infraestructura se enumeran arriba. No se modificaron fotografías, datos de tours, documentos legales, lógica de reservas, contenido de rutas ni trabajos previos ajenos a esta fase.

## Evidencias y resultados

- [Directorio 768 px antes](qa/phase-4/directory-768-before.webp) y [después](qa/phase-4/directory-768-after.webp).
- [Footer antes](qa/phase-4/footer-contrast-before.webp) y [después](qa/phase-4/footer-contrast-after.webp).
- [Control del vídeo en 390 px](qa/phase-4/video-pause-390.webp).
- [Resultados de accesibilidad](qa/phase-4/accessibility.json): 20 auditorías sin infracciones detectadas, ES/EN a 390 y 1440 px en homepage, Tours, directorio, aeropuerto y Términos. Se usó la copia de axe-core ya instalada con ESLint, sin instalar paquetes.

Las capturas largas de secciones en `test-results/` pueden mostrar el header o dock fijo en una posición intermedia: es la composición de una captura de elemento que excede la pantalla, no un header repetido en el contenido. Se contrastaron con capturas del viewport y navegación real.

Resultado final posterior a la corrección de exportación: **54/54 pruebas aprobadas en 6.9 minutos**, dos workers Chromium. Incluye las 44 pruebas de matriz y diez pruebas adicionales de interacción/accesibilidad. Sin reintentos configurados en esta ejecución. Artefactos completos: `test-results/phase4-final/` (directorio ignorado por Git). La matriz anterior de presentación también había pasado 44/44.

- `npm run build`: aprobado, 63/63 entradas, TypeScript y `postbuild` completados.
- `npm run verify`: aprobado; 116 nombres de segmentos verificados y 679 archivos de texto revisados por SEO. Conserva 52 URLs comerciales, cuatro legales, 46 páginas de rutas y dos páginas de Tours con tres servicios cada una.
- Lint dirigido a los archivos de esta fase: aprobado, sin advertencias.
- `npm run lint` global: **no aprobado**. Incluye el directorio generado `evertrip-hostinger/`, con 19 errores y 2442 advertencias en total. Acotado a `src tests scripts playwright.config.ts`, quedan cuatro errores y siete advertencias previos: dos en `InstagramInteractive.tsx`, uno en `src/data/routes.ts` y uno en `tests/e2e/fleet.helpers.ts`. No se modificaron archivos ajenos al QA para silenciarlos.
- Pruebas existentes seleccionadas de `journey.spec.ts`: seis aprobadas, una falla porque exige el antiguo `data-chapter` y parada del vídeo a los ocho segundos, comportamiento que ya no forma parte del hero aprobado. Otros contratos antiguos de Atlas/flota también requieren actualización; no se declara verde la suite histórica completa.

## Observaciones pendientes y límites

- **P2, observación no reproducida de forma estable:** antes de reparar la exportación, un salto ES/768 desde homepage a Cabo terminó visualmente en Flamencos aunque el hash era correcto. Seis repeticiones aisladas y una repetición completa del flujo ES pasaron. Después de reparar el export volvieron a pasar las seis repeticiones y todos los saltos ES/EN en siete anchos. Se conserva el antecedente; no se aplica un cambio de navegación basado en una hipótesis.
- **P2, herramientas:** alinear pruebas históricas con las interacciones aprobadas y resolver el lint previo. Son pendientes reales de la puerta de calidad, aunque no demuestran por sí mismos fallos de reservas.
- **P3:** completar pruebas físicas Safari/iOS y Android y medir rendimiento de campo tras una publicación autorizada. Aquí hubo Chromium real con viewports y entrada táctil emulados; no hardware móvil, lector de pantalla ni medición de Core Web Vitals de campo. No se certifica CLS mediante estas capturas.
- La fecha de vigencia legal sigue pendiente de aprobación, como en Fase 3. Los textos no se editaron y no se muestra un placeholder en producción.
- La raíz local conserva fallback mediante meta refresh a español. La redirección HTTP del dominio, caché, MIME y 404 reales requieren verificación en Hostinger cuando exista autorización para publicar. El servidor QA no simula reglas privadas del alojamiento.

## Reproducción y decisión de release

```powershell
npm run build
npm run verify
$env:PLAYWRIGHT_STATIC_EXPORT = '1'
npm run test:e2e -- tests/e2e/release.spec.ts tests/e2e/release-interactions.spec.ts
```

Si se usa un servidor local de exportación ya iniciado, establecer `PLAYWRIGHT_BASE_URL` con su URL. No confundir un servidor dev con un directorio de exportación antiguo.

**Resultado: QA funcional local aprobada con observaciones.** No quedan P0/P1 reproducibles en la cobertura ejecutada. Se conservaron las composiciones aprobadas y se corrigieron los cinco defectos descritos. La aprobación global de publicación sigue condicionada a resolver o aceptar explícitamente la deuda de lint/pruebas históricas y cerrar la fecha legal pendiente. La verificación del alojamiento y las pruebas de dispositivos físicos quedan claramente separadas del resultado local.

Se cerró únicamente el servidor de QA iniciado para esta fase. No se hicieron commits, pushes, resets, cambios de rama, ZIP, despliegues ni cambios de DNS, Hostinger o Cloudflare. No se reiniciaron servidores del usuario.
