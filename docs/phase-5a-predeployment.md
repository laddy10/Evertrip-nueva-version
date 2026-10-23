# EverTrip — Fase 5A: preparación previa al despliegue

21 de octubre de 2026. Rama: `astra-redesign`. Preparación local completada; **no se autoriza ni se ejecuta una publicación**. Se conservó el trabajo previo y la aprobación visual del usuario en Android. No hubo commits, cambios de rama, ZIP, cambios de DNS, Hostinger o Cloudflare.

## 1. Cabo de la Vela: diagnóstico y reparación

Se reprodujo el defecto en la exportación de producción, no solo en desarrollo. En ES a 768 px, después de navegar desde FAQ al ancla Tours de la homepage y pulsar Cabo:

- La URL era correctamente `/es/tours/#pasadia-cabo-de-la-vela`.
- El elemento existía y Next había llamado a `scrollIntoView()` con ese ID.
- Diez segundos después, `scrollY` seguía en 1590 y el comienzo de Cabo estaba a **1367.14 px por debajo del viewport**. La pantalla mostraba parte de Flamencos. No era únicamente una espera insuficiente de la aserción ni un ID incorrecto.
- La prueba sin lecturas adicionales de layout falló en uno de seis casos de idioma/ancho. Un control que anuló temporalmente el scroll suave **solo dentro del navegador de pruebas** pasó los seis casos, con seis recorridos por caso.

La evidencia sitúa el problema en la interacción temporal entre el desplazamiento suave previo y la navegación cliente de Next. El layout localizado ya declara `data-scroll-behavior="smooth"`; no faltaba esa declaración. El código instalado de Next 16.2.10 permite scroll suave para cambios de hash y lo desactiva temporalmente durante cambios de página. No se atribuye el defecto a una instrucción interna concreta del navegador, a hidratación o a carga de fotografías sin evidencia adicional.

**Reparación mínima:** en `src/components/experience/TourExperiences.tsx`, las tarjetas usan `<a href>` nativo en lugar de `<Link>`. Se mantienen exactamente sus URLs, clases, contenido y fotografías. Esto hace que el navegador cargue el documento estático de Tours en su fragmento, independientemente del scroll pendiente del documento anterior. Se aplica coherentemente a las tres tarjetas. El enlace general a Tours sigue usando `Link` y el componente sigue siendo de servidor.

No se añadieron temporizadores, efectos, listeners de scroll, CSS ni componentes. La contrapartida es una navegación de documento completo para esas tres tarjetas, en vez de la transición cliente y su precarga; los recursos compartidos conservan su caché normal.

Evidencia: [antes, ES/768](qa/phase-5a/cabo-before-768.webp), [después, ES/768](qa/phase-5a/cabo-after-768.webp) y [datos de diagnóstico](qa/phase-5a/readiness.json).

### Validación del cambio

- 36 recorridos repetidos, sin reintentos: ES/EN × 390/768/1440 px × seis intentos, con el scroll suave original habilitado. Se comprueba llegada y posición un segundo después de cargar fuentes, además de ausencia de overflow y errores de ejecución.
- La prueba anterior de seis recorridos a 768 px pasó. Los flujos completos de flota, reseñas, FAQ, menú, teclado y anclas pasaron en ES/EN y siete anchos.
- Los tres enlaces se activaron con teclado y se comprobó Atrás a 390/1440 px en ambos idiomas.
- 16 entradas directas sin JavaScript en pestañas nuevas: los tres tours y el alias `#cabo-de-la-vela`, ES/EN a 390/1440 px. Encabezados visibles y sin overflow.
- Se mantienen tres botones de consulta y cuatro imágenes de galería en Cabo. La hoja de estilos, el JSX de Tours y sus datos no cambiaron.

La batería final seleccionada tuvo 15 pruebas aprobadas y dos fallos de infraestructura de la **prueba nueva**: se esperaba HTTP 200 al cambiar únicamente el hash en el mismo documento; Playwright devuelve correctamente una respuesta nula en ese caso. Se corrigió esa prueba para que cada entrada directa abra una pestaña nueva. Las dos pruebas corregidas pasaron. Los 17 casos seleccionados quedan cubiertos, sin fallos funcionales pendientes observados. No se usó un reintento exitoso para ocultar el defecto original.

## 2. Fecha legal: preparada, pendiente de aprobación

Actualizar exclusivamente el marcador de la **línea 4** de estos cuatro documentos cuando el usuario apruebe la misma fecha de vigencia/publicación:

| Fuente | URL pública |
| --- | --- |
| `docs/legal/politica-privacidad.md` | `/es/politica-privacidad/` |
| `docs/legal/terminos-condiciones.md` | `/es/terminos-condiciones/` |
| `docs/legal/privacy-policy.en.md` | `/en/privacy-policy/` |
| `docs/legal/terms-and-conditions.en.md` | `/en/terms-and-conditions/` |

Conservar las etiquetas `**Fecha de entrada en vigor:**` y `**Effective date:**`; sustituir el marcador completo entre corchetes por la fecha aprobada, expresada en el idioma correspondiente. No cambiar el resto del texto ni usar automáticamente la fecha de compilación.

`src/lib/legal.ts` lee estos archivos durante el build y elimina únicamente la línea que contiene el marcador pendiente exacto. `src/components/legal/LegalDocument.tsx` renderiza el preámbulo en `.byline`, sobre el H1, con etiqueta en negrita y salto de línea tras EverTrip Viajes. Una fecha aprobada permanece en ese preámbulo y se mostrará sin cambios de código.

Se comprobó en memoria el regex real extraído del lector: oculta los cuatro marcadores actuales y conserva un valor de control no fechado. No se escribió ese valor ni ninguna fecha en los documentos, el export o las páginas. `verify:seo` confirmó integridad de los cuatro documentos y ausencia de placeholders publicados. Tras aprobar la fecha será necesario reconstruir el export y revisar las cuatro cabeceras. Este sigue siendo un bloqueo de publicación, no un problema de renderizado.

## 3. Exportación y preparación Hostinger

La configuración vigente conserva `output: 'export'`, `trailingSlash: true` e imágenes sin optimización de servidor. La entrega correcta es **el contenido completo de `out/`**, generado por `npm run build`, incluido su `postbuild`. No se debe usar `.next/`, `next start`, el servidor de desarrollo, la carpeta `evertrip-hostinger/` antigua ni ninguno de los ZIP anteriores.

Comprobaciones del export nuevo:

| Elemento | Resultado |
| --- | --- |
| Inventario | 755 archivos, 76.559.830 bytes, 62 HTML incluyendo utilidades y páginas de error. Las 63 entradas informadas por Next incluyen artefactos de metadata; no son 63 URLs comerciales. |
| Rutas indexables | 56 en sitemap: 52 comerciales y cuatro legales; 46 páginas de transporte y dos páginas consolidadas de Tours. |
| Recursos | 107 referencias locales revisadas, 42 recursos referenciados, ninguno ausente. Los 23 archivos de `.next/static` coinciden byte por byte con `out/_next/static`. |
| HTTP local | 160 archivos no-RSC comprobados por HEAD: todos HTTP 200; HTML, JS, CSS, imágenes, fuentes, vídeos, XML y favicon con tipos adecuados en el servidor de QA. |
| Navegación estática | 116 nombres de segmentos Next normalizados por `postbuild` y comprobados por `verify`. Conservar todos los `.txt`, `index.txt` y `__next.*`, incluidos nombres con `$`, puntos y sus carpetas originales. |
| Dominio | Sitemap, robots, canonical, hreflang y entidad `https://evertripviajes.com/#business` verificados con el origen oficial. |
| Fotografías | Referencias R2 intactas; 30 URLs distintas encontradas en HTML. No se modificaron URLs ni archivos de imagen. |
| Higiene | Sin `.env`, fuentes TS/TSX, `node_modules`, `.git`, `.next`, documentación, pruebas, logs, mapas de código fuente ni ZIP en `out/`. Los JS de producción y payloads RSC sí son archivos necesarios. |

Los resultados HTTP son **locales**, con `tests/e2e/static-server.mjs`; no certifican MIME, caché, redirecciones o 404 de Hostinger. Localmente `/es` y las rutas sin barra redirigen conservando parámetros; las rutas inexistentes devuelven 404.

### Hallazgo de alojamiento pendiente

**Actualmente no existe `public/.htaccess` ni `out/.htaccess`.** Se encontró la regla de entrada en paquetes antiguos (`evertrip-hostinger/.htaccess` y `build/evertrip-hostinger-root-fix/.htaccess`) y su documentación histórica en `build/phase6/hostinger-root-redirect.md.before`. Esto no demuestra que esté instalada en Hostinger.

El export actual de `/` devuelve un HTML con meta refresh y enlace de respaldo a español. Sin redirección HTTP del alojamiento puede reaparecer la página intermedia blanca. No debe publicarse suponiendo que el build incluye esa corrección de servidor.

Antes de publicar, inspeccionar la raíz documental del dominio y su `.htaccess` real. Conservar reglas válidas de HTTPS/host/caché y acordar su integración; no sustituir a ciegas el archivo existente. El contrato requerido es:

- `/` y `/index.html`: 301/308 a `/es/`, conservando consulta; español sigue siendo el idioma predeterminado.
- Directorios existentes: `index.html` y barra final. Nada de añadir barras a JS, CSS, fuentes, XML, TXT o imágenes.
- Alias explícitos `/es/index.html` y equivalentes: normalización a su directorio, evitando bucles de resolución interna.
- URL inexistente: estado 404 real y, si se configura el cuerpo personalizado, `/404.html`. Sin catch-all de SPA a la homepage.
- HTTP/host alternativo: canonical HTTPS del dominio oficial, sin perder ruta ni parámetros. Revisar las reglas actuales y certificados antes de cambiarlos.

Estas directivas documentan el comportamiento esperado de índices/barras y errores: [Apache mod_dir](https://httpd.apache.org/docs/2.4/mod/mod_dir.html), [ErrorDocument](https://httpd.apache.org/docs/2.4/mod/core.html#errordocument). No se aplicó configuración nueva. La regla raíz histórica que debe conservarse o integrarse tras inspeccionar el servidor es:

```apache
RewriteEngine On
RewriteRule ^(?:index\.html)?$ /es/ [R=301,L]
```

Esto solo resuelve la entrada raíz; no sustituye la comprobación de los demás contratos. La exportación puede funcionar en cualquier servidor estático compatible; no depende de un proceso Node en Hostinger.

## 4. Validaciones y archivos de esta fase

- `npm run build`: aprobado; compilación, TypeScript, 63/63 entradas y 116 equivalentes RSC generados.
- `npm run verify`: aprobado, incluida verificación SEO sobre 679 archivos de texto y la correspondencia de segmentos.
- Pruebas críticas: casos descritos arriba; reservas ES/EN a 390 y 1440 px, límites/teclado a 320 px, selector de idiomas, consultas WhatsApp, flota, menú, FAQ y foco. No se enviaron mensajes ni reservas.
- ESLint de `TourExperiences.tsx` y `tour-anchor.spec.ts`: aprobado. No se declara reparada la deuda de lint/pruebas históricas recogida en Fase 4.
- Se reutiliza el QA responsive y de accesibilidad de Fase 4/refinamiento, además de la aprobación Android del usuario. No se repitió una auditoría global ni se atribuye a esta fase una prueba física nueva.

Archivos exactos:

1. `src/components/experience/TourExperiences.tsx`: único archivo de producto modificado; tres enlaces nativos, URLs intactas.
2. `tests/e2e/tour-anchor.spec.ts`: regresión persistente de anclas, teclado, historial y entrada sin JavaScript.
3. `docs/phase-5a-predeployment.md`: este informe y procedimiento.
4. `docs/qa/phase-5a/readiness.json`, `cabo-before-768.webp`, `cabo-after-768.webp`: evidencia acotada.

Una comparación SHA-256 de los 103 archivos presentes al inicio confirmó que solo cambió el componente indicado. Los cuatro documentos legales, CSS, datos y componentes de Tours, navegación compartida y trabajo previo se conservaron. `out/` y artefactos normales de build/pruebas se regeneraron; los paquetes de publicación no se tocaron.

## 5. Decisión y pasos para una publicación autorizada

**Código y export local validados; publicación condicionada.** No queda un P0/P1 de aplicación detectado en las comprobaciones seleccionadas. La configuración HTTP del alojamiento no está verificada y la fecha legal sigue sin aprobarse: no se declara listo para subir sin atender ambos puntos.

Cuando exista autorización explícita:

1. Aprobar la fecha legal y reemplazar los cuatro marcadores de la línea 4; revisar ES/EN.
2. Confirmar la raíz documental exacta de `evertripviajes.com` y guardar un respaldo completo de la versión publicada y sus reglas. No asumir que la carpeta de otro dominio o un paquete antiguo corresponde al sitio actual.
3. Revisar/integrar las reglas de entrada, HTTPS/host, barras, alias `index.html`, caché y 404 con la configuración existente. Preservar acceso directo a archivos RSC. No tratar HTML o payloads TXT de nombre estable como recursos inmutables de larga duración.
4. Ejecutar `npm run build`, `npm run verify` y la prueba focalizada de anclas. Revisar las cuatro fechas visibles. Si cambia código/configuración, ejecutar las pruebas relacionadas.
5. Solo con autorización para empaquetar, crear un paquete nuevo desde el contenido completo de `out/`, con archivos en la raíz del paquete, nombres intactos y configuración de alojamiento revisada. Comparar inventario/hashes tras empaquetar; no reutilizar los ZIP antiguos.
6. Publicar esa exportación completa en la raíz confirmada, con el respaldo disponible para reversión. No subir código fuente, `.next`, dependencias ni evidencias QA. Evitar mezclar HTML y payloads de builds distintos.
7. Comprobar en producción `/`, `/index.html`, `/es/`, `/en/`, Tours y Cabo desde ambas homepages, una ruta con `?pax=4`, las cuatro legales, barra final/alias, una URL inexistente, JS/CSS/fuentes, TXT RSC, robots y sitemap. Verificar respuesta HTTP y `Location`, contenido visible, MIME y caché reales; resolver caché antigua si se observa. No considerar suficiente que solo la portada cargue.
8. Confirmar dominio y sitemap públicos correctos antes de solicitar acciones de indexación. Cualquier despliegue, cambio de configuración o envío posterior requiere su autorización correspondiente.

Se detiene la tarea al completar Fase 5A. No se inició despliegue.
