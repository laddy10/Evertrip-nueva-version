"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftRight, ArrowUpRight } from "lucide-react";
import type { Locale } from "@/i18n/config";

const routesShowcase = [
  {
    label: "Santa Marta ↔ Barranquilla",
    slug: "barranquilla-to-santa-marta",
    origin: "Santa Marta",
    destination: "Barranquilla",
    originPhoto: "santa-marta-01.webp",
    destinationPhoto: "barranquilla-01.webp",
    es: "Dos ciudades del Caribe, un solo camino.",
    en: "Two Caribbean cities, one seamless journey.",
  },
  {
    label: "Santa Marta ↔ Cartagena",
    slug: "private-transfer-santa-marta-cartagena",
    origin: "Santa Marta",
    destination: "Cartagena",
    originPhoto: "santa-marta-01.webp",
    destinationPhoto: "cartagena-01.webp",
    es: "Del mar de Santa Marta a las murallas de Cartagena.",
    en: "From Santa Marta's coast to Cartagena's walls.",
  },
  {
    label: "Santa Marta ↔ Palomino",
    slug: "santa-marta-to-palomino",
    origin: "Santa Marta",
    destination: "Palomino",
    originPhoto: "santa-marta-01.webp",
    destinationPhoto: "palomino-01.webp",
    es: "Donde la ciudad da paso a la naturaleza.",
    en: "Where the city gives way to nature.",
  },
  {
    label: "Cartagena ↔ Barranquilla",
    slug: "cartagena-to-barranquilla",
    origin: "Cartagena",
    destination: "Barranquilla",
    originPhoto: "cartagena-01.webp",
    destinationPhoto: "barranquilla-01.webp",
    es: "Dos capitales del Caribe conectadas en privado.",
    en: "Two Caribbean capitals connected in private.",
  },
  {
    label: "Santa Marta ↔ Tayrona",
    slug: "santa-marta-to-tayrona",
    origin: "Santa Marta",
    destination: "Tayrona",
    originPhoto: "santa-marta-01.webp",
    destinationPhoto: "tayrona-01.webp",
    es: "De la ciudad a la naturaleza del Tayrona.",
    en: "From the city to Tayrona's natural landscape.",
  },
];

export default function DestinationAtlas({
  locale,
  durations,
}: {
  locale: Locale;
  durations: Record<string, string>;
}) {
  const [active, setActive] = useState(0);
  const route = routesShowcase[active];
  const es = locale === "es";
  return (
    <section
      className="destination-atlas"
      id="routes"
      aria-labelledby="atlas-title"
    >
      <div className="atlas-intro">
        <p className="chapter-caption">
          {es ? "El Caribe, de cerca" : "The Caribbean, up close"}
        </p>
        <h2 id="atlas-title">
          {es ? "No es solo\na dónde vas." : "It’s more than\nwhere you go."}
        </h2>
        <p>
          {es
            ? "Es todo lo que descubres en el camino. Viajes privados desde Santa Marta y entre los destinos de la costa."
            : "It’s everything you discover along the way. Private journeys from Santa Marta and between the coast’s destinations."}
        </p>
      </div>
      <div className="atlas-spread">
        <div className="atlas-destinations">
          <p className="chapter-caption">
            {es ? "El Caribe, de cerca" : "The Caribbean, up close"}
          </p>
          <h2 className="atlas-inline-title">
            {es ? "No es solo a dónde vas." : "It’s more than where you go."}
          </h2>
          <p className="atlas-inline-copy">
            {es
              ? "Cada ruta tiene su propio ritmo, paisaje y forma de vivirse."
              : "Every route has its own rhythm, landscape, and way to be experienced."}
          </p>
          <span className="small-note">
            {es ? "Elige una ruta" : "Choose a route"}
          </span>
          <div className="atlas-route-list" role="list">
            {routesShowcase.map((item, index) => (
              <button
                key={item.slug}
                type="button"
                role="listitem"
                aria-pressed={active === index}
                onClick={() => setActive(index)}
              >
                <span className="atlas-route-option">
                  <span>{item.origin}</span>
                  <ArrowLeftRight size={15} aria-hidden="true" />
                  <span>{item.destination}</span>
                </span>
                <span className="atlas-route-state" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </button>
            ))}
          </div>
          <Link href={`/${locale}/all-routes`} className="atlas-all">
            {es ? "Explora todas las rutas" : "Explore every route"}
            <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="atlas-landscape" aria-live="polite">
          <div className="atlas-photo">
            <div className="atlas-photo-pair">
              <div className="atlas-photo-panel">
                <Image
                  src={`/assets/pilot/routes/${route.originPhoto}`}
                  alt={route.origin}
                  fill
                  sizes="(max-width: 700px) 50vw, 30vw"
                />
                <span className="atlas-photo-place">{route.origin}</span>
              </div>
              <div className="atlas-photo-panel">
                <Image
                  key={route.destinationPhoto}
                  src={`/assets/pilot/routes/${route.destinationPhoto}`}
                  alt={route.destination}
                  fill
                  sizes="(max-width: 700px) 50vw, 34vw"
                />
                <span className="atlas-photo-place">{route.destination}</span>
              </div>
            </div>
            <span className="atlas-photo-caption">{route[locale]}</span>
          </div>
          <div className="atlas-route">
            <div>
              <span>
                {es ? "Disponible en ambos sentidos" : "Available both ways"}
              </span>
              <strong>{route.label}</strong>
            </div>
            <span>{durations[route.slug]}</span>
            <Link
              href={`/${locale}/${route.slug}`}
              aria-label={`${es ? "Ver ruta" : "View route"} ${route.label}`}
            >
              <ArrowUpRight size={28} />
            </Link>
          </div>
        </div>
      </div>
      <div className="atlas-outro">
        <span>
          {es ? "Tú pones el destino." : "You bring the destination."}
        </span>
        <span>{es ? "Nosotros, el camino." : "We bring the journey."}</span>
        <svg viewBox="0 0 600 160" fill="none" aria-hidden="true">
          <path
            d="M600 10 C420 10 430 100 250 60 S70 40 60 160"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="590" cy="10" r="4" fill="currentColor" />
        </svg>
      </div>
    </section>
  );
}
