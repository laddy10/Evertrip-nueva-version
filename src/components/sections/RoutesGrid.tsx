"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { routes, getPriceCards } from "@/data/routes";
import { motion } from "framer-motion";
import { Clock, MapPin, Star, Users } from "lucide-react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

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

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth * 0.8;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

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

        <div className="relative">
          <button
            onClick={() => scroll('left')}
            className={`absolute left-2 top-[32vw] -translate-y-1/2 z-10 bg-white/95 p-2.5 rounded-full text-slate-800 shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:bg-white hover:scale-110 transition-all ${showLeftArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'} md:hidden`}
            aria-label="Scroll left"
          >
            <FaChevronLeft size={12} />
          </button>

          <button
            onClick={() => scroll('right')}
            className={`absolute right-2 top-[32vw] -translate-y-1/2 z-10 bg-white/95 p-2.5 rounded-full text-slate-800 shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:bg-white hover:scale-110 transition-all ${showRightArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'} md:hidden`}
            aria-label="Scroll right"
          >
            <FaChevronRight size={12} />
          </button>

          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory pb-8 -mx-6 px-6 md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {cards.map((route, idx) => {
              const priceCards = getPriceCards(route);
              const lowestPrice = priceCards.length > 0 ? priceCards[0].price : null;

              return (
                <Link 
                  key={route.slug} 
                  href={`/${locale}/${route.slug}`}
                >
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: idx * 0.15, duration: 0.6 }}
                    className="group min-w-[280px] w-[85vw] md:w-full flex flex-col cursor-pointer shrink-0 snap-center"
                  >
                    <div className="relative aspect-[4/3] w-full rounded-[16px] overflow-hidden mb-4">
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
                    </div>
                    
                    <div className="flex flex-col px-1">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:underline decoration-2 underline-offset-4 mb-1 truncate">{route.h1[locale]}</h3>
                      
                      <div className="text-sm text-slate-600 mb-2 flex items-center gap-1.5 truncate">
                        <span>{route.duration[locale]}</span>
                        <span>·</span>
                        <span>{route.idealFor[locale]}</span>
                      </div>

                      {lowestPrice && (
                        <div className="text-sm font-medium text-slate-900 underline decoration-1 underline-offset-4">
                          {t.from} {lowestPrice}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
