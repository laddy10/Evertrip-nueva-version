"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { tours } from "@/data/tours";
import type { Locale } from "@/i18n/config";

export default function TourExperiences({ locale }: { locale: Locale }) {
  const es = locale === "es";
  return (
    <section className="tour-experiences" id="tours" aria-labelledby="tour-experiences-title">
      <div className="tour-experiences-heading">
        <p className="chapter-caption">{es ? "Experiencias Evertrip" : "Evertrip experiences"}</p>
        <h2 id="tour-experiences-title">
          {es ? "También es lo que vives cuando llegas." : "It’s also what you experience when you arrive."}
        </h2>
        <p>
          {es
            ? "Naturaleza, cultura y aventura para descubrir otra cara del Caribe. Los detalles de cada experiencia se coordinan directamente con nuestro equipo."
            : "Nature, culture and adventure to discover another side of the Caribbean. Details for each experience are coordinated directly with our team."}
        </p>
      </div>
      <div className="tour-experience-list">
        {tours.map((tour, index) => (
          <Link key={tour.slug} href={`/${locale}/tours/${tour.slug}`} className="tour-experience-row">
            <span className="tour-experience-index">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <span className="tour-experience-category">{tour.category[locale]}</span>
              <h3>{tour.name[locale]}</h3>
              <p>{tour.location[locale]}</p>
            </div>
            <ArrowUpRight size={25} aria-hidden="true" />
          </Link>
        ))}
      </div>
      <Link href={`/${locale}/tours`} className="tour-experiences-all">
        {es ? "Explorar todas las experiencias" : "Explore all experiences"}
        <ArrowUpRight size={18} aria-hidden="true" />
      </Link>
    </section>
  );
}
