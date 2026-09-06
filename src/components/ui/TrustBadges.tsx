import { FaShieldAlt, FaUserCheck, FaMoneyBillWave, FaPlaneDeparture } from "react-icons/fa";
import type { Locale } from "@/i18n/config";

interface TrustBadgesProps {
  locale: Locale;
  className?: string;
}

export default function TrustBadges({ locale, className = "" }: TrustBadgesProps) {
  const badges = [
    {
      icon: <FaShieldAlt className="text-brand-accent text-2xl mb-3" />,
      title: locale === "es" ? "Viaje Seguro" : "Safe Journey",
      desc: locale === "es" ? "Vehículos modernos y pólizas al día." : "Modern vehicles and up-to-date insurance.",
    },
    {
      icon: <FaUserCheck className="text-brand-accent text-2xl mb-3" />,
      title: locale === "es" ? "Conductores Expertos" : "Expert Drivers",
      desc: locale === "es" ? "Locales con amplia experiencia en la ruta." : "Locals with extensive route experience.",
    },
    {
      icon: <FaMoneyBillWave className="text-brand-accent text-2xl mb-3" />,
      title: locale === "es" ? "Tarifas Transparentes" : "Transparent Rates",
      desc: locale === "es" ? "Sin sorpresas, cotiza con confianza." : "No surprises, quote with confidence.",
    },
    {
      icon: <FaPlaneDeparture className="text-brand-accent text-2xl mb-3" />,
      title: locale === "es" ? "Rastreo de Vuelo" : "Flight Tracking",
      desc: locale === "es" ? "Te esperamos si tu vuelo se retrasa." : "We wait for you if your flight is delayed.",
    },
  ];

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 ${className}`}>
      {badges.map((badge, i) => (
        <div key={i} className="flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-brand-accent/10 flex items-center justify-center mb-2">
            {badge.icon}
          </div>
          <h4 className="font-bold text-brand-navy text-sm mb-1">{badge.title}</h4>
          <p className="text-xs text-brand-carbon/60 font-medium leading-relaxed">{badge.desc}</p>
        </div>
      ))}
    </div>
  );
}
