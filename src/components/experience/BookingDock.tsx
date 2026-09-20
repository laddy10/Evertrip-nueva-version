"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Minus, Plus, X } from "lucide-react";
import { routes, getWhatsAppLink } from "@/data/routes";
import { getVehicleForPassengers } from "@/data/vehicles";
import type { Locale } from "@/i18n/config";

const places = [
  "Santa Marta",
  "Cartagena",
  "Barranquilla",
  "Palomino",
  "Valledupar",
  "Minca",
  "Tayrona",
];

export default function BookingDock({ locale }: { locale: Locale }) {
  const es = locale === "es";
  const dialog = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [origin, setOrigin] = useState("Santa Marta");
  const [destination, setDestination] = useState("");
  const [pax, setPax] = useState(2);
  const [error, setError] = useState("");
  const close = () => dialog.current?.close();
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (origin === destination) {
      setError(
        es
          ? "Elige un destino diferente al origen."
          : "Choose a destination different from your pickup.",
      );
      return;
    }
    const slugs = [origin, destination].map((value) =>
      value.toLowerCase().replaceAll(" ", "-"),
    );
    const route = routes.find((item) =>
      slugs.every((slug) => item.slug.includes(slug)),
    );
    if (route) {
      close();
      router.push(`/${locale}/${route.slug}?pax=${pax}`);
    } else
      window.open(
        getWhatsAppLink(
          `${es ? "Cotización de traslado privado" : "Private transfer quote"}\n${origin} → ${destination}\n${es ? "Pasajeros" : "Passengers"}: ${pax}`,
        ),
        "_blank",
        "noopener,noreferrer",
      );
  };
  return (
    <>
      <div className="trip-dock" id="book">
        <span className="trip-dock-intro">
          {es ? "Tu próximo viaje" : "Your next journey"}
        </span>
        <button
          className="trip-dock-route"
          onClick={() => dialog.current?.showModal()}
        >
          <span>Santa Marta</span>
          <span className="dock-route-thread" aria-hidden="true" />
          <span>{es ? "Donde quieras" : "Anywhere you choose"}</span>
        </button>
        <button
          className="trip-dock-cta"
          onClick={() => dialog.current?.showModal()}
        >
          {es ? "Planea tu viaje" : "Plan your journey"}
          <ArrowUpRight size={20} aria-hidden="true" />
        </button>
      </div>
      <dialog
        ref={dialog}
        className="booking-dialog"
        aria-labelledby="booking-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="booking-sheet">
          <button
            className="dialog-close"
            aria-label={es ? "Cerrar reserva" : "Close booking"}
            onClick={close}
          >
            <X />
          </button>
          <p className="small-note">
            Evertrip / {es ? "Transporte privado" : "Private transfers"}
          </p>
          <h2 id="booking-title">
            {es ? "¿A dónde\nte llevamos?" : "Where shall\nwe take you?"}
          </h2>
          <form onSubmit={submit}>
            <div className="booking-path" aria-hidden="true">
              <i />
              <span />
              <i />
            </div>
            <label htmlFor="hero-origin">
              {es ? "Te recogemos en" : "Your pickup"}
              <select
                id="hero-origin"
                value={origin}
                onChange={(event) => {
                  setOrigin(event.target.value);
                  setError("");
                }}
                required
              >
                {places.map((place) => (
                  <option key={place}>{place}</option>
                ))}
              </select>
            </label>
            <label htmlFor="hero-destination">
              {es ? "Te llevamos a" : "Your destination"}
              <select
                id="hero-destination"
                value={destination}
                onChange={(event) => {
                  setDestination(event.target.value);
                  setError("");
                }}
                required
                aria-invalid={!!error}
                aria-describedby={error ? "booking-error" : undefined}
              >
                <option value="" disabled>
                  {es ? "Elige tu destino" : "Choose your destination"}
                </option>
                {places.map((place) => (
                  <option key={place}>{place}</option>
                ))}
              </select>
            </label>
            <div className="booking-people">
              <label htmlFor="hero-passengers">
                {es ? "¿Cuántos viajan?" : "How many travelers?"}
                <small>{getVehicleForPassengers(pax).name[locale]}</small>
              </label>
              <div>
                <button
                  type="button"
                  onClick={() => setPax(Math.max(1, pax - 1))}
                  disabled={pax === 1}
                  aria-label={es ? "Menos pasajeros" : "Fewer passengers"}
                >
                  <Minus size={17} />
                </button>
                <input
                  id="hero-passengers"
                  type="number"
                  min={1}
                  max={30}
                  value={pax}
                  onChange={(event) =>
                    setPax(
                      Math.min(
                        30,
                        Math.max(1, Number(event.target.value) || 1),
                      ),
                    )
                  }
                />
                <button
                  type="button"
                  onClick={() => setPax(Math.min(30, pax + 1))}
                  disabled={pax === 30}
                  aria-label={es ? "Más pasajeros" : "More passengers"}
                >
                  <Plus size={17} />
                </button>
              </div>
            </div>
            {error && (
              <p id="booking-error" role="alert">
                {error}
              </p>
            )}
            <button type="submit" className="booking-submit">
              {es ? "Cotizar mi viaje" : "Get my quote"}
              <ArrowUpRight size={20} />
            </button>
            <p className="booking-footnote">
              {es
                ? "Un vehículo para tu grupo. La reserva se confirma por WhatsApp."
                : "A vehicle for your group. Your booking is confirmed on WhatsApp."}
            </p>
          </form>
        </div>
      </dialog>
    </>
  );
}
