import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { tours, type TourImage } from "@/data/tours";
import type { Locale } from "@/i18n/config";

const homepageCoverImages: Partial<Record<string, TourImage>> = {
  "tubing-rio-don-diego": {
    src: "https://assets.evertripviajes.com/tours/tubing-rio-don-diego/hero_Tubing.webp",
    alt: {
      es: "Viajeros con chalecos salvavidas junto a flotadores en la orilla del río Don Diego",
      en: "Travelers wearing life jackets beside tubes on the bank of the Don Diego River",
    },
  },
  "avistamiento-flamencos-tarde-rancheria": {
    src: "https://assets.evertripviajes.com/tours/flamencos-rancheria/Avistamiento_flamencos.webp",
    alt: {
      es: "Flamencos rosados en las aguas poco profundas de la laguna de Camarones",
      en: "Pink flamingos in the shallow waters of the Camarones lagoon",
    },
  },
};

export default function TourExperiences({ locale }: { locale: Locale }) {
  const es = locale === "es";

  return (
    <section className="tour-showcase" id="tours" aria-labelledby="tour-showcase-title">
      <div className="tour-showcase-inner">
        <div className="tour-showcase-heading">
          <p className="chapter-caption">{es ? "Experiencias Evertrip" : "Evertrip experiences"}</p>
          <h2 id="tour-showcase-title">
            {es ? "Descubre las experiencias que te esperan." : "Discover the experiences waiting for you."}
          </h2>
          <p>
            {es
              ? "Naturaleza, cultura y aventura para descubrir otra cara del Caribe."
              : "Nature, culture and adventure to discover another side of the Caribbean."}
          </p>
        </div>

        <div className="tour-showcase-grid">
          {tours.map((tour) => {
            const coverImage =
              homepageCoverImages[tour.slug] ??
              (tour.slug === "pasadia-cabo-de-la-vela" ? tour.pageImages?.[0] : tour.images[0]);

            return (
              // A document navigation keeps the tour fragment independent of
              // a homepage smooth scroll still in progress.
              <a key={tour.slug} href={"/" + locale + "/tours/#" + tour.slug} className="tour-showcase-card">
                <div className="tour-showcase-media">
                  {coverImage ? (
                    <Image
                      src={coverImage.src}
                      alt={coverImage.alt[locale]}
                      fill
                      sizes="(max-width: 700px) calc(100vw - 48px), (min-width: 1682px) 481px, calc((88vw - 36px) / 3)"
                    />
                  ) : (
                    <div className="tour-showcase-empty">
                      <p>{tour.intro[locale]}</p>
                    </div>
                  )}
                </div>
                <div className="tour-showcase-card-copy">
                  <span>{tour.category[locale]}</span>
                  <h3>{tour.name[locale]}</h3>
                  <p>{tour.location[locale]}</p>
                  <ArrowUpRight size={21} aria-hidden="true" />
                </div>
              </a>
            );
          })}
        </div>

        <Link href={"/" + locale + "/tours/"} className="tour-showcase-all">
          {es ? "Explorar todas las experiencias" : "Explore all experiences"}
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
