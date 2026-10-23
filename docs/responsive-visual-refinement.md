# EverTrip — refinamiento visual responsive

Revisión local del 21 de octubre de 2026, en `astra-redesign`. Se conservó el trabajo previo sin commits, cambios de rama ni despliegue. La exportación de producción se revisó con Chromium real en `127.0.0.1:3001`, con fotografías originales de R2. Las capturas aportadas del teléfono se usaron como referencia del problema; no se afirma una prueba física en ese dispositivo.

## Diagnóstico y ajustes

El único archivo de producto modificado en esta tarea es `src/app/experience.css`. Se corrigieron las reglas existentes y se retiraron declaraciones desktop redundantes; no se cambió JSX, contenido, datos, fotografías, rutas, reservas ni textos legales.

| Área | Causa observada | Ajuste aplicado |
| --- | --- | --- |
| Tayrona móvil | `min-height: 640px`, `height: 88svh` y `object-position: 38% 50%` recortaban mucho la fotografía horizontal. La primera fila del grid al `55%` situaba el titular bajo, sobre el paisaje. | Hasta 700 px: `min-height: 0`, `height: clamp(440px, 125vw, 560px)`, foco `48% 50%`, márgenes laterales de 24 px y primera fila `clamp(24px, 6vw, 32px)`. El texto ocupa el cielo y se muestran más bahía, playa y rocas. |
| Legibilidad sobre Tayrona | Al subir el texto era necesario proteger su contraste en el cielo. | Solo móvil: overlay superior `rgba(2,31,47,.50)` → `.22` al 28% → transparente al 55% → `rgba(7,59,58,.12)` abajo. Subtítulo 11 → 12 px. Tamaño del titular sin cambios. |
| Aterriza / El camino, a tu manera | El tratamiento blanco estaba limitado a desktop; móvil heredaba `var(--salt)`. Títulos de 42 px junto a cuerpo de 12 px desequilibraban las pantallas de 320 px. | Fondo blanco en `.travel-promise`, `.promise-landscape:after`, `.promise-narrative` y `.promise-stop`. Línea del recorrido `#dce9e5` al 42%. En móvil: títulos `clamp(30px,8.2vw,36px)`, cuerpo 14 px/1.8, enlaces 12 px; grid `30px minmax(0,1fr)`, gap 16 px, padding vertical 32 px. |
| Reseñas / Instagram | El blanco también era exclusivo de desktop. Se acumulaban 158 px entre el cierre del testimonio y el inicio de Instagram. | `.travel-journal` blanco; bordes y controles reutilizan el tratamiento desktop. En móvil: `.traveler-voice` padding `40px 0`; `.journal-postcard` padding superior 32 px y margen superior 24 px. La separación acumulada pasa a 96 px, manteniendo el divisor y las fotografías. |
| Detalles y continuación de rutas | El papel beige era una regla general, no un override exclusivo de móvil. Los títulos fijos de 42–47 px dominaban el ancho pequeño. | `.route-journal` usa `--route-paper`; hasta 900 px se define blanco y el SVG de transición hereda el mismo color. `.route-related` usa `#f8fbfa`, ya presente en la identidad del directorio. Desktop conserva su superficie aprobada. |
| Tipografía de rutas | Jerarquía excesiva a 320 px y texto descriptivo pequeño. | Hasta 700 px: título de portada `clamp(38px,10.8vw,47px)`; `.route-story h2` y `.quote-notebook h3` `clamp(34px,9vw,40px)`; `.route-related h2` `clamp(32px,8.5vw,38px)`. Margen del título de detalle `18px 0 24px`; cuerpo 14 px/1.8 y listas 13 px. |

La forma y posición de la transición de Tayrona se conservaron; solo se igualó su color al contenido blanco. `object-fit: cover` y la URL `https://assets.evertripviajes.com/routes/tayrona/hero%20(2).webp?v=2` siguen intactos. El encuadre, altura, overlay y tipografía de Tayrona desde 701 px no se modificaron. No se cambió el booking dock.

## Evidencia visual

Cada archivo muestra **antes a la izquierda y después a la derecha**:

- [Tayrona, ES, 390 px](qa/responsive-visual/tayrona-es-390.webp): más paisaje y texto en la parte superior.
- [Aterriza y recorrido, ES, 320 px](qa/responsive-visual/narrative-es-320.webp): fondo blanco, títulos contenidos y lectura más cómoda.
- [Detalle Barranquilla–Palomino, ES, 390 px](qa/responsive-visual/route-es-390.webp): jerarquía y fondo corregidos.
- [El viaje continúa, EN, 390 px](qa/responsive-visual/related-en-390.webp): superficie fría y transición al footer conservada.
- [Tayrona desktop, EN, 1440 px](qa/responsive-visual/desktop-en-1440.webp): composición intacta.

[Comparación de 24 encuadres desktop](qa/responsive-visual/desktop-comparison.json): en ES y EN, Tayrona, narrativa, reseñas, flota, FAQ y las cuatro vistas de Barranquilla–Palomino registraron cero píxeles por encima del umbral de diferencia RGB empleado. Los encuadres de Routes incluyen una franja del vídeo en movimiento: no son referencias estáticas fiables; se contrastaron visualmente. Tours ES presenta 72 píxeles diferentes de 1.296.000, sin cambio apreciable de composición. No se afirma identidad de todos los píxeles del sitio ni se usa este resultado como medición de CLS.

## Cobertura y resultados

| Comprobación | Resultado |
| --- | --- |
| Matriz visual ES/EN a 320, 390, 430, 768 y 1440 px | **10/10 casos aprobados** sobre el export final, sin inyección de CSS. Viewports de 844 px de alto en móvil y 900 px en tablet/desktop. |
| Páginas representativas | Homepage y cuatro rutas por caso: Barranquilla–Palomino, aeropuerto Santa Marta, Santa Marta–Cartagena y rutas personalizadas; 50 visitas, 250 capturas de viewport. |
| Revisión visual real | Capturas inspeccionadas en ambos idiomas y los cinco anchos: Tayrona, pasos, reseñas y muestras de portadas, detalles, formularios y cierre de rutas. Se contrastaron Tours, flota, FAQ y dock como componentes compartidos. No se declara revisión manual de cada una de las 250 capturas. |
| Todas las rutas | 46 URLs localizadas comprobadas automáticamente a 320, 375, 390, 430, 768, 1024 y 1440 px, incluyendo cotización y ausencia de overflow. |
| Layout e imágenes | Imágenes decodificadas correctamente; sin overflow horizontal en las capturas; sin recorte de texto ni solapamientos nuevos observados. El dock permanece usable durante el desplazamiento. |
| Accesibilidad | [20 auditorías axe](qa/responsive-visual/accessibility.json), ES/EN a 390 y 1440 px: **cero infracciones detectadas** en homepage, Tours, directorio, aeropuerto y Términos. No equivale a una certificación WCAG completa. |
| Build | `npm run build`: aprobado, 63/63 entradas; TypeScript y normalización postbuild completados. |
| SEO/export | `npm run verify`: aprobado; incluye `verify:seo`, 116 segmentos estáticos y 679 archivos de texto. Se conservan 52 URLs comerciales, cuatro legales y 46 páginas de rutas. |
| Lint del archivo de pruebas nuevo | `npm run lint -- tests/e2e/visual-refinement.spec.ts`: aprobado. No se declara resuelta la deuda de lint global documentada en Fase 4. |

La batería seleccionada ejecutó 35 pruebas: **33 pasaron y dos fallaron** al comprobar que el ancla de Cabo de la Vela quedaba dentro del viewport. El resto incluyó reservas, menú, vídeo/pausa, cambio de idioma, mensajes WhatsApp, gestos de flota y accesibilidad. Ambas pruebas fallidas pasaron en una repetición aislada con un worker (**2/2**, una de ellas contiene seis recorridos consecutivos). No se alteraron las pruebas ni la navegación para forzar un resultado verde.

## Pendientes y límites

- **Ancla de Cabo, incidencia intermitente:** reapareció el antecedente documentado en Fase 4 durante la ejecución concurrente. No se ha confirmado su causa ni demostrado que dependa de estos ajustes CSS. La repetición aislada aprobada no demuestra que esté resuelta. Se conserva como pendiente funcional separado; esta tarea no modifica la navegación.
- Pruebas físicas Android/iOS y Safari pendientes. Los resultados corresponden a Chromium con tamaños reales de viewport, no a hardware móvil ni a producción Hostinger.
- Los fondos de rutas desktop se preservaron deliberadamente; el ajuste blanco afecta móvil/tablet hasta 900 px. Las transiciones teal de marca permanecen intactas.
- No se detectaron otros problemas visuales que justificaran alterar las secciones aprobadas. La valoración final de dirección de arte corresponde a la revisión de las capturas por el usuario.

## Archivos de esta tarea

- `src/app/experience.css`: único archivo de producto modificado.
- `tests/e2e/visual-refinement.spec.ts`: prueba persistente y acotada para reproducir capturas y detectar overflow/imágenes rotas en la matriz solicitada. La opción `VISUAL_CSS_PREVIEW` permite previsualizar CSS; estuvo desactivada en la validación final.
- `docs/responsive-visual-refinement.md` y siete evidencias en `docs/qa/responsive-visual/`: informe, cinco comparativas WebP y dos resultados JSON.

El servidor de QA iniciado para esta revisión se cerró al terminar. No se reiniciaron servidores del usuario, no se generó un ZIP ni se publicó nada.
