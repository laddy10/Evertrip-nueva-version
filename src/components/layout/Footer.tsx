import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { dictionaries } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { getWhatsAppLink } from "@/data/routes";
import Image from "next/image";

export default function Footer({ locale }: { locale: Locale }) {
  const dict = dictionaries[locale];
  const quoteMessage =
    locale === "es" ? "Hola, quiero cotizar un traslado." : "Hi, I'd like a quote for a transfer.";

  return (
    <footer className="bg-[#030807] text-white py-20 relative overflow-hidden border-t border-white/5">
      {/* Subtle radial gradient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-accent/5 blur-[120px] rounded-[100%] pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          <div className="md:col-span-5 lg:col-span-4 flex flex-col items-start">
            <Link href={`/${locale}`} className="hover:opacity-80 transition-opacity mb-6 inline-block">
              <Image
                src="/assets/logo2-normal-ui.png"
                alt="Evertrip Logo"
                width={56}
                height={56}
                className="w-12 h-12 object-cover rounded-full"
              />
            </Link>
            <address className="not-italic text-slate-300 space-y-3 text-sm font-light leading-relaxed">
              <p className="font-medium text-white">VIAJES Y TOURS EVERTRIP</p>
              <p>Barranquilla, Santa Marta, Cartagena, Palomino, Valledupar</p>
              <p>{dict.footer.tagline}</p>
              <p className="mt-6">
                <a href="https://wa.me/573147659756" className="inline-flex items-center gap-2 hover:text-brand-accent-light transition-colors font-medium text-white">
                  <FaWhatsapp className="text-brand-accent" size={18} />
                  +57 314 765 9756
                </a>
              </p>
            </address>
          </div>

          <div className="md:col-span-3 lg:col-span-4 lg:pl-12">
            <h4 className="font-normal text-lg mb-6 text-white">{dict.footer.quickLinks}</h4>
            <ul className="space-y-4 text-sm text-slate-300 font-light">
              <li><Link href={`/${locale}#routes`} className="hover:text-brand-accent-light transition-colors">{dict.footer.popularRoutes}</Link></li>
              <li><Link href={`/${locale}#how-it-works`} className="hover:text-brand-accent-light transition-colors">{dict.footer.howItWorks}</Link></li>
              <li><Link href={`/${locale}#faq`} className="hover:text-brand-accent-light transition-colors">{dict.footer.faq}</Link></li>
              <li><Link href={`/${locale}/privacy-policy`} className="hover:text-white transition-colors">{dict.footer.privacy}</Link></li>
              <li><Link href={`/${locale}/terms`} className="hover:text-white transition-colors">{dict.footer.terms}</Link></li>
              <li><Link href={`/${locale}/cancellation-policy`} className="hover:text-white transition-colors">{dict.footer.cancellation}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4 lg:col-span-4">
            <h4 className="font-normal text-lg mb-6 text-white">{dict.footer.readyToBook}</h4>
            <p className="text-sm text-slate-300 mb-8 leading-relaxed font-light">{dict.footer.readyToBookCopy}</p>
            <a
              href={getWhatsAppLink(quoteMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full sm:w-auto gap-3 bg-brand-accent text-white px-8 py-4 rounded-[24px] font-medium text-sm tracking-wide transition-all duration-300 hover:bg-brand-accent-light hover:text-brand-primary-bg shadow-[0_10px_30px_rgba(31,138,91,0.2)] hover:shadow-[0_15px_40px_rgba(180,237,80,0.3)] hover:-translate-y-1"
            >
              <FaWhatsapp size={20} />
              <span>{dict.footer.getQuote}</span>
            </a>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-light">
          <p>&copy; {new Date().getFullYear()} VIAJES Y TOURS EVERTRIP. {dict.footer.rights}</p>
          <div className="flex gap-4">
            <span className="opacity-50">Diseño Premium</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
