"use client";
import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { ArrowUpRight, Minus, Plus } from "lucide-react";
import { getQuoteForRoute, getWhatsAppLink } from "@/data/routes";
import type { Locale } from "@/i18n/config";

const subscribe = (listener: () => void) => {
  window.addEventListener("popstate", listener);
  return () => window.removeEventListener("popstate", listener);
};
const readPassengers = () => {
  const value = Number(new URLSearchParams(window.location.search).get("pax"));
  return Number.isInteger(value) && value >= 1 && value <= 30 ? value : 2;
};
interface QuoteCalculatorProps {
  routeSlug: string;
  locale: Locale;
  routeTitle: string;
  waBaseMessage: string;
}
export default function QuoteCalculator({
  routeSlug,
  locale,
  waBaseMessage,
}: QuoteCalculatorProps) {
  const es = locale === "es";
  const queryPassengers = useSyncExternalStore(
    subscribe,
    readPassengers,
    () => 2,
  );
  const [selection, setSelection] = useState<number | null>(null);
  const passengers = selection ?? queryPassengers;
  const quote = getQuoteForRoute(routeSlug, passengers);
  if (!quote) return null;
  const message = `${waBaseMessage}\n\nDetalles / Details:\n- Pasajeros / Passengers: ${passengers}\n- Vehículo sugerido / Suggested Vehicle: ${quote.vehicle.name[locale]}`;
  return (
    <div className="quote-notebook">
      <p className="small-note">
        {es ? "Tu traslado, a tu medida" : "Your transfer, your way"}
      </p>
      <h3>{es ? "Empieza por\ntu grupo." : "Start with\nyour people."}</h3>
      <div className="quote-passengers">
        <span>{es ? "Pasajeros" : "Passengers"}</span>
        <div>
          <button
            onClick={() => setSelection(Math.max(1, passengers - 1))}
            disabled={passengers === 1}
            aria-label={es ? "Menos pasajeros" : "Fewer passengers"}
          >
            <Minus size={18} />
          </button>
          <strong aria-live="polite">{passengers}</strong>
          <button
            onClick={() => setSelection(Math.min(30, passengers + 1))}
            disabled={passengers === 30}
            aria-label={es ? "Más pasajeros" : "More passengers"}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
      <div className="quote-vehicle">
        <Image
          src={quote.vehicle.image}
          alt={quote.vehicle.name[locale]}
          width={1672}
          height={941}
          sizes="(max-width: 700px) 100vw, 40vw"
        />
        <p className="small-note">
          {es ? "Vehículo sugerido" : "Suggested vehicle"}
        </p>
        <h4>{quote.vehicle.name[locale]}</h4>
        <p>{quote.vehicle.description[locale]}</p>
        <ul>
          {quote.vehicle.features.map((feature) => (
            <li key={feature.en}>{feature[locale]}</li>
          ))}
        </ul>
      </div>
      <div className="quote-total">
        <span>{es ? "Tarifa por vehículo" : "Rate per vehicle"}</span>
        <strong>
          {es ? "Cotización personalizada" : "Personalized quote"}
        </strong>
      </div>
      <a
        className="quote-whatsapp"
        href={getWhatsAppLink(message)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {es ? "Reservar por WhatsApp" : "Book via WhatsApp"}
        <ArrowUpRight size={21} />
      </a>
      <p className="quote-payment">
        {es ? "Pago directo al conductor" : "Direct payment to driver"}
      </p>
    </div>
  );
}
