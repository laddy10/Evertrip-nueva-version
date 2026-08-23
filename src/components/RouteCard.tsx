"use client";

import Image from "next/image";
import Link from "next/link";
import { FaClock, FaUsers, FaStar, FaMapMarkerAlt } from "react-icons/fa";
import type { RouteDefinition } from "@/data/routes";
import type { Locale } from "@/i18n/config";

interface Props {
  route: RouteDefinition;
  locale: Locale;
  startingPrice: string | undefined;
  from: string;
  quote: string;
}

export default function RouteCard({ route, locale, startingPrice, from, quote }: Props) {
  return (
    <div className="relative h-80 md:h-[22rem] rounded-3xl overflow-hidden shadow-md group">
      {/* ── Images ── */}
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
      ) : route.image ? (
        <Image
          src={route.image}
          alt={route.h1[locale]}
          fill
          className="object-cover transition-transform duration-700 hover:scale-105"
        />
      ) : null}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

      {/* Price badge */}
      <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-sm text-brand-navy text-xs font-bold px-4 py-2 rounded-full z-10 shadow-sm pointer-events-none">
        {startingPrice ? `${from} ${startingPrice}` : quote}
      </div>

      {/* Text content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10 pointer-events-none">
        <h2 className="font-bold text-xl mb-2 font-sans leading-tight">{route.h1[locale]}</h2>
        <div className="flex items-center text-xs text-white/90 gap-3 mb-3">
          <span className="flex items-center gap-1.5"><FaUsers className="text-white/70" /> {route.idealFor[locale]}</span>
          <span className="text-white/30">|</span>
          <span className="flex items-center gap-1.5"><FaClock className="text-white/70" /> {route.duration[locale]}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-white/80">
          <span className="flex items-center gap-1.5"><FaMapMarkerAlt className="text-red-400" /> Costa Caribe</span>
          <span className="flex items-center gap-1 text-brand-gold font-semibold"><FaStar /> 4.8</span>
        </div>
      </div>

      {/* Navigation link */}
      <Link href={`/${locale}/${route.slug}`} className="absolute inset-0 z-30">
        <span className="sr-only">{route.h1[locale]}</span>
      </Link>
    </div>
  );
}
