"use client";

import type { Locale } from "@/i18n/config";
import { motion } from "framer-motion";
import { FaUserTie, FaMapMarkedAlt, FaCarSide } from "react-icons/fa";

const content = {
  es: {
    badge: "POR QUÉ ELEGIRNOS",
    heading: "La forma inteligente de viajar",
    features: [
      {
        icon: <FaUserTie className="w-8 h-8 text-brand-accent" />,
        title: "Te esperamos en el aeropuerto",
        desc: "Sin filas, sin negociar con taxis. Un conductor profesional te recibirá con un cartel y una sonrisa apenas aterrices."
      },
      {
        icon: <FaMapMarkedAlt className="w-8 h-8 text-brand-accent" />,
        title: "Paradas Flexibles",
        desc: "Disfruta del viaje a tu ritmo. Incluimos una parada de cortesía (15-25 min) sin costo adicional para comer, tomar fotos o estirar las piernas."
      },
      {
        icon: <FaCarSide className="w-8 h-8 text-brand-accent" />,
        title: "Flota Moderna y Segura",
        desc: "Vehículos climatizados, cómodos y mantenidos bajo los más altos estándares. Tu seguridad es nuestra absoluta prioridad."
      }
    ]
  },
  en: {
    badge: "WHY CHOOSE US",
    heading: "The smart way to travel",
    features: [
      {
        icon: <FaUserTie className="w-8 h-8 text-brand-accent" />,
        title: "We wait for you at the airport",
        desc: "No lines, no haggling with taxis. A professional driver will welcome you with a sign and a smile as soon as you land."
      },
      {
        icon: <FaMapMarkedAlt className="w-8 h-8 text-brand-accent" />,
        title: "Flexible Stops",
        desc: "Enjoy the journey at your own pace. We include a complimentary stop (15-25 mins) at no extra cost to eat, take photos, or stretch your legs."
      },
      {
        icon: <FaCarSide className="w-8 h-8 text-brand-accent" />,
        title: "Modern & Safe Fleet",
        desc: "Air-conditioned, comfortable vehicles maintained to the highest standards. Your safety is our absolute priority."
      }
    ]
  }
};

export default function WhyChooseUs({ locale }: { locale: Locale }) {
  const t = content[locale] || content.es;

  return (
    <section className="py-16 md:py-24 bg-brand-light-bg relative border-t border-slate-100" id="why-choose-us">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-12 md:mb-20">
          <p className="text-brand-accent tracking-[0.2em] text-xs font-semibold uppercase mb-4">{t.badge}</p>
          <h2 className="text-3xl md:text-5xl font-heading text-brand-text-primary mb-4">{t.heading}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
          {t.features.map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15, duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-500">
                {feature.icon}
              </div>
              
              <h3 className="font-heading font-bold text-xl md:text-2xl text-brand-text-primary mb-3 md:mb-4">{feature.title}</h3>
              <p className="text-base text-brand-text-secondary leading-relaxed max-w-sm">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
