"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowRight, MapPin, Play, ShieldCheck, X } from "lucide-react";
import { routes, getWhatsAppLink } from "@/data/routes";
import { getVehicleForPassengers } from "@/data/vehicles";
import type { Locale } from "@/i18n/config";

const locations = ["Santa Marta", "Cartagena", "Barranquilla", "Palomino", "Valledupar", "Minca", "Tayrona"];
const copy = {
  es: { place: "Transporte privado en el Caribe colombiano", title: "Ya llegaste.\nAhora, disfruta.", intro: "Del aeropuerto a la playa, de la ciudad a la sierra. Tu conductor, tu vehículo y el Caribe a tu ritmo.", from: "¿Dónde te recogemos?", to: "¿A dónde vamos?", pax: "Pasajeros", quote: "Cotizar mi viaje", note: "Vehículo privado. Tarifa por grupo.", video: "Conoce Evertrip", explore: "Descubre el viaje", error: "Elige un destino diferente al origen.", close: "Cerrar video", select: "Seleccionar" },
  en: { place: "Private transfers in the Colombian Caribbean", title: "You’ve arrived.\nNow, enjoy it.", intro: "From airport to beach, from city to mountains. Your driver, your vehicle, and the Caribbean at your pace.", from: "Where’s your pickup?", to: "Where are we going?", pax: "Passengers", quote: "Get my quote", note: "Private vehicle. One rate for your group.", video: "Meet Evertrip", explore: "Discover the journey", error: "Choose a destination different from your pickup.", close: "Close video", select: "Select a place" },
};

export default function Hero({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const router = useRouter();
  const [form, setForm] = useState({ origin: "", destination: "", pax: "2" });
  const [error, setError] = useState("");
  const [videoOpen, setVideoOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (form.origin === form.destination) { setError(t.error); return; }
    setError("");
    const slugs = [form.origin, form.destination].map(value => value.toLowerCase().replaceAll(" ", "-"));
    const route = routes.find(item => slugs.every(slug => item.slug.includes(slug)));
    if (route) router.push(`/${locale}/${route.slug}?pax=${form.pax}`);
    else window.open(getWhatsAppLink(`${locale === "es" ? "Cotización de traslado privado" : "Private transfer quote"}\n${form.origin} → ${form.destination}\n${t.pax}: ${form.pax}`), "_blank", "noopener,noreferrer");
  };

  return (
    <section className="arrival-hero" aria-labelledby="arrival-title">
      <div className="arrival-photo"><Image src="/assets/pilot/routes/tayrona-01.webp" alt={locale === "es" ? "Mar Caribe y playas del Parque Tayrona" : "Caribbean sea and beaches of Tayrona National Park"} fill preload sizes="100vw" className="object-cover" /></div>
      <div className="arrival-shade" />
      <div className="arrival-content">
        <p className="arrival-location"><MapPin size={16} aria-hidden="true" />{t.place}</p>
        <h1 id="arrival-title">{t.title.split("\n").map(line => <span key={line}>{line}</span>)}</h1>
        <p className="arrival-intro">{t.intro}</p>
        <button className="arrival-film" onClick={() => { setVideoOpen(true); dialog.current?.showModal(); }}><span><Play size={16} fill="currentColor" aria-hidden="true" /></span>{t.video}</button>
      </div>
      <div className="arrival-caption"><span>Tayrona</span><span>{locale === "es" ? "Donde la sierra abraza el mar" : "Where the mountains meet the sea"}</span></div>
      <div className="arrival-booking" id="book">
        <form onSubmit={submit}>
          {(["origin", "destination"] as const).map(field => <div className="arrival-field" key={field}>
            <label htmlFor={`hero-${field}`}>{field === "origin" ? t.from : t.to}</label>
            <select id={`hero-${field}`} required value={form[field]} onChange={event => { setForm({ ...form, [field]: event.target.value }); setError(""); }} aria-describedby={error ? "booking-error" : undefined} aria-invalid={!!error}>
              <option value="" disabled>{t.select}</option>
              {locations.map(location => <option key={location}>{location}</option>)}
            </select>
          </div>)}
          <div className="arrival-field arrival-passengers"><label htmlFor="hero-passengers">{t.pax}</label><input id="hero-passengers" type="number" inputMode="numeric" min="1" max="30" required value={form.pax} onChange={event => setForm({ ...form, pax: event.target.value })} /></div>
          <button className="arrival-submit" type="submit">{t.quote}<ArrowRight size={19} aria-hidden="true" /></button>
        </form>
        <div className="arrival-booking-note"><span><ShieldCheck size={15} aria-hidden="true" />{t.note}</span><span>{getVehicleForPassengers(Number(form.pax) || 2).name[locale]}</span></div>
        {error && <p id="booking-error" role="alert" className="booking-error">{error}</p>}
      </div>
      <Link href="#journey" className="arrival-scroll">{t.explore}<ArrowDown size={16} aria-hidden="true" /></Link>
      <dialog ref={dialog} className="arrival-video-dialog" aria-label={t.video} onClose={() => setVideoOpen(false)}>
        <button autoFocus onClick={() => dialog.current?.close()} aria-label={t.close}><X /></button>
        {videoOpen && <iframe src="https://www.youtube.com/embed/QbrpOFVaFbA?autoplay=1&rel=0" title={t.video} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />}
      </dialog>
    </section>
  );
}
