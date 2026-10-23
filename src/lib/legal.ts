import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import type { Locale } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";

export const legalDocuments = {
  "privacy-policy": {
    es: {
      file: "politica-privacidad.md",
      label: "Política de privacidad",
      description: "Política de privacidad y tratamiento de datos personales de EverTrip Viajes. Responsable, finalidades, derechos y canales de atención.",
    },
    en: {
      file: "privacy-policy.en.md",
      label: "Privacy Policy",
      description: "EverTrip Viajes privacy and personal data processing policy. Data controller, purposes, rights and contact channels.",
    },
  },
  "terms-and-conditions": {
    es: {
      file: "terminos-condiciones.md",
      label: "Términos y condiciones",
      description: "Términos y condiciones de EverTrip Viajes para traslados privados y experiencias turísticas: reservas, pagos, cancelaciones y atención al cliente.",
    },
    en: {
      file: "terms-and-conditions.en.md",
      label: "Terms & Conditions",
      description: "EverTrip Viajes terms and conditions for private transfers and tourism experiences: bookings, payments, cancellations and customer support.",
    },
  },
} as const;

export type LegalSlug = keyof typeof legalDocuments;
export const legalSlugs = Object.keys(legalDocuments) as LegalSlug[];

// Read the approved documents at build time; no content fetching or parser ships
// to the browser. Only the explicitly pending date line is withheld from display.
export const getLegalDocument = cache(async (locale: Locale, slug: LegalSlug) => {
  const source = await readFile(path.join(process.cwd(), "docs/legal", legalDocuments[slug][locale].file), "utf8");
  const markdown = source.replace(/\r\n/g, "\n").replace(
    /^\*\*(?:Fecha de entrada en vigor|Effective date):\*\* \[(?:FECHA DE PUBLICACIÓN — COMPLETAR AL PUBLICAR|PUBLICATION DATE — TO BE COMPLETED UPON PUBLICATION)\]\s*$/m,
    "",
  ).trim();
  const [introduction, ...parts] = markdown.split(/^## /m);
  const [title, ...preamble] = introduction.trim().split("\n");
  if (!title.startsWith("# ") || !parts.length) throw new Error(`Invalid legal document: ${slug}/${locale}`);

  return {
    title: title.slice(2),
    preamble: preamble.join("\n").trim(),
    sections: parts.map((part) => {
      const [heading, ...body] = part.trim().split("\n");
      const number = heading.match(/^(\d+)\./)?.[1];
      if (!number) throw new Error(`Unnumbered legal section: ${slug}/${locale}`);
      return { id: `section-${number}`, heading, body: body.join("\n").trim() };
    }),
  };
});

export async function legalMetadata(locale: Locale, slug: LegalSlug) {
  const document = await getLegalDocument(locale, slug);
  return pageMetadata({
    locale,
    path: slug,
    title: `${document.title} | EverTrip`,
    description: legalDocuments[slug][locale].description,
    image: "/assets/logo2-normal-ui.png",
  });
}
