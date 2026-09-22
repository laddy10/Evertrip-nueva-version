import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getWhatsAppLink } from "@/data/routes";
import type { Locale } from "@/i18n/config";

export default function TravelPromise({ locale }: { locale: Locale }) {
  const es = locale === "es";
  const steps = es
    ? [
        {
          title: "Aterriza.\nYa te esperamos.",
          text: "Seguimos tu vuelo y te recibimos en llegadas con un cartel con tu nombre. Del aeropuerto, directo a tu alojamiento.",
          link: "Tu traslado de aeropuerto",
          slug: "santa-marta-airport-transfer",
        },
        {
          title: "El camino,\na tu manera.",
          text: "Tu grupo, tu conductor y una parada de cortesía de 15–25 minutos para comer, tomar fotos o respirar el Caribe. Coordinamos los detalles contigo.",
          link: "Diseña tu ruta privada",
          slug: "custom-private-routes",
        },
        {
          title: "Llega a lo\nque importa.",
          text: "Vacaciones, encuentros o viajes de trabajo. Coordinamos el transporte de tu equipo con vehículos climatizados y espacio para el equipaje.",
          link: "Transporte corporativo",
          slug: "",
        },
      ]
    : [
        {
          title: "Land.\nWe’re here.",
          text: "We track your flight and welcome you at arrivals with your name on a sign. From the airport, straight to your accommodation.",
          link: "Your airport transfer",
          slug: "santa-marta-airport-transfer",
        },
        {
          title: "The road,\nyour way.",
          text: "Your group, your driver, and a complimentary 15–25 minute stop to eat, take photos, or breathe in the Caribbean. We coordinate the details with you.",
          link: "Create your private route",
          slug: "custom-private-routes",
        },
        {
          title: "Arrive where\nit matters.",
          text: "Holidays, gatherings, or business. We coordinate your team’s transport with air-conditioned vehicles and room for luggage.",
          link: "Corporate transportation",
          slug: "",
        },
      ];
  return (
    <section
      className="travel-promise"
      id="why-choose-us"
      aria-labelledby="promise-title"
    >
      <div className="promise-landscape">
        <picture className="promise-landscape-media">
          <source
            media="(min-width: 901px)"
            srcSet="/assets/pilot/routes/tayrona-desktop-new.webp"
          />
          <img
            src="/assets/pilot/routes/tayrona-01.webp"
            alt={
              es
                ? "La costa del Parque Tayrona"
                : "The coast of Tayrona National Park"
            }
          />
        </picture>
        <div />
        <h2 id="promise-title">
          {es
            ? "Menos pendientes.\nMás Caribe."
            : "Less to think about.\nMore Caribbean."}
        </h2>
        <span>
          {es
            ? "Así se siente viajar con Evertrip"
            : "This is how an Evertrip journey feels"}
        </span>
      </div>
      <div className="promise-narrative" id="how-it-works">
        <svg
          className="promise-thread"
          viewBox="0 0 900 900"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M30 0 C700 120 100 200 430 360 S890 700 500 900"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
          />
        </svg>
        {steps.map((step, index) => (
          <article key={step.title}>
            <span className="promise-stop">0{index + 1}</span>
            <h3>{step.title}</h3>
            <div>
              <p>{step.text}</p>
              {step.slug ? (
                <Link className="text-link" href={`/${locale}/${step.slug}`}>
                  {step.link}
                  <ArrowUpRight size={17} />
                </Link>
              ) : (
                <a
                  className="text-link"
                  href={getWhatsAppLink(
                    es
                      ? "Hola Evertrip, necesito transporte corporativo para mi equipo."
                      : "Hi Evertrip, I need corporate transportation for my team.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {step.link}
                  <ArrowUpRight size={17} />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
