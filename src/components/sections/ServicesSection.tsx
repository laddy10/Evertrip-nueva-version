import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getWhatsAppLink } from "@/data/routes";
import type { Locale } from "@/i18n/config";

const content = {
  es: {
    title: "Hay muchas formas de vivir el Caribe. Una de llegar tranquilo.", intro: "Para tus vacaciones, tu próximo encuentro de trabajo o ese lugar que siempre has querido conocer.", cta: "Explorar servicio", corporate: "Cotizar transporte", services: [
      { title: "Tu llegada, resuelta.", desc: "Traslados privados de aeropuerto. Seguimos tu vuelo y te recibimos en llegadas para llevarte a tu alojamiento.", image: "airport-transfer-01.webp", slug: "santa-marta-airport-transfer" },
      { title: "La costa es tuya.", desc: "De Cartagena a Palomino, pasando por Santa Marta. Elige tu ruta o planea un recorrido a tu medida.", image: "cartagena-01.webp", slug: "custom-private-routes" },
      { title: "Viaja por trabajo.", desc: "Transporte privado para ejecutivos y equipos. Coordinamos tu ruta, tus horarios y el vehículo para tu grupo.", image: "private-route-01.webp", slug: "" },
    ], message: "Hola EverTrip, quiero cotizar transporte corporativo para mi equipo.",
  },
  en: {
    title: "So many ways to enjoy the Caribbean. One easy way to arrive.", intro: "For your holiday, your next business meeting, or that place you’ve always wanted to discover.", cta: "Explore service", corporate: "Request a quote", services: [
      { title: "Your arrival, sorted.", desc: "Private airport transfers. We track your flight and meet you at arrivals to take you to your accommodation.", image: "airport-transfer-01.webp", slug: "santa-marta-airport-transfer" },
      { title: "Make the coast yours.", desc: "From Cartagena to Palomino, through Santa Marta. Choose your route or plan a journey of your own.", image: "cartagena-01.webp", slug: "custom-private-routes" },
      { title: "Travel for business.", desc: "Private transport for executives and teams. We coordinate your route, schedule, and a vehicle for your group.", image: "private-route-01.webp", slug: "" },
    ], message: "Hi EverTrip, I would like a corporate transport quote for my team.",
  },
};

export default function ServicesSection({ locale }: { locale: Locale }) {
  const t = content[locale];
  return <section className="services-editorial" id="services" aria-labelledby="services-title">
    <div className="services-heading"><h2 id="services-title">{t.title}</h2><p>{t.intro}</p></div>
    <div className="services-grid">{t.services.map(service => {
      const body = <><Image src={`/assets/pilot/routes/${service.image}`} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" className="object-cover" /><div><h3>{service.title}</h3><p>{service.desc}</p><span className="service-link">{service.slug ? t.cta : t.corporate}<ArrowUpRight size={20} aria-hidden="true" /></span></div></>;
      return service.slug ? <Link className="service-item" key={service.title} href={`/${locale}/${service.slug}`}>{body}</Link> : <a className="service-item" key={service.title} href={getWhatsAppLink(t.message)} target="_blank" rel="noopener noreferrer">{body}</a>;
    })}</div>
  </section>;
}
