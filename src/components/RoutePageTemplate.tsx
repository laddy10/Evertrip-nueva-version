import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { RouteDefinition, PriceCard } from "@/data/routes";
import { getWhatsAppLink, getRouteCardTitle } from "@/data/routes";
import { dictionaries } from "@/i18n/dictionaries";
import QuoteCalculator from "./calculator/QuoteCalculator";

interface RoutePageProps {
  locale: Locale;
  route: RouteDefinition;
  priceCards: PriceCard[];
  relatedRoutes: { label: string; slug: string }[];
}
export default function RoutePageTemplate({
  locale,
  route,
  priceCards,
  relatedRoutes,
}: RoutePageProps) {
  const es = locale === "es";
  const t = dictionaries[locale].routePage;
  return (
    <div className="route-journal">
      <section className="route-cover">
        <Image
          src={
            route.image2 ||
            route.image ||
            "/assets/pilot/routes/santa-marta-01.webp"
          }
          alt={getRouteCardTitle(route, locale)}
          fill
          preload
          sizes="100vw"
        />
        <div className="route-cover-shade" />
        <div className="route-cover-copy">
          <Link href={`/${locale}/all-routes`}>
            {es
              ? "El atlas Evertrip / Todas las rutas"
              : "The Evertrip atlas / All routes"}
          </Link>
          <p>{es ? "Tu próximo viaje privado" : "Your next private journey"}</p>
          <h1>{getRouteCardTitle(route, locale)}</h1>
          <span>
            {route.duration[locale]} <i /> {route.idealFor[locale]}
          </span>
        </div>
        <svg
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 60 Q450 130 800 65 T1440 55 V100 H0Z" fill="#f3f4ea" />
        </svg>
      </section>
      <section className="route-planning">
        <div className="route-story">
          <span className="chapter-caption">{t.transferDetails}</span>
          <h2>
            {es
              ? "El camino,\nya está resuelto."
              : "The journey,\ntaken care of."}
          </h2>
          <p>{route.description[locale]}</p>
          <h3>{t.whatsIncluded}</h3>
          <ul>
            {route.highlights[locale].map((item) => (
              <li key={item}>
                <Check size={16} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          {priceCards.length > 0 && (
            <div className="route-prices">
              <h3>{t.priceByVehicle}</h3>
              {priceCards.map((card) => (
                <p key={card.label[locale]}>
                  {card.label[locale]} <strong>{card.price}</strong>
                  {card.note && <small>{card.note[locale]}</small>}
                </p>
              ))}
            </div>
          )}
        </div>
        <div className="route-quote">
          <QuoteCalculator
            routeSlug={route.slug}
            locale={locale}
            routeTitle={route.title[locale]}
            waBaseMessage={route.waMessage[locale]}
          />
        </div>
      </section>
      <section className="route-faq">
        <div>
          <h2>{t.faqTitle}</h2>
          <a
            className="text-link"
            href={getWhatsAppLink(route.waMessage[locale])}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.bookThisTransfer}
            <ArrowUpRight size={18} />
          </a>
        </div>
        <div className="questions-list">
          {route.faqs.map((faq, index) => (
            <details key={faq.q[locale]} open={index === 0}>
              <summary>
                {faq.q[locale]}
                <span>+</span>
              </summary>
              <p>{faq.a[locale]}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="route-related">
        <p className="chapter-caption">{t.relatedRoutes}</p>
        <h2>{es ? "El viaje continúa." : "The journey continues."}</h2>
        <div>
          {relatedRoutes.map((item) => (
            <Link key={item.slug} href={`/${locale}/${item.slug}`}>
              <span>
                {item.label.replace(
                  es ? /^Transporte privado / : /^Private Transfer /,
                  "",
                )}
              </span>
              <ArrowUpRight size={20} />
            </Link>
          ))}
        </div>
        <Link className="text-link" href={`/${locale}/all-routes`}>
          {t.backToAllRoutes}
          <ArrowUpRight size={18} />
        </Link>
      </section>
    </div>
  );
}
