"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import type { Locale } from "@/i18n/config";

type RouteSummary = {
  slug: string;
  title: string;
  duration: string;
};

export default function RouteDirectory({
  locale,
  routes,
}: {
  locale: Locale;
  routes: RouteSummary[];
}) {
  const es = locale === "es";
  const [query, setQuery] = useState("");
  const normalizedQuery = query.toLowerCase().trim();
  const matching = routes.filter((route) =>
    route.title.toLowerCase().includes(normalizedQuery),
  );
  return (
    <div className="route-directory">
      <section className="directory-cover" aria-labelledby="routes-directory-title">
        <div className="directory-cover-copy">
          <p className="chapter-caption">
            {es ? "El atlas Evertrip" : "The Evertrip atlas"}
          </p>
          <h1 id="routes-directory-title">
            {es
              ? "Un Caribe.\nMil caminos."
              : "One Caribbean.\nEndless journeys."}
          </h1>
          <p className="directory-cover-lead">
            {es
              ? "Traslados privados entre los principales destinos del Caribe colombiano. Explora la ruta que necesitas y cotiza tu viaje."
              : "Private transfers between the Colombian Caribbean's main destinations. Explore the route you need and request your quote."}
          </p>
          <div className="directory-cover-meta" aria-label={es ? "Cobertura de rutas" : "Route coverage"}>
            <span>
              <strong>{routes.length}</strong>
              {es ? " rutas privadas" : " private routes"}
            </span>
            <span>
              {es
                ? "Santa Marta · Cartagena · Barranquilla · Palomino · Valledupar"
                : "Santa Marta · Cartagena · Barranquilla · Palomino · Valledupar"}
            </span>
          </div>
        </div>
        <div className="directory-photo">
          <Image
            src="/assets/pilot/routes/private-route-01.webp"
            alt={
              es
                ? "Traslado privado Evertrip por el Caribe colombiano"
                : "Evertrip private transfer across the Colombian Caribbean"
            }
            fill
            preload
            sizes="(max-width: 700px) 100vw, 52vw"
          />
        </div>
      </section>
      <div className="directory-index">
        <label htmlFor="route-search">
          <Search size={18} />
          <input
            id="route-search"
            aria-label={es ? "Buscar rutas" : "Search routes"}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              es
                ? "Busca Santa Marta, Palomino, Minca…"
                : "Search Santa Marta, Palomino, Minca…"
            }
          />
        </label>
        <p aria-live="polite">
          {matching.length} {es ? "rutas para explorar" : "routes to explore"}
        </p>
        <div>
          {matching.map((route) => (
            <Link key={route.slug} href={`/${locale}/${route.slug}`}>
              <span>{route.title}</span>
              <small>{route.duration}</small>
              <ArrowUpRight size={23} />
            </Link>
          ))}
        </div>
        {matching.length === 0 && (
          <p>
            {es
              ? "Prueba con otro destino o escríbenos para una ruta personalizada."
              : "Try another destination or contact us for a custom route."}
          </p>
        )}
      </div>
    </div>
  );
}
