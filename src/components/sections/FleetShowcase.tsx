"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaCarSide } from "react-icons/fa";

const content = {
  es: {
    sectionTag: "NUESTROS CARROS",
    heading: "Tu comodidad es lo primero",
    subheading: "Nuestra flota está diseñada para ofrecerte el viaje más relajante posible. Mantenimiento estricto, aire acondicionado potente y amplio espacio.",
    cars: [
      {
        name: "BUS EJECUTIVO",
        model: "MODELO 2024",
        capacity: "30 PASAJEROS",
        images: [
          "/assets/carros1/ChatGPT%20Image%20Aug%205,%202026,%2001_11_08%20PM.png",
          "/assets/carros1/ChatGPT%20Image%20Aug%205,%202026,%2001_14_10%20PM.png",
          "/assets/carros1/car-1.png"
        ]
      },
      {
        name: "HYUNDAI H1",
        model: "MODELO 2024",
        capacity: "17 PASAJEROS",
        images: [
          "/assets/carros2/ChatGPT%20Image%20Aug%205,%202026,%2001_20_30%20PM.png",
          "/assets/carros2/ChatGPT%20Image%20Aug%205,%202026,%2001_20_34%20PM.png",
          "/assets/carros2/ChatGPT%20Image%20Aug%205,%202026,%2001_21_24%20PM.png"
        ]
      },
      {
        name: "MERCEDES VITO",
        model: "MODELO 2020",
        capacity: "10 PASAJEROS",
        images: [
          "/assets/carros3/ChatGPT%20Image%20Aug%205,%202026,%2001_42_01%20PM.png",
          "/assets/carros3/ChatGPT%20Image%20Aug%205,%202026,%2001_42_06%20PM.png",
          "/assets/carros3/ChatGPT%20Image%20Aug%205,%202026,%2001_47_35%20PM.png"
        ]
      },
      {
        name: "NISSAN KICKS",
        model: "MODELO 2026",
        capacity: "4 PASAJEROS",
        images: [
          "/assets/carros4/ChatGPT%20Image%20Aug%205,%202026,%2001_58_38%20PM.png",
          "/assets/carros4/ChatGPT%20Image%20Aug%205,%202026,%2001_58_42%20PM.png",
          "/assets/carros4/ChatGPT%20Image%20Aug%205,%202026,%2001_58_47%20PM.png"
        ]
      },
      {
        name: "RENAULT DUSTER",
        model: "MODELO 2025",
        capacity: "4 PASAJEROS",
        images: [
          "/assets/carros5/ChatGPT%20Image%20Aug%205,%202026,%2002_09_17%20PM.png",
          "/assets/carros5/ChatGPT%20Image%20Aug%205,%202026,%2002_09_22%20PM.png",
          "/assets/carros5/ChatGPT%20Image%20Aug%205,%202026,%2002_09_39%20PM.png"
        ]
      }
    ]
  },
  en: {
    sectionTag: "OUR CARS",
    heading: "Your comfort comes first",
    subheading: "Our fleet is designed to offer you the most relaxing trip possible. Strict maintenance, powerful AC, and plenty of space.",
    cars: [
      {
        name: "EXECUTIVE BUS",
        model: "2024 MODEL",
        capacity: "30 PASSENGERS",
        images: [
          "/assets/carros1/ChatGPT%20Image%20Aug%205,%202026,%2001_11_08%20PM.png",
          "/assets/carros1/ChatGPT%20Image%20Aug%205,%202026,%2001_14_10%20PM.png",
          "/assets/carros1/car-1.png"
        ]
      },
      {
        name: "HYUNDAI H1",
        model: "2024 MODEL",
        capacity: "17 PASSENGERS",
        images: [
          "/assets/carros2/ChatGPT%20Image%20Aug%205,%202026,%2001_20_30%20PM.png",
          "/assets/carros2/ChatGPT%20Image%20Aug%205,%202026,%2001_20_34%20PM.png",
          "/assets/carros2/ChatGPT%20Image%20Aug%205,%202026,%2001_21_24%20PM.png"
        ]
      },
      {
        name: "MERCEDES VITO",
        model: "2020 MODEL",
        capacity: "10 PASSENGERS",
        images: [
          "/assets/carros3/ChatGPT%20Image%20Aug%205,%202026,%2001_42_01%20PM.png",
          "/assets/carros3/ChatGPT%20Image%20Aug%205,%202026,%2001_42_06%20PM.png",
          "/assets/carros3/ChatGPT%20Image%20Aug%205,%202026,%2001_47_35%20PM.png"
        ]
      },
      {
        name: "NISSAN KICKS",
        model: "2026 MODEL",
        capacity: "4 PASSENGERS",
        images: [
          "/assets/carros4/ChatGPT%20Image%20Aug%205,%202026,%2001_58_38%20PM.png",
          "/assets/carros4/ChatGPT%20Image%20Aug%205,%202026,%2001_58_42%20PM.png",
          "/assets/carros4/ChatGPT%20Image%20Aug%205,%202026,%2001_58_47%20PM.png"
        ]
      },
      {
        name: "RENAULT DUSTER",
        model: "2025 MODEL",
        capacity: "4 PASSENGERS",
        images: [
          "/assets/carros5/ChatGPT%20Image%20Aug%205,%202026,%2002_09_17%20PM.png",
          "/assets/carros5/ChatGPT%20Image%20Aug%205,%202026,%2002_09_22%20PM.png",
          "/assets/carros5/ChatGPT%20Image%20Aug%205,%202026,%2002_09_39%20PM.png"
        ]
      }
    ]
  }
};

import { Users } from "lucide-react";
import { useEffect, useRef } from "react";

function CarGallery({ images, name, model, capacity, delay, priority = false }: { images: string[], name: string, model: string, capacity: string, delay: number, priority?: boolean }) {
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    let newPage = page + newDirection;
    if (newPage < 0) newPage = images.length - 1;
    if (newPage >= images.length) newPage = 0;
    setPage([newPage, newDirection]);
  };

  const next = () => paginate(1);
  const prev = () => paginate(-1);
  const goTo = (index: number) => {
    setPage([index, index > page ? 1 : -1]);
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay, duration: 0.6 }}
      className="relative group bg-white rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-slate-100 flex flex-col hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
    >
      <div className="p-5 bg-white text-center z-10 relative">
        <h3 className="font-heading font-bold text-lg text-[#0F292E] tracking-tight">{name}</h3>
        <p className="text-[#0E6C75] text-xs font-semibold mt-1 tracking-wider">{model}</p>
      </div>

      <div className="relative aspect-[4/3] w-full bg-slate-50 overflow-hidden touch-pan-y">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <Image
              src={images[page]}
              alt={`${name} - view ${page + 1}`}
              fill
              priority={priority}
              sizes="(max-width: 768px) 85vw, 340px"
              className="object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full text-brand-text-primary shadow-lg hover:bg-white hover:scale-110 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10"
              aria-label="Previous image"
            >
              <FaChevronLeft size={10} />
            </button>
            <button
              onClick={next}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full text-brand-text-primary shadow-lg hover:bg-white hover:scale-110 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10"
              aria-label="Next image"
            >
              <FaChevronRight size={10} />
            </button>
          </>
        )}

        <div className="absolute bottom-4 left-0 right-0 flex gap-2 justify-center z-20">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              aria-label={`Ir a la imagen ${idx + 1}`}
              className={`h-2 rounded-full shadow-md transition-all duration-300 ${idx === page ? "w-6 bg-white" : "w-2 bg-white/60 hover:bg-white"} cursor-pointer`}
            />
          ))}
        </div>
      </div>

      <div className="p-4 bg-white text-center border-t border-slate-100 flex items-center justify-center gap-2">
        <Users className="w-4 h-4 text-[#0F292E]" />
        <span className="text-sm font-medium text-[#2C3E42]">{capacity}</span>
      </div>
    </motion.div>
  );
}

export default function FleetShowcase({ locale }: { locale: Locale }) {
  const t = content[locale] || content.es;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        // Check if we are near the end
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll by approx one card width + gap (e.g. 340 + 24)
          scrollRef.current.scrollBy({ left: 364, behavior: 'smooth' });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 md:py-24 bg-brand-light-bg" id="fleet">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-brand-accent tracking-[0.2em] text-xs font-semibold uppercase mb-4">{t.sectionTag}</p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-brand-text-primary mb-4">{t.heading}</h2>
          <p className="text-base md:text-lg text-brand-text-secondary max-w-2xl mx-auto">{t.subheading}</p>
        </div>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory pb-8 -mx-6 px-6 md:-mx-4 md:px-4 gap-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
        >
          {t.cars.map((car, index) => (
            <div key={index} className="w-[85vw] sm:w-[320px] lg:w-[340px] shrink-0 snap-center">
              <CarGallery
                images={car.images}
                name={car.name}
                model={car.model}
                capacity={car.capacity}
                delay={index * 0.1}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
