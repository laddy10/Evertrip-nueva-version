"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getRouteBySlug } from "@/data/routes";
import type { Locale } from "@/i18n/config";

const destinations = [
  {
    name: "Palomino",
    slug: "santa-marta-to-palomino",
    photo: "palomino-01.webp",
    es: "Donde el río encuentra el mar.",
    en: "Where the river meets the sea.",
  },
  {
    name: "Tayrona",
    slug: "santa-marta-to-tayrona",
    photo: "tayrona-01.webp",
    es: "La naturaleza marca el ritmo.",
    en: "Let nature set the pace.",
  },
  {
    name: "Cartagena",
    slug: "private-transfer-santa-marta-cartagena",
    photo: "cartagena-01.webp",
    es: "Historias detrás de cada color.",
    en: "A story behind every color.",
  },
  {
    name: "Minca",
    slug: "santa-marta-to-minca",
    photo: "minca-01.webp",
    es: "Respira. Ya estás en la sierra.",
    en: "Breathe. You’re in the mountains.",
  },
  {
    name: "Barranquilla",
    slug: "barranquilla-to-santa-marta",
    photo: "barranquilla-01.webp",
    es: "El Caribe tiene mil maneras de recibirte.",
    en: "The Caribbean has a thousand welcomes.",
  },
];

export default function DestinationAtlas({ locale }: { locale: Locale }) {
  const [active, setActive] = useState(0);
  const destination = destinations[active];
  const route = getRouteBySlug(destination.slug)!;
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
            {es ? "Elige tu próxima parada" : "Choose your next destination"}
          </span>
          {destinations.map((item, index) => (
            <button
              key={item.slug}
              aria-pressed={active === index}
              onClick={() => setActive(index)}
            >
              <span>{item.name}</span>
              <ArrowUpRight size={24} aria-hidden="true" />
            </button>
          ))}
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
                  src="/assets/pilot/routes/santa-marta-01.webp"
                  alt={es ? "Santa Marta" : "Santa Marta"}
                  fill
                  sizes="(max-width: 700px) 50vw, 30vw"
                />
                <span className="atlas-photo-place">Santa Marta</span>
              </div>
              <div className="atlas-photo-panel">
                <Image
                  key={destination.photo}
                  src={`/assets/pilot/routes/${destination.photo}`}
                  alt={destination.name}
                  fill
                  sizes="(max-width: 700px) 50vw, 34vw"
                />
                <span className="atlas-photo-place">{destination.name}</span>
              </div>
            </div>
            <span className="atlas-photo-caption">{destination[locale]}</span>
          </div>
          <div className="atlas-route">
            <div>
              <span>{es ? "Desde Santa Marta" : "From Santa Marta"}</span>
              <strong>{destination.name}</strong>
            </div>
            <span>{route.duration[locale]}</span>
            <Link
              href={`/${locale}/${destination.slug}`}
              aria-label={`${es ? "Ver ruta a" : "View route to"} ${destination.name}`}
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
