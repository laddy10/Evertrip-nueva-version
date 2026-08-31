"use client";

import type { Locale } from "@/i18n/config";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { routes, getWhatsAppLink } from "@/data/routes";
import { ArrowRight, MapPin, Users, Play, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const LOCATIONS = [
  "Barranquilla",
  "Santa Marta",
  "Cartagena",
  "Palomino",
  "Valledupar",
  "Minca",
  "Tayrona"
];

const content = {
  es: {
    headingPart1: "TU VIAJE POR EL CARIBE",
    headingPart2: "A TU RITMO.",
    subheading: "Traslados privados exclusivos desde el aeropuerto hasta tu hotel. Confiable, seguro y sin estrés.",
    cta: "Reservar Ahora",
    quickQuote: "Cotizar Ruta",
    from: "Origen",
    to: "Destino",
    pax: "Pasajeros",
    watchVideo: "Ver Experiencia",
  },
  en: {
    headingPart1: "YOUR CARIBBEAN JOURNEY",
    headingPart2: "AT YOUR PACE.",
    subheading: "Exclusive private transfers from the airport to your hotel. Reliable, safe, and stress-free.",
    cta: "Book Now",
    quickQuote: "Quote Route",
    from: "From",
    to: "To",
    pax: "Passengers",
    watchVideo: "Watch Experience",
  },
};

export default function Hero({ locale }: { locale: Locale }) {
  const t = content[locale] || content.es;
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    pax: "2"
  });

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.origin === formData.destination) {
      alert(locale === "es" ? "El origen y el destino no pueden ser iguales." : "Origin and destination cannot be the same.");
      return;
    }

    const originSlug = formData.origin.toLowerCase().replace(" ", "-");
    const destSlug = formData.destination.toLowerCase().replace(" ", "-");
    
    // Find a matching predefined route
    const matchedRoute = routes.find(r => 
      r.slug.includes(originSlug) && r.slug.includes(destSlug)
    );

    if (matchedRoute) {
      router.push(`/${locale}/${matchedRoute.slug}?pax=${formData.pax}`);
    } else {
      // Fallback to WhatsApp for unmapped/custom routes
      const msg = locale === "es" 
        ? `*Cotización Especial*\n\n*Ruta:* ${formData.origin} -> ${formData.destination}\n*Pasajeros:* ${formData.pax}`
        : `*Custom Quote*\n\n*Route:* ${formData.origin} -> ${formData.destination}\n*Passengers:* ${formData.pax}`;
      window.open(getWhatsAppLink(msg), "_blank");
    }
  };

  return (
    <section className="relative min-h-screen w-full bg-brand-primary-bg pt-24 pb-12 md:pt-32 md:pb-20 flex flex-col items-center justify-center overflow-hidden">
      {/* Background abstract element (very subtle) */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-brand-accent/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-500/5 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10 w-full flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        
        {/* Text Content */}
        <div className="w-full lg:w-1/2 flex flex-col items-start pt-6 md:pt-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading leading-[1.05] text-brand-text-primary tracking-tight mb-4 md:mb-6">
              <span className="block text-brand-text-secondary">{t.headingPart1}</span>
              <span className="block text-brand-accent">{t.headingPart2}</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <p className="text-base md:text-xl text-brand-text-secondary font-light max-w-lg mb-8 md:mb-10 leading-relaxed">
              {t.subheading}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="w-full max-w-md bg-white p-6 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100"
          >
            <h3 className="text-sm font-semibold text-brand-text-primary mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-accent"></span>
              {t.quickQuote}
            </h3>
            
            <form onSubmit={handleBooking} className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative w-full">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-secondary">
                    <MapPin size={18} />
                  </div>
                  <select 
                    required
                    value={formData.origin}
                    onChange={(e) => setFormData({...formData, origin: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-10 text-sm focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all appearance-none cursor-pointer text-brand-text-primary font-medium"
                  >
                    <option value="" disabled>{t.from}</option>
                    {LOCATIONS.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-text-secondary">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>

                <div className="relative w-full">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-secondary">
                    <MapPin size={18} />
                  </div>
                  <select 
                    required
                    value={formData.destination}
                    onChange={(e) => setFormData({...formData, destination: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-10 text-sm focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all appearance-none cursor-pointer text-brand-text-primary font-medium"
                  >
                    <option value="" disabled>{t.to}</option>
                    {LOCATIONS.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-text-secondary">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="relative w-full">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-secondary">
                    <Users size={18} />
                  </div>
                  <input 
                    type="number" 
                    inputMode="numeric"
                    pattern="[0-9]*"
                    min="1"
                    max="30"
                    placeholder={t.pax}
                    required
                    value={formData.pax}
                    onChange={(e) => setFormData({...formData, pax: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all min-h-[44px]"
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-brand-accent hover:bg-brand-accent-light text-white px-6 rounded-xl flex items-center justify-center transition-colors shadow-md hover:shadow-brand-accent/30 min-h-[44px]"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Video Showcase */}
        <div className="w-full lg:w-1/2 relative min-h-[250px] aspect-[16/9] mt-8 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full rounded-[32px] overflow-hidden shadow-2xl bg-black border border-slate-200/20"
          >
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/QbrpOFVaFbA?autoplay=0&rel=0&v=newlogo" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            ></iframe>
          </motion.div>
        </div>
        
      </div>
    </section>
  );
}
