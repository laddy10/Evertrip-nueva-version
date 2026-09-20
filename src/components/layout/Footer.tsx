import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getWhatsAppLink } from "@/data/routes";
import { dictionaries } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

export default function Footer({ locale }: { locale: Locale }) {
  const es = locale === "es";
  const t = dictionaries[locale].footer;
  return (
    <footer className="journey-footer">
      <div className="footer-invitation">
        <h2>
          {es ? "Nos vemos\nen el Caribe." : "See you in\nthe Caribbean."}
        </h2>
        <div>
          <p>{t.readyToBookCopy}</p>
          <a
            className="footer-contact"
            href={getWhatsAppLink(
              es
                ? "Hola Evertrip, quiero cotizar un traslado privado."
                : "Hi Evertrip, I would like a private transfer quote.",
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            +57 314 765 9756
            <ArrowUpRight size={25} />
          </a>
        </div>
      </div>
      <Link
        className="footer-signature"
        href={`/${locale}`}
        aria-label={es ? "Evertrip, inicio" : "Evertrip, home"}
      >
        evertrip.
      </Link>
      <div className="footer-detail">
        <div>
          <p>VIAJES Y TOURS EVERTRIP</p>
          <p>Barranquilla · Santa Marta · Cartagena · Palomino · Valledupar</p>
          <p>
            © {new Date().getFullYear()} Evertrip. {t.rights}
          </p>
        </div>
        <nav aria-label={es ? "Enlaces del pie de página" : "Footer links"}>
          <Link href={`/${locale}/all-routes`}>{t.popularRoutes}</Link>
          <Link href={`/${locale}#how-it-works`}>{t.howItWorks}</Link>
          <Link href={`/${locale}#faq`}>{t.faq}</Link>
          {[t.privacy, t.terms, t.cancellation].map((label) => (
            <a
              key={label}
              href={getWhatsAppLink(
                es
                  ? `Hola, quisiera consultar: ${label}.`
                  : `Hi, I would like to ask about: ${label}.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              {label}
              <span className="sr-only"> (WhatsApp)</span>
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
