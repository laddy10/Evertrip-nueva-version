"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { type Locale } from "@/i18n/config";
import { dictionaries } from "@/i18n/dictionaries";
import { getWhatsAppLink } from "@/data/routes";
import { motion } from "framer-motion";

export default function Navbar({ locale }: { locale: Locale }) {
  const dict = dictionaries[locale];
  const navigationItems = [
    { id: "why-choose-us", label: locale === "es" ? "Por qué elegirnos" : "Why choose us" },
    { id: "fleet", label: locale === "es" ? "Nuestros carros" : "Our vehicles" },
    { id: "routes", label: locale === "es" ? "Nuestras rutas" : "Our routes" },
    { id: "faq", label: dict.nav.faq },
  ];
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const handleLanguageChange = (event: React.MouseEvent<HTMLAnchorElement>, targetLocale: Locale) => {
    const url = new URL(window.location.href);
    url.pathname = url.pathname.replace(/^\/(es|en)(?=\/|$)/, `/${targetLocale}`);
    const href = `${url.pathname}${url.search}`;
    event.currentTarget.href = href;

    if (event.type === "click" && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      router.push(href);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOutside = (event: Event) => {
      if (!navbarRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 48rem)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMenuOpen(false);
    };

    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("focusin", closeOutside);
    document.addEventListener("keydown", handleKeyDown);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("focusin", closeOutside);
      document.removeEventListener("keydown", handleKeyDown);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [menuOpen]);

  return (
    <header className="fixed top-0 z-50 w-full pt-4 px-4 transition-all duration-500">
      <motion.div 
        ref={navbarRef}
        className={`relative max-w-7xl mx-auto rounded-[32px] px-2 md:px-6 py-3 flex items-center justify-between transition-all duration-500 border border-slate-200/50 ${scrolled ? 'glass-premium shadow-lg py-2' : 'bg-transparent py-4'}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link href={`/${locale}`} className="hover:opacity-80 transition-opacity flex items-center max-md:min-h-11 max-md:min-w-11 max-md:shrink-0">
          <Image
            src="/assets/logo2-normal-ui.png"
            alt="Evertrip Logo"
            width={48}
            height={48}
            className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-full"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-brand-text-primary/70">
          {navigationItems.map((item) => (
            <Link key={item.id} href={`/${locale}#${item.id}`} className="hover:text-brand-accent transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-6">
          <span
            className="text-xs font-bold tracking-widest text-brand-text-secondary hover:text-brand-text-primary transition-colors max-md:inline-flex max-md:items-center max-md:min-h-11 max-md:whitespace-nowrap"
          >
            <Link
              href={pathname.replace(/^\/(es|en)(?=\/|$)/, "/es")}
              onClick={(event) => handleLanguageChange(event, "es")}
              onAuxClick={(event) => handleLanguageChange(event, "es")}
              onContextMenu={(event) => handleLanguageChange(event, "es")}
              className={locale === "es" ? "text-brand-text-primary" : undefined}
            >
              ES
            </Link>{" "}
            <span className="opacity-30 mx-1">|</span>{" "}
            <Link
              href={pathname.replace(/^\/(es|en)(?=\/|$)/, "/en")}
              onClick={(event) => handleLanguageChange(event, "en")}
              onAuxClick={(event) => handleLanguageChange(event, "en")}
              onContextMenu={(event) => handleLanguageChange(event, "en")}
              className={locale === "en" ? "text-brand-text-primary" : undefined}
            >
              EN
            </Link>
          </span>

          <a
            href={getWhatsAppLink(locale === "es" ? "Hola EverTrip, quiero cotizar un viaje." : "Hi EverTrip, I would like to get a quote.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center bg-brand-accent text-white px-3 md:px-8 py-3 rounded-[24px] text-xs font-bold tracking-wider uppercase transition-all duration-300 hover:bg-brand-accent-light hover:scale-105 shadow-md hover:shadow-brand-accent/30 max-md:min-h-11 max-md:shrink-0 max-md:whitespace-nowrap"
          >
            {dict.nav.book}
          </a>
          <button
            ref={menuButtonRef}
            type="button"
            aria-label={locale === "es" ? (menuOpen ? "Cerrar menú" : "Abrir menú") : (menuOpen ? "Close menu" : "Open menu")}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            className="md:hidden w-11 h-11 shrink-0 inline-flex items-center justify-center rounded-xl text-brand-text-primary hover:text-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d={menuOpen ? "M6 6l12 12M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        <nav
          id="mobile-navigation"
          aria-label={locale === "es" ? "Navegación móvil" : "Mobile navigation"}
          hidden={!menuOpen}
          className="md:hidden absolute top-full left-0 right-0 mt-2 rounded-[24px] border border-slate-200/50 bg-brand-primary-bg p-2 shadow-lg max-h-[calc(100dvh-7rem)] overflow-y-auto"
        >
          {navigationItems.map((item) => (
            <Link key={item.id} href={`/${locale}#${item.id}`} onClick={() => setMenuOpen(false)} className="flex min-h-11 items-center rounded-2xl px-4 py-3 text-sm font-medium text-brand-text-primary hover:text-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent">
              {item.label}
            </Link>
          ))}
        </nav>
      </motion.div>
    </header>
  );
}
