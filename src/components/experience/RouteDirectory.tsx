"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { routes, getRouteCardTitle } from "@/data/routes";
import type { Locale } from "@/i18n/config";

export default function RouteDirectory({ locale }: { locale: Locale }) {
  const es = locale === "es";
  const [query, setQuery] = useState("");
  const matching = routes.filter((route) =>
    getRouteCardTitle(route, locale)
      .toLowerCase()
      .includes(query.toLowerCase().trim()),
  );
  return (
    <div className="route-directory">
      <div className="directory-cover">
        <div>
          <p className="chapter-caption">
            {es ? "El atlas Evertrip" : "The Evertrip atlas"}
          </p>
          <h1>
            {es
              ? "Un Caribe.\nMil caminos."
              : "One Caribbean.\nEndless journeys."}
          </h1>
          <p>
            {es
              ? "Todas nuestras rutas privadas. Encuentra tu destino y deja el camino en nuestras manos."
              : "All our private routes. Find your destination and leave the road to us."}
          </p>
        </div>
        <div className="directory-photo">
          <Image
            src="/assets/pilot/routes/palomino-01.webp"
            alt="Palomino"
            fill
            preload
            sizes="(max-width: 700px) 100vw, 50vw"
          />
        </div>
      </div>
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
              <span>{getRouteCardTitle(route, locale)}</span>
              <small>{route.duration[locale]}</small>
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
