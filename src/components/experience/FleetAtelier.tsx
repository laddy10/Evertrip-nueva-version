"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, Expand } from "lucide-react";
import { vehicles, type VehicleId } from "@/data/vehicles";
import { getWhatsAppLink } from "@/data/routes";
import type { Locale } from "@/i18n/config";
import { VehicleLightbox, useClickGesture } from "../sections/FleetShowcase";

const fleet: { name: string; id: VehicleId; year: string; images: string[] }[] =
  [
    {
      name: "Mercedes Vito",
      id: "van-medium",
      year: "2020",
      images: [
        "mercedes-vito/mercedes-vito-exterior-01-webp-q92.webp",
        "mercedes-vito/mercedes-vito-exterior-02-webp-q92.webp",
        "mercedes-vito/mercedes-vito-interior-01-webp-q92.webp",
      ],
    },
    {
      name: "Nissan Kicks",
      id: "sedan",
      year: "2026",
      images: [
        "nissan-kicks/nissan-kicks-exterior-01-webp-q92.webp",
        "nissan-kicks/nissan-kicks-exterior-02-webp-q92.webp",
        "nissan-kicks/nissan-kicks-interior-01-webp-q92.webp",
      ],
    },
    {
      name: "Renault Duster",
      id: "sedan",
      year: "2025",
      images: [
        "renault-duster/renault-duster-exterior-01-webp-q92.webp",
        "renault-duster/renault-duster-exterior-02-webp-q92.webp",
        "renault-duster/renault-duster-interior-01-webp-q92.webp",
      ],
    },
    {
      name: "Hyundai H1",
      id: "van-large",
      year: "2024",
      images: [
        "hyundai-h1/hyundai-h1-exterior-01-webp-q92.webp",
        "hyundai-h1/hyundai-h1-exterior-02-webp-q92.webp",
        "hyundai-h1/hyundai-h1-interior-01-webp-q92.webp",
      ],
    },
    {
      name: "Bus Ejecutivo",
      id: "bus",
      year: "2024",
      images: [
        "bus-ejecutivo/Bus-exterior-1-webp-q92.webp",
        "bus-ejecutivo/Bus-exterior-2-webp-q92.webp",
        "bus-ejecutivo/Bus-interior-1-webp-q92.webp",
      ],
    },
  ];

export default function FleetAtelier({ locale }: { locale: Locale }) {
  const es = locale === "es";
  const [selected, setSelected] = useState(0);
  const [photo, setPhoto] = useState(0);
  const [modal, setModal] = useState<{
    photo: number;
    opener: HTMLButtonElement;
  } | null>(null);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const gesture = useClickGesture();
  const item = fleet[selected];
  const vehicle = vehicles[item.id];
  const images = item.images.map((path) => `/assets/vehicles/${path}`);
  const paginate = (direction: number) =>
    setPhoto(
      (current) => (current + direction + images.length) % images.length,
    );
  return (
    <section className="fleet-atelier" id="fleet" aria-labelledby="fleet-title">
      <div className="fleet-opening">
        <p className="chapter-caption">
          {es
            ? "Elige con quién viajas. El espacio lo ponemos nosotros."
            : "Choose your travel companions. We’ll bring the space."}
        </p>
        <h2 id="fleet-title">
          {es ? "Tu gente.\nTu espacio." : "Your people.\nYour space."}
        </h2>
        <p>
          {es
            ? "Desde una escapada de dos hasta un viaje de treinta. Esta es la flota que te lleva por el Caribe."
            : "From an escape for two to a journey for thirty. Meet the fleet that takes you through the Caribbean."}
        </p>
      </div>
      <div className="fleet-studio">
        <div
          className="fleet-selector"
          aria-label={es ? "Seleccionar vehículo" : "Choose a vehicle"}
        >
          {fleet.map((model, index) => (
            <button
              key={model.name}
              aria-pressed={selected === index}
              onClick={() => {
                setSelected(index);
                setPhoto(0);
              }}
            >
              <span>
                {model.name === "Bus Ejecutivo" && !es
                  ? "Executive Bus"
                  : model.name}
              </span>
              <small>
                {vehicles[model.id].maxPassengers} {es ? "personas" : "people"}
              </small>
            </button>
          ))}
        </div>
        <div className="fleet-stage">
          <div className="fleet-model-title" aria-hidden="true">
            {item.name === "Bus Ejecutivo"
              ? "Executive"
              : item.name.split(" ").slice(-1)}
          </div>
          <button
            className="fleet-photo"
            aria-label={`${es ? "Ampliar imagen de" : "Enlarge image of"} ${item.name}`}
            aria-haspopup="dialog"
            onPointerDown={(event) => {
              gesture.begin(event);
              swipeStart.current = { x: event.clientX, y: event.clientY };
            }}
            onPointerMove={gesture.move}
            onPointerCancel={() => {
              gesture.cancel();
              swipeStart.current = null;
            }}
            onPointerUp={(event) => {
              gesture.release(event);
              const start = swipeStart.current;
              if (
                start &&
                Math.abs(event.clientX - start.x) > 55 &&
                Math.abs(event.clientY - start.y) < 50
              )
                paginate(event.clientX < start.x ? 1 : -1);
              else if (
                start &&
                event.isPrimary &&
                event.pointerType === "touch" &&
                Math.hypot(event.clientX - start.x, event.clientY - start.y) <=
                  6
              ) {
                // A deliberate touch tap should also work after a pan, when
                // browsers can suppress the subsequent compatibility click.
                event.preventDefault();
                gesture.cancel();
                setModal({ photo, opener: event.currentTarget });
              }
              swipeStart.current = null;
            }}
            onClick={(event) => {
              if (gesture.consumeClick(event))
                setModal({ photo, opener: event.currentTarget });
            }}
          >
            <Image
              key={images[photo]}
              src={images[photo]}
              alt={`${item.name} — ${es ? "vista" : "view"} ${photo + 1}`}
              width={1672}
              height={941}
              sizes="(max-width: 700px) 100vw, 80vw"
              draggable={false}
            />
            <span className="fleet-expand">
              <Expand size={16} />
              {es ? "Ver de cerca" : "Take a closer look"}
            </span>
          </button>
          <div className="fleet-photo-controls">
            <button
              onClick={() => paginate(-1)}
              aria-label={es ? "Imagen anterior" : "Previous image"}
            >
              <ArrowLeft size={20} />
            </button>
            <span>
              {photo === 2
                ? es
                  ? "Interior"
                  : "Interior"
                : es
                  ? "Exterior"
                  : "Exterior"}{" "}
              / {photo + 1}—3
            </span>
            <button
              onClick={() => paginate(1)}
              aria-label={es ? "Imagen siguiente" : "Next image"}
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
      <div className="fleet-specification" aria-live="polite">
        <div className="fleet-capacity">
          <strong>{String(vehicle.maxPassengers).padStart(2, "0")}</strong>
          <span>{es ? "pasajeros" : "passengers"}</span>
        </div>
        <div className="fleet-description">
          <h3>{vehicle.name[locale]}</h3>
          <p>
            {item.name} / {es ? "Modelo" : "Model"} {item.year}
          </p>
          <ul>
            {vehicle.features.map((feature) => (
              <li key={feature.en}>{feature[locale]}</li>
            ))}
          </ul>
        </div>
        <a
          href={getWhatsAppLink(
            es
              ? `Hola Evertrip, quiero cotizar un traslado en ${item.name}.`
              : `Hi Evertrip, I would like a transfer quote for the ${item.name}.`,
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="text-link"
        >
          {es ? "Viajar en este vehículo" : "Travel in this vehicle"}
          <ArrowUpRight size={22} />
        </a>
      </div>
      {modal && (
        <VehicleLightbox
          name={item.name}
          images={images}
          imageIndex={modal.photo}
          locale={locale}
          opener={modal.opener}
          onClose={() => setModal(null)}
          onNavigate={(direction) =>
            setModal((current) =>
              current
                ? {
                    ...current,
                    photo:
                      (current.photo + direction + images.length) %
                      images.length,
                  }
                : null,
            )
          }
        />
      )}
    </section>
  );
}
