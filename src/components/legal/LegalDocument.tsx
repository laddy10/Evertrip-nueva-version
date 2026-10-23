import Link from "next/link";
import { Fragment } from "react";
import type { Locale } from "@/i18n/config";
import { getLegalDocument, legalDocuments, legalSlugs, type LegalSlug } from "@/lib/legal";
import { localizedPath } from "@/lib/seo";
import styles from "./LegalDocument.module.css";

// The source documents use headings, paragraphs, lists, bold and hard breaks.
// Render that small Markdown subset as React nodes, never as injected HTML.
function InlineText({ text }: { text: string }) {
  return text.split(/(\*\*[^*]+\*\*|https:\/\/[^\s<>]+|[\w.+-]+@[\w.-]+\.[a-zA-Z]+|\+57 314 765 9756| {2}\n)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}><InlineText text={part.slice(2, -2)} /></strong>;
    }
    if (part.startsWith("https://")) {
      const url = part.replace(/[.,;]+$/, "");
      return <Fragment key={index}><a href={url}>{url}</a>{part.slice(url.length)}</Fragment>;
    }
    if (/^[\w.+-]+@[\w.-]+\.[a-zA-Z]+$/.test(part)) {
      return <a key={index} href={`mailto:${part}`}>{part}</a>;
    }
    if (part === "+57 314 765 9756") return <a key={index} href="https://wa.me/573147659756">{part}</a>;
    if (/^ {2}\n$/.test(part)) return <br key={index} />;
    return part;
  });
}

function DocumentText({ text }: { text: string }) {
  return text.split(/\n\s*\n/).map((block, index) => block.startsWith("- ") ? (
    <ul key={index}>
      {block.split("\n").map((item, itemIndex) => <li key={itemIndex}><InlineText text={item.slice(2)} /></li>)}
    </ul>
  ) : <p key={index}><InlineText text={block} /></p>);
}

export default async function LegalDocument({ locale, slug }: { locale: Locale; slug: LegalSlug }) {
  const document = await getLegalDocument(locale, slug);
  const es = locale === "es";

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <a className={styles.skip} href="#legal-content">{es ? "Ir al documento" : "Skip to document"}</a>
        <header className={styles.heading}>
          <Link className={styles.home} href={localizedPath(locale)}>{es ? "Inicio" : "Home"}</Link>
          <div className={styles.byline}><DocumentText text={document.preamble} /></div>
          <h1>{document.title}</h1>
        </header>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <nav className={styles.documents} aria-label={es ? "Documentos legales" : "Legal documents"}>
              {legalSlugs.map((item) => (
                <Link key={item} href={localizedPath(locale, item)} aria-current={item === slug ? "page" : undefined}>
                  {legalDocuments[item][locale].label}
                </Link>
              ))}
            </nav>
            <details className={styles.contents}>
              <summary>{es ? "En esta página" : "On this page"}</summary>
              <nav aria-label={es ? "Índice del documento" : "Document contents"}>
                <ol>
                  {document.sections.map((section) => (
                    <li key={section.id}><a href={`#${section.id}`}>{section.heading}</a></li>
                  ))}
                </ol>
              </nav>
            </details>
          </aside>

          <article id="legal-content" className={styles.document} tabIndex={-1} aria-label={document.title}>
            {document.sections.map((section) => (
              <section key={section.id} id={section.id} className={styles.section} aria-labelledby={`${section.id}-heading`}>
                <h2 id={`${section.id}-heading`}>{section.heading}</h2>
                <DocumentText text={section.body} />
              </section>
            ))}
            <a className={styles.back} href="#legal-content">{es ? "Volver al inicio del documento" : "Back to the start of the document"}</a>
          </article>
        </div>
      </div>
    </div>
  );
}
