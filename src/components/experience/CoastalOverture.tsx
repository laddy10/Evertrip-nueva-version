"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Play, X } from "lucide-react";
import type { Locale } from "@/i18n/config";
import BookingDock from "./BookingDock";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
const getReducedMotion = () => window.matchMedia(reducedMotionQuery).matches;
const getServerReducedMotion = () => false;
function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

export default function CoastalOverture({ locale }: { locale: Locale }) {
  const es = locale === "es";
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const videoDialog = useRef<HTMLDialogElement>(null);
  const [watchFilm, setWatchFilm] = useState(false);
  const [ready, setReady] = useState(false);
  const [chapter, setChapter] = useState(0);
  const currentChapter = useRef(0);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getServerReducedMotion,
  );
  const playbackProgress = useMotionValue(0);
  const titleY = useTransform(playbackProgress, [0, 0.35], ["0%", "-45%"]);
  // The film's clock drives the existing composition without a scroll timeline.
  const titleOpacity = useTransform(() =>
    Math.max(0, Math.min(1, (0.35 - playbackProgress.get()) / 0.13)),
  );
  const travelOpacity = useTransform(() =>
    Math.max(0, Math.min(1, (playbackProgress.get() - 0.3) / 0.15)),
  );
  const sceneScale = useTransform(playbackProgress, [0, 1], [1.02, 1.13]);
  useMotionValueEvent(playbackProgress, "change", (value) => {
    const next = value <= 0.3 ? 0 : value < 0.75 ? 1 : 2;
    // Only chapter boundaries render React; frame updates stay in Motion values.
    if (currentChapter.current !== next) {
      currentChapter.current = next;
      setChapter(next);
    }
  });

  useEffect(() => {
    const element = video.current;
    const stage = section.current?.querySelector(".overture-stage");
    if (!element || !stage) return;
    if (reducedMotion) {
      element.pause();
      playbackProgress.set(0);
      return;
    }

    let visible = false;
    let disposed = false;
    let playPending = false;
    let frame: number | undefined;
    const motionPreference = window.matchMedia(reducedMotionQuery);
    const hasVideoFrames = typeof element.requestVideoFrameCallback === "function";
    const segmentEnd = () => Number.isFinite(element.duration)
      ? Math.min(8, Math.max(0, element.duration - 0.05))
      : 8;
    const cancelFrame = () => {
      if (frame === undefined) return;
      if (hasVideoFrames) element.cancelVideoFrameCallback(frame);
      else cancelAnimationFrame(frame);
      frame = undefined;
    };
    const watchSegment = () => {
      cancelFrame();
      if (element.paused || disposed) return;
      const end = segmentEnd();
      playbackProgress.set(Math.min(1, element.currentTime / end));
      if (element.currentTime >= end) {
        element.pause();
        // One boundary correction holds the exact final frame on every device.
        if (element.currentTime > end) element.currentTime = end;
        return;
      }
      frame = hasVideoFrames
        ? element.requestVideoFrameCallback(watchSegment)
        : requestAnimationFrame(watchSegment);
    };
    const play = () => {
      if (
        disposed || !visible || document.hidden || playPending ||
        !element.paused || element.currentTime >= segmentEnd() ||
        motionPreference.matches
      ) return;
      playPending = true;
      element.play().then(() => {
        playPending = false;
        if (disposed || !visible || document.hidden || motionPreference.matches) element.pause();
      }).catch(() => {
        // Keep the poster/first frame if autoplay is restricted; input may retry.
        playPending = false;
      });
    };
    const onVisibility = () => {
      if (document.hidden || motionPreference.matches) element.pause();
      else play();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) play();
      else element.pause();
    });
    observer.observe(stage);
    stage.addEventListener("pointerdown", play, { passive: true });
    stage.addEventListener("touchend", play, { passive: true });
    element.addEventListener("canplay", play);
    element.addEventListener("play", watchSegment);
    element.addEventListener("pause", cancelFrame);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      disposed = true;
      observer.disconnect();
      stage.removeEventListener("pointerdown", play);
      stage.removeEventListener("touchend", play);
      element.removeEventListener("canplay", play);
      element.removeEventListener("play", watchSegment);
      element.removeEventListener("pause", cancelFrame);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelFrame();
      element.pause();
    };
  }, [playbackProgress, reducedMotion]);

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
            poster="/assets/journey/evertrip-real-drive-poster.webp"
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
            className={ready ? "is-ready" : ""}
            onLoadedMetadata={() => {
              if (!video.current) return;
              if (reducedMotion) {
                video.current.currentTime = Math.min(4, Math.max(0, video.current.duration - 0.05));
                return;
              }
            }}
            onLoadedData={() => setReady(true)}
            onSeeked={() => setReady(true)}
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
          <h1 id="coast-title">{es ? "Caribe" : "Caribbean"}</h1>
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
              <motion.i style={{ scaleX: playbackProgress }} />
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
          <path d="M0 100 Q400 30 750 94 T1440 55 V130 H0Z" fill="#ffffff" />
          <path
            d="M-10 106 Q400 34 750 98 T1450 59"
            fill="none"
            stroke="#109B96"
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
