"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { type Locale } from "@/i18n/config";
import { dictionaries } from "@/i18n/dictionaries";
import { getWhatsAppLink } from "@/data/routes";
import { motion } from "framer-motion";

export default function Navbar({ locale }: { locale: Locale }) {
  const dict = dictionaries[locale];
  const segments = ["", locale === "es" ? "en" : "es"];
  const toggleHref = "/" + segments.join("/");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 z-50 w-full pt-4 px-4 transition-all duration-500">
      <motion.div 
        className={`max-w-7xl mx-auto rounded-[32px] px-6 py-3 flex items-center justify-between transition-all duration-500 border border-slate-200/50 ${scrolled ? 'glass-premium shadow-lg py-2' : 'bg-transparent py-4'}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link href={`/${locale}`} className="hover:opacity-80 transition-opacity flex items-center">
          <Image
            src="/assets/logo2-normal.png"
            alt="Evertrip Logo"
            width={48}
            height={48}
            className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-full"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-brand-text-primary/70">
          <Link href={`/${locale}#routes`} className="hover:text-brand-accent transition-colors">
            {dict.nav.routes}
          </Link>
          <Link href={`/${locale}#how-it-works`} className="hover:text-brand-accent transition-colors">
            {dict.nav.howItWorks}
          </Link>
          <Link href={`/${locale}#faq`} className="hover:text-brand-accent transition-colors">
            {dict.nav.faq}
          </Link>
        </nav>

        <div className="flex items-center gap-6">
          <Link
            href={toggleHref}
            className="text-xs font-bold tracking-widest text-brand-text-secondary hover:text-brand-text-primary transition-colors"
          >
            {locale === "es" ? (
              <>
                <span className="text-brand-text-primary">ES</span> <span className="opacity-30 mx-1">|</span> EN
              </>
            ) : (
              <>
                ES <span className="opacity-30 mx-1">|</span> <span className="text-brand-text-primary">EN</span>
              </>
            )}
          </Link>

          <a
            href={getWhatsAppLink(locale === "es" ? "Hola EverTrip, quiero cotizar un viaje." : "Hi EverTrip, I would like to get a quote.")}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center justify-center bg-brand-accent text-white px-8 py-3 rounded-[24px] text-xs font-bold tracking-wider uppercase transition-all duration-300 hover:bg-brand-accent-light hover:scale-105 shadow-md hover:shadow-brand-accent/30"
          >
            {dict.nav.book}
          </a>
        </div>
      </motion.div>
    </header>
  );
}
