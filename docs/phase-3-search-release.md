# Fase 3 — SEO, búsqueda local y descubrimiento mediante IA

Estado: validación local completada en `astra-redesign`. Sin publicación, cambios de infraestructura ni operaciones de escritura de Git.

## Punto de partida y evidencia de producción

La exportación local ya utilizaba `https://evertripviajes.com` para canonicals, alternates, sitemap y robots antes de esta fase. Las rutas comerciales bilingües, las páginas consolidadas de Tours, sus anclas, el identificador estable `https://evertripviajes.com/#business` y la exclusión de QR del índice ya estaban implementados. No se reconstruyó esa arquitectura.

Las consultas de solo lectura realizadas durante esta fase confirmaron que la versión publicada sigue siendo distinta:

| Recurso publicado | Respuesta observada | Hallazgo |
| --- | --- | --- |
| `/sitemap.xml` | HTTP 200, `application/xml` | 50 URLs; referencias a `evertrip.co` en URLs y alternates. |
| `/robots.txt` | HTTP 200, `text/plain` | Declara `https://evertrip.co/sitemap.xml`. |
| `/es/santa-marta-to-tayrona/` | HTTP 200, `text/html` | Canonical `https://evertrip.co/es/santa-marta-to-tayrona/`. |

Estos defectos pertenecen a la publicación antigua. Los cambios locales no los corrigen en producción hasta una publicación autorizada. Los datos históricos de Search Console —59 indexadas y 10 exclusiones— fueron proporcionados por el usuario; no se consultaron los motivos ni las URLs de esas exclusiones.

## Deficiencias corregidas y archivos exactos

| Archivo | Cambio de esta fase |
| --- | --- |
| `src/lib/seo.ts` | Mapa único de slugs legales por idioma, reutilizado por rutas, metadatos y enlaces. |
| `src/app/[locale]/[slug]/page.tsx` | Generación estática y resolución de las cuatro páginas legales mediante el lector existente; rutas de transporte intactas. |
| `src/components/layout/Footer.tsx` | Enlaces legales localizados. Cancelaciones usa un enlace HTML al apartado existente para garantizar el desplazamiento también desde la misma página con parámetros. |
| `src/components/layout/Navbar.tsx` | El selector de idioma resuelve el slug legal correspondiente y conserva los parámetros de consulta. |
| `src/components/JsonLd.tsx` | Eliminación de `priceRange: "$"`, una categoría de precio no sustentada. |
| `src/components/RouteJsonLd.tsx` | Identificador estable y nombre de cada servicio, tipo localizado y áreas atendidas basadas en las ubicaciones existentes. |
| `src/components/TourJsonLd.tsx` | Área atendida basada en la ubicación visible de cada experiencia. |
| `src/data/faq.ts` | Dos respuestas ES/EN sobre pagos y cancelaciones alineadas con los términos aprobados; la respuesta anterior de cancelaciones sugería un plazo de penalización no respaldado. |
| `scripts/verify-static-seo.mjs` | Ampliación del verificador existente: dominio antiguo literal/codificado, enlaces y anclas, barra final, encabezados, indexabilidad, URLs legales, esquema y concordancia del FAQ con contenido visible. |
| `docs/phase-3-search-release.md` | Este informe y los pendientes de publicación. |

Se consolidaron los dos wrappers de la fase anterior, `src/app/[locale]/privacy-policy/page.tsx` y `src/app/[locale]/terms-and-conditions/page.tsx`, en el dispatcher `[locale]/[slug]/page.tsx`. No se eliminaron documentos, traducciones ni el componente de lectura.

URLs legales finales:

- ES: `/es/politica-privacidad/` y `/es/terminos-condiciones/`.
- EN: `/en/privacy-policy/` y `/en/terms-and-conditions/`.

Los slugs anteriores en español no estaban publicados. No se exportan copias con slugs del idioma equivocado. Las URLs comerciales establecidas no cambiaron.

Durante la compilación se detectaron dos archivos de tipos generados en `.next/dev/types/app/[locale]/`, referidos a los wrappers retirados. Se eliminaron únicamente esos dos artefactos obsoletos; no se vació `.next`, se modificó `tsconfig` ni se reiniciaron servidores existentes.

## Búsqueda local e IA

Los contenidos existentes ya cubren transporte privado en Santa Marta, aeropuerto Simón Bolívar, Palomino, Cartagena, Barranquilla, Tayrona y las tres experiencias. No se encontraron motivos para crear páginas adicionales o repetir textos locales. Se conservaron los 23 slugs de transporte y su contenido en ambos idiomas.

Las mejoras se concentran en describir correctamente cada servicio, vincularlo a la entidad estable del negocio y eliminar contradicciones entre respuestas públicas y condiciones legales. No se añadieron precios, tiempos de viaje, reseñas, registros ni coberturas inventadas.

No se añadió `llms.txt`, esquema especial para IA ni otro FAQPage. Se conserva el FAQ existente y se verifica que sus preguntas y respuestas sean visibles. Esto no constituye una promesa de resultados enriquecidos ni de recomendaciones de IA. Google indica que sus funciones de IA se apoyan en los fundamentos de Search y no requieren archivos especiales: [guía oficial de optimización para IA](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).

El domicilio de contacto legal no se convirtió en una afirmación de oficina abierta al público, coordenadas u horarios. Antes de ampliar la información local, corresponde confirmar los datos operativos y su coherencia con el perfil de empresa. El esquema actual no se presenta como elegible para todos los resultados enriquecidos de LocalBusiness: [requisitos de Google](https://developers.google.com/search/docs/appearance/structured-data/local-business).

## Validación del resultado local

- `npm run build`: aprobado; TypeScript y generación de 63/63 entradas completados.
- `npm run verify:seo`: aprobado sobre la exportación final.
- ESLint dirigido a los nueve archivos de código/verificación modificados: aprobado.
- 56 URLs indexables en sitemap: 52 comerciales y 4 legales. Todas usan el dominio oficial, canonical propio y alternates ES/EN/x-default correspondientes.
- Sitemap XML analizado en navegador: HTTP 200, `application/xml`, namespace correcto, cero errores de parseo, 56 URLs. El tipo de respuesta corresponde al servidor local de comprobación; debe verificarse de nuevo en Hostinger tras publicar.
- 563 archivos de texto exportados inspeccionados sin referencias al dominio antiguo. Robots declara el sitemap oficial y no introduce bloqueos inesperados.
- Enlaces internos, anclas, barra final, un H1 por página indexable, directivas de indexación y datos estructurados comprobados. QR, raíz y 404 mantienen su tratamiento específico.
- Siete pruebas negativas en memoria confirmaron que el verificador rechaza dominio antiguo codificado, destino interno inexistente, ancla inexistente, `googlebot noindex`, H1 duplicado, área de servicio no visible y FAQ no visible. No se escribieron archivos de prueba.
- Comparación del contenido renderizado antes/después: 46 artículos de rutas, 2 bloques completos de Tours y 4 documentos legales idénticos, ignorando únicamente comentarios HTML internos de React.
- Chromium real contra la exportación final: ES/EN a 1440 y 390 px. Páginas legales, navegación entre idiomas con parámetros, enlace a Cancelaciones y las dos respuestas FAQ comprobados. Sin desbordamiento horizontal ni errores de ejecución registrados; lectura y composición conservadas.
- El enlace a Cancelaciones se probó desde Privacidad y desde Términos con parámetros: alcanza el apartado correcto bajo el encabezado fijo. También se comprobó el cambio de idioma en Santa Marta–Tayrona conservando `?pax=4`.

Esta fue una revisión visual focalizada, no la fase completa de QA responsive. No se modificaron CSS, fotografías, galerías, componentes visuales de homepage/Tours, textos legales ni lógica de reservas. Los cambios previos no relacionados se conservaron.

## Pendientes antes de la publicación controlada

1. Aprobar la fecha de publicación/vigencia legal pendiente. No se inventó ni se muestra un placeholder en las páginas.
2. Completar la fase de QA responsive prevista. La Fase 3 no incluye publicación ni cambios en Hostinger, DNS o Cloudflare.
3. Publicar una exportación completa y coherente cuando se autorice, sin mezclar directorios antiguos. No se regeneró ningún ZIP en esta fase; los archivos comprimidos anteriores no representan necesariamente este resultado.
4. Tras publicar, verificar raíz/idioma, HTTPS y host canónico, barras finales, variantes `index.html`, 404 real, cachés, encabezados de indexación, robots y sitemap en el alojamiento real.
5. Confirmar el dominio correcto en producción antes de enviar el sitemap desde la propiedad verificada de Search Console. Inspeccionar muestras ES/EN de inicio, Tayrona, aeropuerto, Tours y legales; revisar las URLs y los motivos reales de las exclusiones históricas.

## Próxima fase recomendada

Validar de forma integral 320, 390, 768, 1024, 1440 y 1920 px, teclado/táctil, menú, booking dock, calculadora, consultas WhatsApp, parámetros, idioma y anclas. Revisar las composiciones aprobadas de homepage, galerías de Tours —incluido Cabo 2×2— y disponibilidad de imágenes R2. Medir rendimiento y Core Web Vitals con el despliegue real, especialmente medios del hero y comportamiento en móviles; esta fase no incluyó una medición de campo ni garantiza puntuaciones.

Referencia adicional para los alternates: [versiones localizadas en Google Search](https://developers.google.com/search/docs/specialty/international/localized-versions).
