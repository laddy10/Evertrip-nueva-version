"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaUser, FaMinus, FaPlus, FaWhatsapp, FaCarSide, FaSuitcase, FaSnowflake } from "react-icons/fa";
import { getQuoteForRoute, getWhatsAppLink } from "@/data/routes";
import type { Locale } from "@/i18n/config";

interface QuoteCalculatorProps {
  routeSlug: string;
  locale: Locale;
  routeTitle: string;
  waBaseMessage: string;
}

export default function QuoteCalculator({ routeSlug, locale, routeTitle, waBaseMessage }: QuoteCalculatorProps) {
  const [passengers, setPassengers] = useState(2);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const paxParam = params.get("pax");
      if (paxParam) {
        const parsed = parseInt(paxParam, 10);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 30) {
          setPassengers(parsed);
        }
      }
    }
  }, []);

  const quote = getQuoteForRoute(routeSlug, passengers);

  const increment = () => {
    if (passengers < 30) setPassengers(p => p + 1);
  };

  const decrement = () => {
    if (passengers > 1) setPassengers(p => p - 1);
  };

  if (!quote) return null;

  const vehicleName = quote.vehicle.name[locale];
  const vehicleFeatures = quote.vehicle.features;
  const isQuoteOnly = quote.isQuoteOnly;

  // Build the specific WA message with all context
  const fullMessage = `${waBaseMessage}\n\nDetalles / Details:\n- Pasajeros / Passengers: ${passengers}\n- Vehículo sugerido / Suggested Vehicle: ${vehicleName}`;
  const waLink = getWhatsAppLink(fullMessage);

  return (
    <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-[0_20px_50px_rgba(27,42,71,0.08)] border border-gray-100 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 rounded-full blur-[40px] pointer-events-none"></div>

      <div className="mb-8 relative z-10">
        <h3 className="font-bold text-2xl text-brand-navy mb-2">
          {locale === "es" ? "Cotiza tu viaje" : "Quote your trip"}
        </h3>
        <p className="text-brand-carbon/60 text-sm">
          {locale === "es" ? "Selecciona la cantidad de pasajeros" : "Select the number of passengers"}
        </p>
      </div>

      {/* Passenger Selector */}
      <div className="mb-8 relative z-10">
        <div className="flex items-center justify-between bg-[#F8FAFC] border border-gray-100 rounded-2xl p-2 shadow-inner">
          <button
            onClick={decrement}
            disabled={passengers <= 1}
            className="w-12 h-12 rounded-xl flex items-center justify-center bg-white text-brand-navy hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-gray-100"
          >
            <FaMinus />
          </button>
          
          <div className="flex items-center gap-3 font-bold text-2xl text-brand-navy">
            <FaUser className="text-brand-accent text-xl" />
            <span>{passengers}</span>
          </div>

          <button
            onClick={increment}
            disabled={passengers >= 30}
            className="w-12 h-12 rounded-xl flex items-center justify-center bg-white text-brand-navy hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-gray-100"
          >
            <FaPlus />
          </button>
        </div>
      </div>

      {/* Assigned Vehicle */}
      <div className="bg-[#F8FAFC] rounded-2xl p-1 mb-8 border border-gray-100 relative z-10 shadow-sm overflow-hidden">
        <div className="relative w-full h-40 bg-white rounded-t-xl overflow-hidden flex items-center justify-center">
          {quote.vehicle.image ? (
            <Image src={quote.vehicle.image} alt={vehicleName} fill className="object-cover" />
          ) : (
            <FaCarSide size={40} className="text-gray-300" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          <div className="absolute bottom-3 left-4 text-white">
             <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white bg-brand-accent px-2.5 py-0.5 rounded-full mb-1.5 inline-block shadow-sm backdrop-blur-sm border border-white/20">
                {locale === "es" ? "Vehículo Asignado" : "Assigned Vehicle"}
              </span>
              <h4 className="font-bold text-xl md:text-2xl leading-tight drop-shadow-lg">{vehicleName}</h4>
          </div>
        </div>
        <div className="p-4 bg-white rounded-b-xl">
          <p className="text-xs text-brand-carbon/70 font-medium mb-3">
            {quote.vehicle.description[locale]}
          </p>
          <ul className="space-y-1.5">
            {vehicleFeatures.map((f, i) => (
              <li key={i} className="text-xs text-brand-carbon/80 flex items-center gap-2 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                {f[locale]}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Price and CTA */}
      <div className="relative z-10 border-t border-gray-100 pt-6">
        <div className="flex justify-between items-end mb-6">
          <span className="text-brand-carbon/60 font-bold uppercase tracking-wider text-sm">
            {locale === "es" ? "Precio Total" : "Total Price"}
          </span>
          <div className="text-right">
            <span className="font-bold text-2xl text-brand-navy tracking-tight">
              {locale === "es" ? "Cotizar" : "Quote"}
            </span>
          </div>
        </div>

        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 bg-[#25D366] text-white w-full py-4 md:py-5 rounded-2xl hover:bg-[#1EBE5D] transition-all shadow-[0_10px_20px_rgba(37,211,102,0.2)] hover:shadow-[0_10px_30px_rgba(37,211,102,0.3)] font-bold text-lg hover:-translate-y-1"
        >
          <FaWhatsapp size={26} />
          {locale === "es" ? "Reservar por WhatsApp" : "Book via WhatsApp"}
        </a>
        
        <div className="mt-4 text-center">
           <p className="text-xs text-brand-carbon/50 font-medium uppercase tracking-wider">
             {locale === "es" ? "Pago directo al conductor" : "Direct payment to driver"}
           </p>
        </div>
      </div>
    </div>
  );
}
