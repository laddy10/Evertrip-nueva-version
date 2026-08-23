"use client";

import { motion } from "framer-motion";
import type { Locale } from "@/i18n/config";

const content = {
  es: {
    title: "Conoce nuestra experiencia",
    subtitle: "Mira cómo es viajar por el Caribe colombiano con nosotros",
  },
  en: {
    title: "Meet our experience",
    subtitle: "See what it's like to travel the Colombian Caribbean with us",
  },
};

export default function MainVideoSection({ locale = "es" }: { locale?: Locale }) {
  const t = content[locale] || content.es;

  return (
    <section className="relative py-24 md:py-32 bg-brand-carbon overflow-hidden border-b border-white/5">
      {/* Subtle Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-md">
            {t.title}
          </h2>
          <p className="text-lg md:text-xl text-white/70 font-light max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto"
        >
          {/* Authentic YouTube Iframe */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.5)] border border-white/10 bg-black">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/QbrpOFVaFbA?autoplay=0&rel=0" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
