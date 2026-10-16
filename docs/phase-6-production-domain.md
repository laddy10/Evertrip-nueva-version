# Fase 6: dominio de producción

Dominio canónico: **https://evertripviajes.com**, sin `www`.
Fecha de validación local: 16 de octubre de 2026 (America/Bogota).
Rama de trabajo: `astra-redesign`.

## Auditoría y decisiones

| Referencia encontrada | Uso y decisión |
| --- | --- |
| `src/lib/seo.ts`: `SITE_ORIGIN = "https://evertrip.co"` | Único origen de URLs SEO de la aplicación. Se actualizó al dominio definitivo. |
| `scripts/verify-static-seo.mjs`: origen esperado anterior | Se fijó explícitamente el dominio definitivo como criterio de aceptación independiente de la configuración de la aplicación. |
| `docs/phase-1-seo-deployment.md`: canonical raíz y ejemplos de normalización del host | Se actualizaron las tres referencias operativas al dominio definitivo. |
| `docs/hostinger-root-redirect.md`: dominio anterior observado en producción | Evidencia histórica de otra tarea, pendiente de commit. Se conserva; esta fase resuelve su hallazgo sobre el origen SEO. No describe el estado publicado después de esta migración. |
| Exportaciones previas en `evertrip-hostinger/`, respaldos de `build/`, ZIP antiguos y caché `.next/dev/server/app/` | Artefactos históricos, no fuentes de configuración. No se sustituyeron cadenas dentro de ellos. El build regeneró `out/` desde el código corregido. |
| `localhost` en `playwright.config.ts`, README y documentación de previsualización; `127.0.0.1` en utilidades locales | Desarrollo y pruebas locales. Se conservan; no son destinos SEO del sitio. |
| Literal `localhost` en el polyfill de URL del chunk `noModule` generado por Next | Código de terceros que normaliza el hostname al analizar URLs; no es una URL del sitio ni una petición de red. Se conserva el polyfill sin modificar dependencias o recursos compilados. |
| Hostnames temporales de Hostinger, Vercel o Netlify | No se encontró un dominio temporal de sitio configurado en el código propio ni en la documentación revisada. No se inventó una redirección para un host desconocido. |
| URLs de WhatsApp, Instagram, Google Maps, YouTube, Behold y `schema.org` | Destinos o identificadores externos intencionados; se conservan. |
| Hosts permitidos para imágenes en `next.config.ts` (Unsplash, Supabase y R2) | Proveedores de recursos, no dominios canónicos del sitio; se conservan. |

La búsqueda comprendió código, configuración, documentación, recursos y
artefactos locales de la aplicación. Se distinguieron las dependencias de
terceros, cachés y respaldos de las fuentes que generan la exportación actual.
No se cambiaron referencias históricas para hacerlas parecer comprobaciones
del estado nuevo. El patrón de rechazo del dominio anterior en el verificador
es intencional.

## Implementación

`SITE_ORIGIN` en `src/lib/seo.ts` sigue siendo la única configuración de origen
usada por la aplicación. Sus consumidores ya estaban centralizados y no
necesitaron modificaciones:

- `siteUrl`, `localizedUrl`, `languageAlternates` y `pageMetadata` generan
  canonical, hreflang ES/EN/x-default, metadataBase, Open Graph y Twitter.
- `src/app/sitemap.ts` genera las mismas 50 URLs y sus alternates.
- `src/app/robots.ts` anuncia `https://evertripviajes.com/sitemap.xml`.
- `JsonLd.tsx` y `RouteJsonLd.tsx` utilizan el mismo origen para la entidad,
  su URL, logo, imágenes, servicios, proveedor y breadcrumbs.
- `BUSINESS_ID` se deriva como **https://evertripviajes.com/#business**.
  Se mantiene una definición LocalBusiness por portada y las referencias
  de Service apuntan a esa misma identidad.
- La raíz mantiene su canonical a `https://evertripviajes.com/es/` y el
  respaldo de idioma existente. No se modificaron reglas de alojamiento.

El literal de dominio en el verificador es una expectativa independiente,
no una segunda configuración de la aplicación: importar `SITE_ORIGIN` como
resultado esperado permitiría que un cambio accidental del origen también
modificara la prueba.

No se alteraron los 23 slugs, las 46 rutas localizadas, los directorios,
los destinos inversos ni `trailingSlash: true`. Se conservaron contenido,
metadatos descriptivos, componentes visuales, CSS, fotografías, video y
enlaces legales. Privacidad, términos y cancelación siguen fuera de alcance.

## Verificación local

`npm run build` terminó correctamente: **57/57 páginas estáticas**.

`npm run verify:seo` terminó correctamente:

- 50 URLs comerciales y 46 páginas de rutas.
- Dos exportaciones QR funcionales/noindex, respaldo raíz y artefacto 404.
- 510 archivos de texto de `out/` examinados, incluidos HTML, XML, RSC, JS,
  CSS y otros formatos de texto exportados; sin el dominio anterior.
- Canonical y hreflang coinciden con las URLs esperadas; sitemap y robots
  usan el dominio definitivo.
- Metadatos sociales y URLs internas de JSON-LD usan el dominio definitivo.
- La identidad LocalBusiness es estable y no hay definiciones duplicadas.

Se mantuvieron las comprobaciones anteriores del verificador. Además, se
introdujeron temporalmente doce errores independientes en los artefactos:
host antiguo en RSC, host antiguo con `www` en JS, canonical, hreflang,
sitemap, identidad anterior, fragmento de identidad incorrecto, logo JSON-LD,
entidad duplicada, Open Graph, Twitter y sitemap de robots. Los doce fueron
rechazados; cada archivo se restauró y la verificación final volvió a pasar.

ESLint de los dos archivos de código modificados y `git diff --check` pasaron.
Una comparación SHA-256 de las fuentes y recursos contra el estado inicial
de esta fase confirmó que solo cambió `src/lib/seo.ts` dentro de `src/` y
`public/`.

## Alcance del commit y artefactos

El único commit de esta fase comprende:

1. `src/lib/seo.ts`.
2. `scripts/verify-static-seo.mjs` (solo los cambios de dominio y validación).
3. `docs/phase-1-seo-deployment.md` (solo las URLs operativas de dominio).
4. `docs/phase-6-production-domain.md`.

Se conservaron sin incorporar al commit los cambios anteriores de redirección
raíz, eliminación del crédito y su documentación. Las validaciones se
ejecutaron sobre el estado de trabajo con esos cambios previos presentes.
No se modificó `main` ni se hizo push o despliegue.

**El artefacto nuevo de esta fase es `out/`.** No se regeneraron los paquetes
`out.zip`, `evertrip-hostinger.zip`, la carpeta `evertrip-hostinger/` ni los ZIP
de `build/`. Esos paquetes anteriores todavía pueden contener `evertrip.co`:
no deben publicarse como la migración de dominio. Al preparar el despliegue,
empaquetar la exportación nueva completa, sin mezclar archivos de builds.

## Pendiente exclusivamente en Hostinger/producción

Estos puntos requieren observar el servidor real después de publicar; un
build local correcto no los valida. No se realizó una nueva comprobación
contra producción ni se modificó la configuración de Hostinger en esta fase.

| Comprobación pendiente | Resultado esperado |
| --- | --- |
| DNS y certificado del dominio definitivo y sus variantes | Hosts previstos resuelven correctamente y sus certificados son válidos. |
| HTTP → HTTPS | Redirección permanente conservando ruta y consulta, sin bucles. |
| `www` → host canónico | Destino `https://evertripviajes.com`, conservando ruta y consulta. |
| `/` y alias raíz | Redirección HTTP al idioma predeterminado sin mostrar el respaldo HTML. |
| `/es/`, `/en/`, ambos directorios y rutas internas | HTTP 200, idioma adecuado y metadata del dominio definitivo. |
| Rutas inexistentes | HTTP 404 real, no una portada con estado 200. |
| Encabezados y caché | Tipos de contenido correctos, caché coherente para HTML y recursos, sin documentos anteriores del CDN. |
| `robots.txt` y `sitemap.xml` públicos | HTTP 200 y dominio definitivo; sitemap conserva las 50 URLs. |
| Recursos y enlaces entre idiomas | Sin errores de carga, rutas y consultas conservadas según el comportamiento aprobado. |

Las observaciones de producción de tareas anteriores no sustituyen esta
validación posterior al despliegue. No se asume una carpeta raíz, certificado,
regla activa o política de caché que no haya sido revisada en Hostinger.
