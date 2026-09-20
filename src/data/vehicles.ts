export type VehicleId = "sedan" | "van-medium" | "van-large" | "bus";
export type PassengerRange = "1-4" | "5-10" | "11-17" | "18-30";

export interface LocalizedString {
  es: string;
  en: string;
}

export interface Vehicle {
  id: VehicleId;
  capacityRange: PassengerRange;
  maxPassengers: number;
  name: LocalizedString;
  description: LocalizedString;
  features: LocalizedString[];
  image: string;
}

export const vehicles: Record<VehicleId, Vehicle> = {
  sedan: {
    id: "sedan",
    capacityRange: "1-4",
    maxPassengers: 4,
    name: {
      es: "SUV Estándar",
      en: "Standard SUV",
    },
    description: {
      es: "Nissan Kicks, Renault Duster o similar",
      en: "Nissan Kicks, Renault Duster or similar",
    },
    features: [
      { es: "Aire acondicionado", en: "Air conditioning" },
      { es: "Espacio para 4 maletas grandes", en: "Space for 4 large suitcases" },
      { es: "Viaje directo sin paradas", en: "Direct trip with no layovers" },
    ],
    image: "/assets/vehicles/nissan-kicks/nissan-kicks-exterior-01-webp-q92.webp",
  },
  "van-medium": {
    id: "van-medium",
    capacityRange: "5-10",
    maxPassengers: 10,
    name: {
      es: "Van Ejecutiva",
      en: "Business Van",
    },
    description: {
      es: "Mercedes Vito o similar",
      en: "Mercedes Vito or similar",
    },
    features: [
      { es: "Aire acondicionado completo", en: "Full air conditioning" },
      { es: "Asientos reclinables", en: "Reclining seats" },
      { es: "Amplio espacio para equipaje", en: "Ample luggage space" },
    ],
    image: "/assets/vehicles/mercedes-vito/mercedes-vito-exterior-01-webp-q92.webp",
  },
  "van-large": {
    id: "van-large",
    capacityRange: "11-17",
    maxPassengers: 17,
    name: {
      es: "Van Grupal",
      en: "Group Van",
    },
    description: {
      es: "Hyundai H1 o similar",
      en: "Hyundai H1 or similar",
    },
    features: [
      { es: "Climatización integral", en: "Integral climate control" },
      { es: "Sillas de máximo confort", en: "Maximum comfort seats" },
      { es: "Bodega para maletas", en: "Luggage hold" },
    ],
    image: "/assets/vehicles/hyundai-h1/hyundai-h1-exterior-01-webp-q92.webp",
  },
  bus: {
    id: "bus",
    capacityRange: "18-30",
    maxPassengers: 30,
    name: {
      es: "Bus Ejecutivo",
      en: "Executive Bus",
    },
    description: {
      es: "Transporte especial VIP",
      en: "Special VIP transport",
    },
    features: [
      { es: "Aire acondicionado", en: "Air conditioning" },
      { es: "Asientos reclinables premium", en: "Premium reclining seats" },
      { es: "Bodega de gran capacidad", en: "High capacity luggage hold" },
    ],
    image: "/assets/vehicles/bus-ejecutivo/Bus-exterior-1-webp-q92.webp",
  },
};

export function getVehicleForPassengers(passengers: number): Vehicle {
  if (passengers <= 4) return vehicles.sedan;
  if (passengers <= 10) return vehicles["van-medium"];
  if (passengers <= 17) return vehicles["van-large"];
  return vehicles.bus;
}
