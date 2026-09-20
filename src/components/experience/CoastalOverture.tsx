"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Play, X } from "lucide-react";
import type { Locale } from "@/i18n/config";
import BookingDock from "./BookingDock";

export default function CoastalOverture({ locale }: { locale: Locale }) {
  const es = locale === "es";
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const targetTime = useRef(0);
  const videoDialog = useRef<HTMLDialogElement>(null);
  const [watchFilm, setWatchFilm] = useState(false);
  const [ready, setReady] = useState(false);
  const [chapter, setChapter] = useState(0);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });
  const titleY = useTransform(scrollYProgress, [0, 0.35], ["0%", "-45%"]);
  // Function transforms keep the chapter fades tied to this scene's progress.
  // Native scroll-timeline interpolation can remap multi-stop opacity ranges.
  const titleOpacity = useTransform(() =>
    Math.max(0, Math.min(1, (0.35 - scrollYProgress.get()) / 0.13)),
  );
  const travelOpacity = useTransform(() => {
    const progress = scrollYProgress.get();
    return Math.max(
      0,
      Math.min(1, (progress - 0.3) / 0.15, (1 - progress) / 0.15),
    );
  });
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.13]);
  const syncFrame = () => {
    const element = video.current;
    if (
      !element ||
      !Number.isFinite(element.duration) ||
      element.seeking ||
      reducedMotion
    )
      return;
    const start = 0;
    const end = Math.min(8, Math.max(0, element.duration - 0.05));
    const next = start + targetTime.current * (end - start);
    if (Math.abs(element.currentTime - next) > 0.035)
      element.currentTime = Math.max(start, Math.min(end, next));
  };
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (reducedMotion) return;
    targetTime.current = value;
    syncFrame();
    const next = value < 0.25 ? 0 : value < 0.75 ? 1 : 2;
    setChapter((current) => (current === next ? current : next));
  });

  return (
    <section
      ref={section}
      id="journey"
      className="coastal-overture"
      aria-labelledby="coast-title"
      data-chapter={chapter}
    >
      <div className="overture-stage">
        <motion.div className="overture-film" style={{ scale: sceneScale }}>
          <video
            ref={video}
            src="/assets/journey/evertrip-real-drive.mp4"
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
            className={ready ? "is-ready" : ""}
            onLoadedMetadata={() => {
              if (reducedMotion && video.current) {
                video.current.currentTime = Math.min(4, Math.max(0, video.current.duration - 0.05));
                return;
              }
              syncFrame();
            }}
            onLoadedData={() => {
              setReady(true);
              syncFrame();
            }}
            onSeeked={() => {
              setReady(true);
              syncFrame();
            }}
          />
        </motion.div>
        <div className="overture-toning" />
        <motion.div
          className="overture-title"
          style={{ y: titleY, opacity: titleOpacity }}
        >
          <p>
            {es
              ? "Tu viaje privado por el"
              : "Your private journey through the"}
          </p>
          <h1 id="coast-title">{es ? "Caribe." : "Caribbean."}</h1>
          <div className="overture-intro">
            <span>
              {es
                ? "De tu puerta\na otro mundo."
                : "From your doorstep\nto another world."}
            </span>
            <p>
              {es
                ? "Santa Marta, Cartagena y la costa colombiana. Tú eliges el destino. Nosotros cuidamos el camino."
                : "Santa Marta, Cartagena, and the Colombian coast. You choose the destination. We take care of the journey."}
            </p>
          </div>
        </motion.div>
        <motion.div
          className="overture-travel"
          style={{ opacity: travelOpacity }}
          aria-hidden={chapter === 0}
        >
          <p>
            {es
              ? "El camino también se disfruta."
              : "The road is part of the escape."}
          </p>
          <h2>
            {es
              ? "Baja el ritmo.\nSube la mirada."
              : "Slow down.\nLook around."}
          </h2>
          <Link
            href={`/${locale}/santa-marta-to-palomino`}
            tabIndex={chapter === 0 ? -1 : 0}
          >
            {es
              ? "Descubre Santa Marta → Palomino"
              : "Discover Santa Marta → Palomino"}
            <ArrowUpRight size={17} />
          </Link>
        </motion.div>
        <div className="overture-bottom">
          <button
            className="film-trigger"
            onClick={() => {
              setWatchFilm(true);
              videoDialog.current?.showModal();
            }}
          >
            <Play size={14} fill="currentColor" />
            {es ? "Conoce Evertrip" : "Meet Evertrip"}
          </button>
          <div
            className="overture-progress"
            aria-label={es ? "Progreso del recorrido" : "Journey progress"}
          >
            <span>{es ? "Recogida" : "Pickup"}</span>
            <div>
              <motion.i style={{ scaleX: scrollYProgress }} />
            </div>
            <span>{es ? "Destino" : "Arrival"}</span>
          </div>
          <a href="#routes" className="overture-scroll">
            {es ? "Sigue el camino" : "Follow the road"}
            <ArrowDown size={16} />
          </a>
        </div>
        <svg
          className="overture-shore"
          viewBox="0 0 1440 130"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 100 Q400 30 750 94 T1440 55 V130 H0Z" fill="#073b3a" />
          <path
            d="M-10 106 Q400 34 750 98 T1450 59"
            fill="none"
            stroke="#ebcb7a"
            strokeWidth="1"
            opacity=".6"
          />
        </svg>
      </div>
      <BookingDock locale={locale} />
      <dialog
        ref={videoDialog}
        className="brand-film-dialog"
        aria-label={es ? "Conoce Evertrip" : "Meet Evertrip"}
        onClose={() => setWatchFilm(false)}
      >
        <button
          autoFocus
          className="dialog-close"
          onClick={() => videoDialog.current?.close()}
          aria-label={es ? "Cerrar video" : "Close video"}
        >
          <X />
        </button>
        {watchFilm && (
          <iframe
            src="https://www.youtube.com/embed/QbrpOFVaFbA?autoplay=1&rel=0"
            title={es ? "Conoce Evertrip" : "Meet Evertrip"}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        )}
      </dialog>
    </section>
  );
}
