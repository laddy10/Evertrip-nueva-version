"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { tours } from "@/data/tours";
import type { Locale } from "@/i18n/config";

export default function TourExperiences({ locale }: { locale: Locale }) {
  const es = locale === "es";

  return (
    <section className="tour-showcase" id="tours" aria-labelledby="tour-showcase-title">
      <div className="tour-showcase-heading">
        <p className="chapter-caption">{es ? "Experiencias Evertrip" : "Evertrip experiences"}</p>
        <h2 id="tour-showcase-title">
          {es ? "También es lo que vives cuando llegas." : "It’s also what you experience when you arrive."}
        </h2>
        <p>
          {es
            ? "Naturaleza, cultura y aventura para descubrir otra cara del Caribe."
            : "Nature, culture and adventure to discover another side of the Caribbean."}
        </p>
      </div>

      <div className="tour-showcase-grid">
        {tours.map((tour, index) => {
          const coverImage =
            tour.slug === "avistamiento-flamencos-tarde-rancheria"
              ? tour.images.find((image) => image.src.endsWith("/rancheria.webp"))
              : tour.images[0];

          return (
          <Link key={tour.slug} href={"/" + locale + "/tours/#" + tour.slug} className="tour-showcase-card">
            <div className="tour-showcase-media">
              {coverImage ? (
                <Image
                  src={coverImage.src}
                  alt={coverImage.alt[locale]}
                  fill
                  sizes="(max-width: 700px) 92vw, 31vw"
                />
              ) : (
                <div className="tour-showcase-empty" aria-hidden="true">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
              )}
            </div>
            <div className="tour-showcase-card-copy">
              <span>{tour.category[locale]}</span>
              <h3>{tour.name[locale]}</h3>
              <p>{tour.location[locale]}</p>
              <ArrowUpRight size={21} aria-hidden="true" />
            </div>
          </Link>
          );
        })}
      </div>

      <Link href={"/" + locale + "/tours/"} className="tour-showcase-all">
        {es ? "Explorar todas las experiencias" : "Explore all experiences"}
        <ArrowUpRight size={18} aria-hidden="true" />
      </Link>
    </section>
  );
}
