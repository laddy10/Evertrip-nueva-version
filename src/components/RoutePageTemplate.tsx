import Image from "next/image";
import { FaWhatsapp, FaClock, FaUsers, FaCheckCircle, FaArrowLeft, FaCarSide, FaRoute, FaShieldAlt } from "react-icons/fa";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { RouteDefinition, PriceCard } from "@/data/routes";
import { getWhatsAppLink } from "@/data/routes";
import { dictionaries } from "@/i18n/dictionaries";
import QuoteCalculator from "./calculator/QuoteCalculator";
import TrustBadges from "./ui/TrustBadges";

interface RoutePageProps {
  locale: Locale;
  route: RouteDefinition;
  priceCards: PriceCard[];
  relatedRoutes: { label: string; slug: string }[];
}

export default function RoutePageTemplate({ locale, route, priceCards, relatedRoutes }: RoutePageProps) {
  const dict = dictionaries[locale].routePage;
  const waLink = getWhatsAppLink(route.waMessage[locale]);

  return (
    <main className="bg-white">
      {/* Clean Hero Section */}
      <section className="bg-[#F8FAFC] pt-32 pb-24 border-b border-gray-100 relative overflow-hidden">
        {/* Subtle decorative background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-green/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <nav className="flex items-center gap-2 text-sm text-brand-carbon/60 mb-10 font-medium">
            <Link href={`/${locale}`} className="hover:text-brand-navy transition-colors">{dict.home}</Link>
            <span>/</span>
            <span className="text-brand-accent">{route.title[locale]}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-start">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 xl:col-span-7">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-brand-navy font-bold text-xs tracking-[0.15em] uppercase mb-6 shadow-sm border border-gray-100">
                <FaRoute className="text-brand-accent text-sm" /> {locale === "es" ? "Traslado Privado" : "Private Transfer"}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-brand-navy mb-6 leading-tight font-sans">
                {route.h1[locale]}
              </h1>
              
              <p className="text-brand-carbon/80 text-lg leading-relaxed mb-10 text-left md:text-justify">
                {route.description[locale]}
              </p>

              <div className="flex flex-wrap gap-4 text-sm font-medium mb-12 max-sm:gap-3">
                <div className="flex items-center gap-3 bg-white border border-gray-100 px-5 py-3 rounded-2xl text-brand-navy shadow-sm max-sm:gap-2 max-sm:px-3 max-sm:py-2">
                  <div className="w-8 h-8 rounded-full bg-brand-navy/5 flex items-center justify-center shrink-0">
                    <FaClock className="text-brand-accent" />
                  </div>
                  {route.duration[locale]}
                </div>
                <div className="flex items-center gap-3 bg-white border border-gray-100 px-5 py-3 rounded-2xl text-brand-navy shadow-sm max-sm:gap-2 max-sm:px-3 max-sm:py-2">
                  <div className="w-8 h-8 rounded-full bg-brand-navy/5 flex items-center justify-center shrink-0">
                    <FaUsers className="text-brand-accent" />
                  </div>
                  {route.idealFor[locale]}
                </div>
                <div className="flex items-center gap-3 bg-white border border-gray-100 px-5 py-3 rounded-2xl text-brand-navy shadow-sm max-sm:gap-2 max-sm:px-3 max-sm:py-2">
                  <div className="w-8 h-8 rounded-full bg-brand-navy/5 flex items-center justify-center shrink-0">
                    <FaShieldAlt className="text-brand-accent" />
                  </div>
                  {locale === "es" ? "Seguro Incluido" : "Insurance Included"}
                </div>
              </div>

              {/* Framed Image - Split layout if 2 images exist */}
              {(route.image || route.image2) && (
                <div className="relative w-full aspect-[16/10] md:aspect-[16/9] rounded-[2rem] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-white flex">
                  {route.image && (
                    <div className="relative flex-1 h-full">
                      <Image
                        src={route.image}
                        alt={route.h1[locale]}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  )}
                  {route.image2 && (
                    <div className="relative flex-1 h-full border-l-4 border-white">
                      <Image
                        src={route.image2}
                        alt={route.h1[locale]}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/30 to-transparent pointer-events-none"></div>
                </div>
              )}
            </div>

            {/* Right Booking Card Column */}
            <div className="lg:col-span-5 xl:col-span-5 relative">
              <div className="sticky top-28">
                <QuoteCalculator 
                  routeSlug={route.slug} 
                  locale={locale} 
                  routeTitle={route.title[locale]} 
                  waBaseMessage={route.waMessage[locale]} 
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <TrustBadges locale={locale} />
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-brand-navy font-bold text-3xl mb-10 font-sans text-center">{dict.whatsIncluded}</h2>
            <div className="flex flex-wrap justify-center gap-6">
              {route.highlights[locale].map((item, i) => (
                <div key={i} className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex items-center gap-4 p-5 bg-[#F8FAFC] rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-brand-accent/30 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0">
                    <FaCheckCircle className="text-brand-green" />
                  </div>
                  <span className="text-brand-navy font-medium text-sm text-pretty leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Price Cards */}
      {priceCards.length > 0 && (
        <section className="py-20 bg-[#F8FAFC] border-t border-gray-100">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-brand-navy font-bold text-3xl mb-10 font-sans text-center">{dict.priceByVehicle}</h2>
              <div className="flex flex-wrap justify-center gap-6">
                {priceCards.map((card, i) => (
                  <div key={i} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-sm bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(27,42,71,0.08)] transition-all flex flex-col items-center text-center group">
                    <div className="w-14 h-14 rounded-2xl bg-brand-navy/5 flex items-center justify-center text-brand-navy mb-5">
                      <FaCarSide size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-brand-navy mb-2 font-sans">{card.label[locale]}</h3>
                    <div className="my-3">
                      <span className="text-3xl font-bold text-brand-accent">{card.price}</span>
                    </div>
                    {card.note && <p className="text-sm text-brand-carbon/60">{card.note[locale]}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {route.faqs && route.faqs.length > 0 && (
        <section className="py-20 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-brand-navy font-bold text-3xl mb-10 font-sans text-center">{dict.faqTitle}</h2>
              <div className="space-y-4">
                {route.faqs.map((faq, i) => (
                  <div key={i} className="bg-[#F8FAFC] rounded-2xl p-6 md:p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <h3 className="font-bold text-lg text-brand-navy mb-3 font-sans flex items-start gap-3">
                      <span className="text-brand-accent">Q.</span>
                      {faq.q[locale]}
                    </h3>
                    <p className="text-brand-carbon/80 leading-relaxed pl-7 text-sm md:text-base text-justify">{faq.a[locale]}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA + Related Routes */}
      <section className="py-20 bg-[#030807] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&q=80')] opacity-[0.03] bg-cover bg-center"></div>
        <div className="container mx-auto px-4 max-w-5xl text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 font-sans">{dict.readyToBook}</h2>
          <p className="text-white/80 text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto">{dict.readyToBookCopy}</p>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-2xl hover:bg-[#1EBE5D] transition-all shadow-[0_10px_20px_rgba(37,211,102,0.2)] font-bold text-lg hover:-translate-y-1 mb-16"
          >
            <FaWhatsapp size={24} />
            {dict.bookThisTransfer}
          </a>

          {relatedRoutes.length > 0 && (
            <div className="border-t border-white/10 pt-16">
              <h3 className="font-sans font-bold text-xl mb-8 text-white/90">{dict.relatedRoutes}</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {relatedRoutes.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/${locale}/${r.slug}`}
                    className="px-5 py-2.5 bg-white/5 border border-white/10 text-white/90 rounded-2xl hover:bg-white hover:text-brand-navy transition-all text-sm font-medium"
                  >
                    {r.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-16">
            <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-white/50 hover:text-brand-accent transition-colors text-sm font-medium">
              <FaArrowLeft size={14} />
              {dict.backToAllRoutes}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
