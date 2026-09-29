"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { FaArrowRight } from "react-icons/fa";

const content = {
  es: {
    heading: "TU VIAJE COMIENZA AQUÍ",
    title: "Reserva",
    fields: {
      origin: "ORIGEN",
      destination: "DESTINO",
      date: "FECHA",
      passengers: "PASAJEROS",
      vehicle: "VEHÍCULO",
      name: "NOMBRE",
    },
    vehicles: ["Premium SUV", "Executive Van", "Luxury Minibus"],
    submit: "SOLICITAR RESERVA",
  },
  en: {
    heading: "YOUR JOURNEY BEGINS HERE",
    title: "Book",
    fields: {
      origin: "ORIGIN",
      destination: "DESTINATION",
      date: "DATE",
      passengers: "PASSENGERS",
      vehicle: "VEHICLE",
      name: "NAME",
    },
    vehicles: ["Premium SUV", "Executive Van", "Luxury Minibus"],
    submit: "REQUEST BOOKING",
  }
};

export default function BookingForm({ locale }: { locale: Locale }) {
  const t = content[locale] || content.es;
  
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    date: "",
    passengers: "",
    vehicle: "",
    name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `*Reserva Privada*\n\n*Nombre:* ${formData.name}\n*Ruta:* ${formData.origin} -> ${formData.destination}\n*Fecha:* ${formData.date}\n*Pax:* ${formData.passengers}\n*Clase:* ${formData.vehicle}`;
    window.open(getWhatsAppLink(msg), "_blank");
  };

  const inputClass = "w-full bg-white border border-slate-200 py-4 px-6 text-brand-text-primary outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all font-light text-lg rounded-2xl appearance-none shadow-sm";
  const labelClass = "text-[10px] font-semibold text-brand-text-secondary tracking-[0.2em] uppercase block mb-1";

  return (
    <section id="book" className="py-32 bg-brand-primary-bg relative border-t hairline-t">
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <p className="text-brand-accent tracking-[0.3em] text-[10px] font-semibold uppercase mb-4">{t.heading}</p>
            <h2 className="text-4xl md:text-6xl font-heading text-brand-text-primary uppercase tracking-widest mb-6">{t.title}</h2>
          </div>

          <form onSubmit={handleSubmit} className="lg:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
              
              <div className="md:col-span-2">
                <label className={labelClass}>{t.fields.name}</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>{t.fields.origin}</label>
                <input required type="text" name="origin" value={formData.origin} onChange={handleChange} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>{t.fields.destination}</label>
                <input required type="text" name="destination" value={formData.destination} onChange={handleChange} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>{t.fields.date}</label>
                <input required type="date" name="date" value={formData.date} onChange={handleChange} className={`${inputClass} [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert opacity-80 focus:opacity-100`} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t.fields.passengers}</label>
                  <input required type="number" min="1" name="passengers" value={formData.passengers} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{t.fields.vehicle}</label>
                  <select required name="vehicle" value={formData.vehicle} onChange={handleChange} className={`${inputClass} bg-transparent`}>
                    <option value="" disabled className="text-black">...</option>
                    {t.vehicles.map((v) => <option key={v} value={v} className="text-black bg-white">{v}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-16 flex">
              <button 
                type="submit"
                className="group flex items-center gap-6 text-xs font-semibold tracking-[0.2em] uppercase text-brand-text-primary hover:text-brand-accent transition-colors duration-500"
              >
                <span>{t.submit}</span>
                <div className="w-12 h-12 rounded-full border border-brand-text-primary/20 flex items-center justify-center group-hover:border-brand-accent transition-colors duration-500">
                  <FaArrowRight className="transform -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
