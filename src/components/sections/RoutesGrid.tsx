"use client";

import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { routes, getPriceCards } from "@/data/routes";
import { motion } from "framer-motion";
import { Clock, MapPin, Star, Users } from "lucide-react";

const content = {
  es: {
    heading: "Destinos Destacados",
    subheading: "NUESTRAS RUTAS",
    viewAll: "Ver todas las rutas",
    from: "Desde",
  },
  en: {
    heading: "Featured Destinations",
    subheading: "OUR ROUTES",
    viewAll: "View all routes",
    from: "From",
  },
};

const featuredSlugs = [
  "private-transfer-santa-marta-cartagena",
  "santa-marta-to-minca",
  "cartagena-airport-to-santa-marta",
  "barranquilla-to-palomino",
  "barranquilla-to-santa-marta",
  "santa-marta-to-tayrona",
];

export default function RoutesGrid({ locale }: { locale: Locale }) {
  const t = content[locale] || content.es;
  const cards = featuredSlugs
    .map((slug) => routes.find((r) => r.slug === slug))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  return (
    <section id="routes" className="py-16 md:py-24 bg-brand-light-bg relative border-t border-slate-100">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <div>
            <p className="text-brand-accent tracking-[0.2em] text-xs font-semibold uppercase mb-4">{t.subheading}</p>
            <h2 className="text-3xl md:text-5xl font-heading text-brand-text-primary">{t.heading}</h2>
          </div>
          <Link 
            href={`/${locale}/all-routes`} 
            className="flex items-center gap-2 text-sm font-semibold text-brand-text-secondary hover:text-brand-accent transition-colors"
          >
            {t.viewAll} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory pb-8 -mx-6 px-6 md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {cards.map((route, idx) => {
            const priceCards = getPriceCards(route);
            const lowestPrice = priceCards.length > 0 ? priceCards[0].price : null;

            return (
              <Link 
                key={route.slug} 
                href={`/${locale}/${route.slug}`}
                className="group min-w-[300px] w-[85vw] md:w-auto shrink-0 snap-center"
              >
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: idx * 0.15, duration: 0.6 }}
                  className="bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 relative h-[420px] w-full group-hover:-translate-y-1"
                >
                  {route.image2 ? (
                    <div className="absolute inset-0 flex transition-transform duration-700 group-hover:scale-105">
                      <div className="relative w-1/2 h-full overflow-hidden">
                        <Image
                          src={route.image!}
                          alt={route.h1[locale] + " – origen"}
                          fill
                          className="object-cover"
                          draggable={false}
                        />
                      </div>
                      <div className="relative w-1/2 h-full overflow-hidden">
                        <Image
                          src={route.image2}
                          alt={route.h1[locale] + " – destino"}
                          fill
                          className="object-cover"
                          draggable={false}
                        />
                      </div>
                      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-white/40 shadow-[0_0_8px_rgba(0,0,0,0.5)] z-10 pointer-events-none" />
                    </div>
                  ) : (
                    <Image
                      src={route.image || "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&q=80"}
                      alt={route.h1[locale]}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10"></div>
                  
                  {lowestPrice && (
                    <div className="absolute top-5 right-5 bg-white text-brand-text-primary px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
                      {t.from} {lowestPrice}
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 p-6 text-white flex flex-col justify-end h-full">
                    <h3 className="text-xl md:text-2xl font-heading font-bold mb-3 leading-tight">{route.h1[locale]}</h3>
                    
                    <div className="flex items-center gap-3 text-xs md:text-sm font-medium text-white/90 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Users size={14} className="text-white/70" />
                        <span>{route.idealFor[locale]}</span>
                      </div>
                      <div className="w-px h-3 bg-white/30"></div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-white/70" />
                        <span>{route.duration[locale]}</span>
                      </div>
                    </div>

                    <div className="h-px w-full bg-white/20 mb-4"></div>

                    <div className="flex items-center justify-between text-sm font-semibold">
                      <div className="flex items-center gap-1.5 text-white">
                        <MapPin size={16} className="text-red-500 fill-red-500" />
                        <span>Costa Caribe</span>
                      </div>
                      <div className="flex items-center gap-1 text-white">
                        <Star size={14} className="fill-white" />
                        <span>4.8</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
