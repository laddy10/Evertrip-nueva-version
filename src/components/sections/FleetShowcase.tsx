"use client";

import { useState, useId, type MouseEvent, type PointerEvent } from "react";
import type { Locale } from "@/i18n/config";
import Image from "next/image";
import { vehicles, type VehicleId } from "@/data/vehicles";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaCarSide } from "react-icons/fa";

const content = {
  es: {
    sectionTag: "La flota Evertrip",
    heading: "Tu comodidad es lo primero",
    subheading: "Nuestra flota está diseñada para ofrecerte el viaje más relajante posible. Mantenimiento estricto, aire acondicionado potente y amplio espacio.",
    cars: [
      {
        name: "BUS EJECUTIVO",
        model: "MODELO 2024",
        capacity: "30 PASAJEROS",
        images: [
          "/assets/vehicles/bus-ejecutivo/Bus-exterior-1-webp-q92.webp",
          "/assets/vehicles/bus-ejecutivo/Bus-exterior-2-webp-q92.webp",
          "/assets/vehicles/bus-ejecutivo/Bus-interior-1-webp-q92.webp"
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
    sectionTag: "The Evertrip fleet",
    heading: "Your comfort comes first",
    subheading: "Our fleet is designed to offer you the most relaxing trip possible. Strict maintenance, powerful AC, and plenty of space.",
    cars: [
      {
        name: "EXECUTIVE BUS",
        model: "2024 MODEL",
        capacity: "30 PASSENGERS",
        images: [
          "/assets/vehicles/bus-ejecutivo/Bus-exterior-1-webp-q92.webp",
          "/assets/vehicles/bus-ejecutivo/Bus-exterior-2-webp-q92.webp",
          "/assets/vehicles/bus-ejecutivo/Bus-interior-1-webp-q92.webp"
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

import { Users, X } from "lucide-react";
import { useRef, useEffect } from "react";

const lightboxLabels = {
  es: { open: "Ampliar imagen de", close: "Cerrar galería", previous: "Imagen anterior", next: "Imagen siguiente", image: "Imagen", of: "de" },
  en: { open: "Enlarge image of", close: "Close gallery", previous: "Previous image", next: "Next image", image: "Image", of: "of" },
};

export function useClickGesture() {
  const gestureRef = useRef<{
    pointerId: number; x: number; y: number;
    moved: boolean; dragged: boolean; cancelled: boolean; released: boolean;
  } | null>(null);

  const cancel = () => {
    if (gestureRef.current) gestureRef.current.cancelled = true;
  };
  const leave = (event: PointerEvent<HTMLElement>) => {
    const gesture = gestureRef.current;

    if (
      gesture &&
      gesture.pointerId === event.pointerId &&
      !gesture.released
    ) {
      gesture.cancelled = true;
    }
  };
  const begin = (event: PointerEvent<HTMLElement>, allowed = true) => {
    gestureRef.current = allowed && event.isPrimary && event.button === 0
      ? { pointerId: event.pointerId, x: event.clientX, y: event.clientY, moved: false, dragged: false, cancelled: false, released: false }
      : null;
  };
  const move = (event: PointerEvent<HTMLElement>) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    if (Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y) > 6) gesture.moved = true;
  };
  const release = (event: PointerEvent<HTMLElement>) => {
    move(event);
    const gesture = gestureRef.current;
    if (gesture?.pointerId === event.pointerId) gesture.released = true;
  };
  const markDrag = () => {
    if (gestureRef.current) gestureRef.current.dragged = true;
  };
  const consumeClick = (event: MouseEvent<HTMLElement>, allowKeyboard = true) => {
    const gesture = gestureRef.current;
    gestureRef.current = null;
    const pointerClick = "pointerType" in event.nativeEvent && event.nativeEvent.pointerType;
    if (allowKeyboard && event.detail === 0 && !pointerClick) return true;
    return !!gesture && gesture.released && !gesture.moved && !gesture.dragged && !gesture.cancelled;
  };

  return { begin, move, release, cancel, leave, markDrag, consumeClick };
}

export function VehicleLightbox({ name, images, imageIndex, locale, opener, onClose, onNavigate }: {
  name: string; images: string[]; imageIndex: number; locale: Locale;
  opener: HTMLButtonElement; onClose: () => void; onNavigate: (direction: number) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const backdropGesture = useClickGesture();
  const labels = lightboxLabels[locale];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const { scrollX, scrollY } = window;
    const body = document.body;
    const properties = ["position", "top", "left", "width", "overflow", "padding-right"];
    const previousStyles = properties.map(property => [property, body.style.getPropertyValue(property), body.style.getPropertyPriority(property)]);
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const paddingRight = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
    Object.assign(body.style, { position: "fixed", top: `-${scrollY}px`, left: `-${scrollX}px`, width: "100%", overflow: "hidden", paddingRight: `${paddingRight + scrollbarWidth}px` });
    dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });

    return () => {
      dialog.close();
      previousStyles.forEach(([property, value, priority]) => {
        if (value) body.style.setProperty(property, value, priority);
        else body.style.removeProperty(property);
      });
      window.scrollTo({ left: scrollX, top: scrollY, behavior: "instant" });
      if (opener.isConnected) opener.focus({ preventScroll: true });
    };
  }, [opener]);

  const controlClass = "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onPointerDownCapture={(event) => backdropGesture.begin(event, event.target === event.currentTarget)}
      onPointerMoveCapture={backdropGesture.move}
      onPointerUpCapture={(event) => {
        if (event.target !== event.currentTarget) backdropGesture.cancel();
        backdropGesture.release(event);
      }}
      onPointerCancel={backdropGesture.cancel}
      onPointerLeave={backdropGesture.cancel}
      onClick={(event) => {
        const validClick = backdropGesture.consumeClick(event, false);
        if (event.target === event.currentTarget && validClick) onClose();
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none items-center justify-center border-0 bg-transparent p-4 text-white backdrop:bg-black/85 open:flex sm:p-8"
    >
      <div className="flex max-h-full w-full max-w-6xl flex-col gap-4 rounded-2xl bg-[#16474D] p-4 shadow-2xl sm:p-6">
        <div className="flex shrink-0 items-center justify-between gap-4">
          <h2 id={titleId} className="font-heading text-lg font-bold sm:text-2xl">{name}</h2>
          <button ref={closeRef} type="button" onClick={onClose} aria-label={labels.close} className={controlClass}>
            <X size={22} aria-hidden="true" />
          </button>
        </div>
        <div className="relative h-[min(65dvh,800px)] min-h-0 shrink overflow-hidden">
          <Image
            src={images[imageIndex]}
            alt={`${name} - ${labels.image} ${imageIndex + 1} ${labels.of} ${images.length}`}
            fill
            sizes="(max-width: 768px) 100vw, 90vw"
            className="object-contain"
          />
        </div>
        <div className="flex shrink-0 items-center justify-center gap-6">
          <button type="button" onClick={() => onNavigate(-1)} aria-label={labels.previous} className={controlClass}>
            <FaChevronLeft aria-hidden="true" />
          </button>
          <span aria-live="polite" aria-atomic="true" className="min-w-12 text-center text-sm tabular-nums">
            <span className="sr-only">{labels.image} </span>{imageIndex + 1}/{images.length}
          </span>
          <button type="button" onClick={() => onNavigate(1)} aria-label={labels.next} className={controlClass}>
            <FaChevronRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </dialog>
  );
}

function CarGallery({ images, name, model, category, capacity, delay, priority = false, locale, onOpenImage }: { images: string[], name: string, model: string, category: string, capacity: string, delay: number, priority?: boolean, locale: Locale, onOpenImage: (imageIndex: number, opener: HTMLButtonElement) => void }) {
  const [[page, direction], setPage] = useState([0, 0]);
  const photoGesture = useClickGesture();

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
      onPointerDownCapture={photoGesture.cancel}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay, duration: 0.6 }}
      className="relative group bg-white rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-slate-100 flex flex-col hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
    >
      <div data-fleet-drag-handle className="p-5 bg-white text-center z-10 relative">
        <h3 className="font-heading font-bold text-lg text-[#0F292E] tracking-tight">{name}</h3>
        <p className="text-[#0E6C75] text-xs font-medium mt-1">{category} · {model}</p>
      </div>

      <div className="relative aspect-[4/3] w-full bg-slate-50 overflow-hidden touch-pan-y">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.button
            type="button"
            aria-label={`${lightboxLabels[locale].open} ${name}`}
            aria-haspopup="dialog"
            onPointerDownCapture={(event) => photoGesture.begin(event)}
            onPointerMoveCapture={photoGesture.move}
            onPointerUpCapture={photoGesture.release}
            onPointerCancel={photoGesture.cancel}
            onPointerLeave={photoGesture.leave}
            onDragStart={photoGesture.markDrag}
            onClick={(event) => {
              if (photoGesture.consumeClick(event)) onOpenImage(page, event.currentTarget);
            }}
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
            className="absolute inset-0 w-full cursor-grab border-0 bg-transparent p-0 active:cursor-grabbing focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#0E6C75]"
          >
            <Image
              src={images[page]}
              alt={`${name} - view ${page + 1}`}
              fill
              priority={priority}
              sizes="(max-width: 768px) 85vw, 340px"
              className="object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
            />
          </motion.button>
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

      <div data-fleet-drag-handle className="p-4 bg-white text-center border-t border-slate-100 flex items-center justify-center gap-2">
        <Users className="w-4 h-4 text-[#0F292E]" />
        <span className="text-sm font-medium text-[#2C3E42]">{capacity}</span>
      </div>
    </motion.div>
  );
}

export default function FleetShowcase({ locale }: { locale: Locale }) {
  const t = content[locale] || content.es;
  const [lightbox, setLightbox] = useState<{ vehicleIndex: number; imageIndex: number; opener: HTMLButtonElement } | null>(null);
  const navigateLightbox = (direction: number) => {
    setLightbox(current => current ? {
      ...current,
      imageIndex: (current.imageIndex + direction + t.cars[current.vehicleIndex].images.length) % t.cars[current.vehicleIndex].images.length,
    } : null);
  };
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; scrollLeft: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || !dragRef.current) return;
    dragRef.current = null;
    setIsDragging(false);
  };

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    const container = scrollRef.current;
    if (!container || event.pointerType !== "mouse" || event.button !== 0) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    // Only neutral space and marked card sections can start the outer drag.
    // The photo gallery and its controls never enter this gesture.
    if (target !== container && !target.closest("[data-fleet-drag-handle]")) return;
    if (target.closest("button, a, input, select, textarea, [contenteditable], [role='button']")) return;

    event.preventDefault();
    dragRef.current = { startX: event.clientX, scrollLeft: container.scrollLeft };
    setIsDragging(true);
  };

  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || !dragRef.current || !scrollRef.current) return;
    if ((event.buttons & 1) === 0) {
      endDrag(event);
      return;
    }
    event.preventDefault();
    scrollRef.current.scrollLeft = dragRef.current.scrollLeft - (event.clientX - dragRef.current.startX);
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
  };

  useEffect(() => {
    handleScroll();
    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
    }
    window.addEventListener("resize", handleScroll);
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const scrollByCard = (direction: 1 | -1) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    
    let scrollAmount = 0;
    if (container.children.length > 1) {
      const first = container.children[0] as HTMLElement;
      const second = container.children[1] as HTMLElement;
      scrollAmount = second.offsetLeft - first.offsetLeft;
    } else {
      const cardElement = container.firstElementChild as HTMLElement;
      scrollAmount = cardElement ? cardElement.offsetWidth + 24 : 364;
    }

    container.scrollBy({ left: scrollAmount * direction, behavior: "smooth" });
  };

  return (
    <section className="py-16 md:py-24 bg-brand-light-bg" id="fleet">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="fleet-heading mb-12 md:mb-16">
          <p className="text-brand-accent text-sm font-medium mb-4">{t.sectionTag}</p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-brand-text-primary mb-4">{t.heading}</h2>
          <p className="text-sm md:text-base text-brand-text-secondary max-w-2xl">{t.subheading}</p>
        </div>

        <div className="relative group/fleet">
          <button
            onClick={() => scrollByCard(-1)}
            disabled={!canScrollLeft}
            className="hidden md:flex absolute -left-4 lg:-left-8 top-1/2 -translate-y-1/2 bg-white shadow-xl p-4 rounded-full text-[#0F292E] hover:scale-110 hover:bg-slate-50 transition-all z-10 disabled:opacity-0 disabled:pointer-events-none disabled:scale-100"
            aria-label="Ver vehículos anteriores"
          >
            <FaChevronLeft size={20} />
          </button>
          
          <button
            onClick={() => scrollByCard(1)}
            disabled={!canScrollRight}
            className="hidden md:flex absolute -right-4 lg:-right-8 top-1/2 -translate-y-1/2 bg-white shadow-xl p-4 rounded-full text-[#0F292E] hover:scale-110 hover:bg-slate-50 transition-all z-10 disabled:opacity-0 disabled:pointer-events-none disabled:scale-100"
            aria-label="Ver siguientes vehículos"
          >
            <FaChevronRight size={20} />
          </button>

          <div
            ref={scrollRef}
            onPointerDown={startDrag}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            onPointerCancel={endDrag}
            style={isDragging ? { scrollSnapType: "none", scrollBehavior: "auto", userSelect: "none" } : undefined}
            className={`flex overflow-x-auto snap-x snap-mandatory pb-8 -mx-6 px-6 md:-mx-4 md:px-4 gap-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth ${isDragging ? "md:cursor-grabbing" : "md:cursor-grab"}`}
          >
            {t.cars.map((car, index) => (
              <div key={index} className="w-[85vw] sm:w-[320px] lg:w-[340px] shrink-0 snap-center">
                <CarGallery
                  images={car.images}
                  name={car.name}
                  model={car.model}
                  category={vehicles[(["bus", "van-large", "van-medium", "sedan", "sedan"] as VehicleId[])[index]].name[locale]}
                  capacity={car.capacity}
                  delay={index * 0.1}
                  locale={locale}
                  onOpenImage={(imageIndex, opener) => setLightbox({ vehicleIndex: index, imageIndex, opener })}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      {lightbox && (
        <VehicleLightbox
          name={t.cars[lightbox.vehicleIndex].name}
          images={t.cars[lightbox.vehicleIndex].images}
          imageIndex={lightbox.imageIndex}
          locale={locale}
          opener={lightbox.opener}
          onClose={() => setLightbox(null)}
          onNavigate={navigateLightbox}
        />
      )}
    </section>
  );
}
