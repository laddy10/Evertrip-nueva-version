import { palominoPricing, santaMartaPricing, formatCOP } from "./pricing";
import { getVehicleForPassengers, Vehicle } from "./vehicles";

export type Locale = "es" | "en";

export interface Localized {
  es: string;
  en: string;
}

export interface RouteFAQ {
  q: Localized;
  a: Localized;
}

export type PriceMode = "tiered" | "base" | "quote";

export interface RouteDefinition {
  slug: string;
  featured?: boolean;
  title: Localized;
  h1: Localized;
  metaDescription: Localized;
  description: Localized;
  duration: Localized;
  idealFor: Localized;
  highlights: { es: string[]; en: string[] };
  faqs: RouteFAQ[];
  waMessage: Localized;
  priceMode: PriceMode;
  image?: string;
  image2?: string;
}

export function getRouteCardTitle(route: RouteDefinition, locale: Locale): string {
  return route.h1[locale].replace(locale === "es" ? /^Transporte privado / : /^Private Transfer /, "");
}

const WHATSAPP_NUMBER = "573147659756";

export interface QuoteResult {
  vehicle: Vehicle;
  price: number;
  priceFormatted: string;
  isQuoteOnly: boolean;
}

export function getQuoteForRoute(slug: string, passengers: number): QuoteResult | null {
  const vehicle = getVehicleForPassengers(passengers);

  // Helper to resolve tiered pricing (Palomino routes)
  const getTiered = (destinationKey: keyof typeof palominoPricing) => {
    const prices = palominoPricing[destinationKey];
    if (!prices) return null;
    return prices[vehicle.capacityRange as keyof typeof prices];
  };

  // Helper to resolve base pricing (Santa Marta routes)
  const getBase = (destinationKey: keyof typeof santaMartaPricing) => {
    return santaMartaPricing[destinationKey];
  };

  let price = 0;
  let isQuoteOnly = false;

  switch (slug) {
    case "barranquilla-to-palomino":
      price = getTiered("barranquilla") || 0;
      break;
    case "barranquilla-to-santa-marta":
      price = getBase("barranquilla") || 0;
      break;
    case "santa-marta-to-palomino":
      price = getBase("palomino") || 0;
      break;
    case "private-transfer-santa-marta-cartagena":
    case "cartagena-airport-to-santa-marta":
      price = getBase("cartagena") || 0;
      break;
    case "santa-marta-to-tayrona":
      price = getBase("parque-tayrona") || 0;
      break;
    case "santa-marta-to-minca":
      price = getBase("minca") || 0;
      break;
    default:
      // Custom routes or routes that are always manual quote
      break;
  }

  return {
    vehicle,
    price,
    priceFormatted: formatCOP(price),
    isQuoteOnly: true,
  };
}

export interface PriceCard {
  label: Localized;
  price: string;
  note?: Localized;
}

export function getPriceCards(route: RouteDefinition): PriceCard[] {
  return [];
}

export const routes: RouteDefinition[] = [
  {
    slug: "barranquilla-to-palomino",
    featured: true,
    priceMode: "tiered",
    title: {
      es: "Transporte privado de Barranquilla a Palomino | EverTrip",
      en: "Private Transfer Barranquilla to Palomino | EverTrip",
    },
    h1: {
      es: "Transporte privado Barranquilla ↔ Palomino",
      en: "Private Transfer Barranquilla ↔ Palomino",
    },
    metaDescription: {
      es: "Traslado privado entre Barranquilla y Palomino con recogida en hotel, dirección o aeropuerto. Equipaje y paradas coordinadas. Reserva por WhatsApp.",
      en: "Private transfer between Barranquilla and Palomino with hotel, address or airport pickup. Luggage and coordinated stops. Book via WhatsApp.",
    },
    description: {
      es: "Conectamos Barranquilla y Palomino en servicio privado, con recogida en hoteles, direcciones, aeropuerto y otros puntos accesibles previamente coordinados. Puedes viajar con equipaje y reservar el trayecto en cualquiera de los dos sentidos.",
      en: "We connect Barranquilla and Palomino by private transfer, with pickup at hotels, addresses, the airport and other accessible points arranged in advance. You can travel with luggage and book the trip in either direction.",
    },
    duration: { es: "Aprox. 2h 30min - 3h", en: "Approx. 2h 30min - 3h" },
    idealFor: { es: "Familias, parejas y grupos", en: "Families, couples and groups" },
    highlights: {
      es: [
        "Recogida en hoteles, direcciones o aeropuerto de Barranquilla",
        "Llegada a Palomino o a un punto accesible previamente coordinado",
        "Equipaje coordinado según pasajeros y vehículo",
        "Paradas de aproximadamente 30 a 40 minutos, coordinadas con anticipación",
        "Disponible en ambos sentidos, con cada trayecto cotizado por separado",
      ],
      en: [
        "Pickup at hotels, addresses or Barranquilla airport",
        "Drop-off in Palomino or another accessible point arranged in advance",
        "Luggage coordinated according to passengers and vehicle",
        "Stops of approximately 30 to 40 minutes, arranged in advance",
        "Available in both directions, with each trip quoted separately",
      ],
    },
    faqs: [
      {
        q: { es: "¿Cuánto dura el viaje entre Barranquilla y Palomino?", en: "How long is the trip between Barranquilla and Palomino?" },
        a: { es: "En promedio entre 2 horas y media y 3 horas, dependiendo del tráfico y de los puntos exactos de recogida y llegada. Las paradas coordinadas aumentan el tiempo total.", en: "On average between 2.5 and 3 hours, depending on traffic and the exact pickup and drop-off points. Coordinated stops increase the total journey time." },
      },
      {
        q: { es: "¿Pueden recogerme en el aeropuerto?", en: "Can you pick me up at the airport?" },
        a: { es: "Sí. Podemos coordinar recogida o llegada en aeropuerto, además de hoteles y direcciones.", en: "Yes. We can coordinate airport pickup or drop-off, as well as hotels and addresses." },
      },
      {
        q: { es: "¿Puedo viajar con equipaje?", en: "Can I travel with luggage?" },
        a: { es: "Sí. Coordinamos el equipaje según la cantidad de pasajeros y el vehículo asignado.", en: "Yes. We coordinate luggage according to the number of passengers and the vehicle assigned." },
      },
      {
        q: { es: "¿Puedo hacer una parada durante el trayecto?", en: "Can I make a stop during the trip?" },
        a: { es: "Sí. Podemos coordinar paradas de aproximadamente 30 a 40 minutos. Son flexibles y extienden la duración total del trayecto.", en: "Yes. We can coordinate stops of approximately 30 to 40 minutes. They are flexible and extend the total journey time." },
      },
      {
        q: { es: "¿Puedo reservar Palomino → Barranquilla?", en: "Can I book Palomino → Barranquilla?" },
        a: { es: "Sí. El servicio está disponible en ambos sentidos y cada trayecto se cotiza y cobra por separado.", en: "Yes. The service is available in both directions, and each trip is quoted and charged separately." },
      },
    ],
    waMessage: {
      es: "Hola, necesito un transporte privado entre Barranquilla y Palomino.",
      en: "Hi, I need a private transfer between Barranquilla and Palomino.",
    },
    image: "/assets/pilot/routes/barranquilla-01.webp",
    image2: "/assets/pilot/routes/palomino-01.webp",
  },
  {
    slug: "barranquilla-to-santa-marta",
    featured: true,
    priceMode: "base",
    title: {
      es: "Transporte privado de Barranquilla a Santa Marta | EverTrip",
      en: "Private Transfer Barranquilla to Santa Marta | EverTrip",
    },
    h1: {
      es: "Transporte privado Barranquilla ↔ Santa Marta",
      en: "Private Transfer Barranquilla ↔ Santa Marta",
    },
    metaDescription: {
      es: "Traslado privado entre Barranquilla y Santa Marta con recogida en hotel, dirección o aeropuerto. Equipaje y paradas coordinadas por WhatsApp.",
      en: "Private transfer between Barranquilla and Santa Marta with hotel, address or airport pickup. Luggage and coordinated stops via WhatsApp.",
    },
    description: {
      es: "Conectamos Barranquilla y Santa Marta en servicio privado, con recogida en hoteles, direcciones, aeropuertos y otros puntos accesibles previamente coordinados. El viaje puede reservarse en cualquiera de los dos sentidos.",
      en: "We connect Barranquilla and Santa Marta by private transfer, with pickup at hotels, addresses, airports and other accessible points arranged in advance. The trip can be booked in either direction.",
    },
    duration: { es: "Aprox. 1h 30min - 2h", en: "Approx. 1h 30min - 2h" },
    idealFor: { es: "Viajeros, familias, grupos y negocios", en: "Travelers, families, groups and business" },
    highlights: {
      es: [
        "Recogida en hoteles, direcciones o aeropuertos de Barranquilla o Santa Marta",
        "Equipaje coordinado según pasajeros y vehículo",
        "Paradas de aproximadamente 30 a 40 minutos, coordinadas con anticipación",
        "Servicio privado sin compartir con otros pasajeros",
        "Disponible en ambos sentidos, con cada trayecto cotizado por separado",
      ],
      en: [
        "Pickup at hotels, addresses or airports in Barranquilla or Santa Marta",
        "Luggage coordinated according to passengers and vehicle",
        "Stops of approximately 30 to 40 minutes, arranged in advance",
        "Private service not shared with other passengers",
        "Available in both directions, with each trip quoted separately",
      ],
    },
    faqs: [
      {
        q: { es: "¿Cuánto dura el viaje entre Barranquilla y Santa Marta?", en: "How long does the trip between Barranquilla and Santa Marta take?" },
        a: { es: "Normalmente entre 1 hora y media y 2 horas, según el tráfico y los puntos exactos de recogida y llegada. Una parada coordinada aumenta el tiempo total.", en: "Usually between 1.5 and 2 hours, depending on traffic and the exact pickup and drop-off points. A coordinated stop increases the total journey time." },
      },
      {
        q: { es: "¿Pueden recogerme en el aeropuerto?", en: "Can you pick me up at the airport?" },
        a: { es: "Sí. Podemos coordinar recogida o llegada en aeropuerto, además de hoteles y direcciones.", en: "Yes. We can coordinate airport pickup or drop-off, as well as hotels and addresses." },
      },
      {
        q: { es: "¿Puedo hacer una parada durante el trayecto?", en: "Can I make a stop during the trip?" },
        a: { es: "Sí. Podemos coordinar paradas de aproximadamente 30 a 40 minutos. Son flexibles y extienden la duración total del viaje.", en: "Yes. We can coordinate stops of approximately 30 to 40 minutes. They are flexible and extend the total journey time." },
      },
      {
        q: { es: "¿Puedo reservar Santa Marta → Barranquilla?", en: "Can I book Santa Marta → Barranquilla?" },
        a: { es: "Sí. El servicio está disponible en ambos sentidos y cada trayecto se cotiza y cobra por separado.", en: "Yes. The service is available in both directions, and each trip is quoted and charged separately." },
      },
    ],
    waMessage: {
      es: "Hola, necesito un transporte privado entre Barranquilla y Santa Marta.",
      en: "Hi, I need a private transfer between Barranquilla and Santa Marta.",
    },
    image: "/assets/pilot/routes/barranquilla-01.webp",
    image2: "/assets/pilot/routes/santa-marta-01.webp",
  },
  {
    slug: "barranquilla-to-valledupar",
    featured: true,
    priceMode: "quote",
    title: {
      es: "Transporte privado Barranquilla - Valledupar | EverTrip",
      en: "Private Transfer Barranquilla - Valledupar | EverTrip",
    },
    h1: {
      es: "Barranquilla ↔ Valledupar",
      en: "Barranquilla ↔ Valledupar",
    },
    metaDescription: {
      es: "Traslado privado entre Barranquilla y Valledupar con recogida en hotel, dirección o aeropuerto. Equipaje y paradas coordinadas por WhatsApp.",
      en: "Private transfer between Barranquilla and Valledupar with hotel, address or airport pickup. Luggage and coordinated stops via WhatsApp.",
    },
    description: {
      es: "Coordinamos transporte privado entre Barranquilla y Valledupar con recogida en hoteles, direcciones, aeropuerto y otros puntos accesibles acordados previamente. El servicio puede reservarse en cualquiera de los dos sentidos.",
      en: "We coordinate private transportation between Barranquilla and Valledupar with pickup at hotels, addresses, the airport and other accessible points arranged in advance. The service can be booked in either direction.",
    },
    duration: { es: "4 a 5 horas", en: "4 to 5 hours" },
    idealFor: { es: "Viajeros, familias, grupos y negocios", en: "Travelers, families, groups and business" },
    highlights: {
      es: [
        "Recogida en hoteles, direcciones o aeropuerto de Barranquilla o Valledupar",
        "Equipaje coordinado según pasajeros y vehículo",
        "Paradas de aproximadamente 30 a 40 minutos, coordinadas con anticipación",
        "Servicio privado puerta a puerta cuando el punto es accesible",
        "Disponible en ambos sentidos, con cada trayecto cotizado por separado",
      ],
      en: [
        "Pickup at hotels, addresses or airports in Barranquilla or Valledupar",
        "Luggage coordinated according to passengers and vehicle",
        "Stops of approximately 30 to 40 minutes, arranged in advance",
        "Private door-to-door service when the location is accessible",
        "Available in both directions, with each trip quoted separately",
      ],
    },
    faqs: [
      {
        q: { es: "¿Cuánto dura el viaje entre Barranquilla y Valledupar?", en: "How long is the trip between Barranquilla and Valledupar?" },
        a: { es: "El trayecto suele durar entre 4 y 5 horas, dependiendo del tráfico y de los puntos exactos de recogida y llegada. Las paradas coordinadas aumentan el tiempo total.", en: "The trip usually takes between 4 and 5 hours, depending on traffic and the exact pickup and drop-off points. Coordinated stops increase the total journey time." },
      },
      {
        q: { es: "¿El servicio es puerta a puerta?", en: "Is the service door-to-door?" },
        a: { es: "Sí, cuando el punto de recogida y llegada es accesible y seguro para el vehículo. No ingresamos a zonas de alto riesgo ni a lugares sin acceso adecuado.", en: "Yes, when the pickup and drop-off locations are accessible and safe for the vehicle. We do not enter high-risk areas or locations without suitable access." },
      },
      {
        q: { es: "¿Puedo hacer una parada en el camino?", en: "Can I make a stop along the way?" },
        a: { es: "Sí. Se pueden coordinar paradas de aproximadamente 30 a 40 minutos. Son flexibles y extienden la duración total del viaje.", en: "Yes. Stops of approximately 30 to 40 minutes can be arranged. They are flexible and extend the total journey time." },
      },
      {
        q: { es: "¿Puedo reservar Valledupar → Barranquilla?", en: "Can I book Valledupar → Barranquilla?" },
        a: { es: "Sí. El servicio está disponible en ambos sentidos y cada trayecto se cotiza y cobra por separado.", en: "Yes. The service is available in both directions, and each trip is quoted and charged separately." },
      },
    ],
    waMessage: {
      es: "Hola, quiero cotizar un transporte privado entre Barranquilla y Valledupar.",
      en: "Hi, I'd like a quote for a private transfer between Barranquilla and Valledupar.",
    },
    image: "/assets/pilot/routes/barranquilla-01.webp",
    image2: "/assets/pilot/routes/valledupar-01.webp",
  },
  {
    slug: "private-transfer-santa-marta-cartagena",
    priceMode: "base",
    title: { es: "Transporte privado Santa Marta - Cartagena | EverTrip", en: "Private Transfer Santa Marta - Cartagena | EverTrip" },
    h1: { es: "Transporte privado Santa Marta ↔ Cartagena", en: "Private Transfer Santa Marta ↔ Cartagena" },
    metaDescription: {
      es: "Traslado privado entre Santa Marta y Cartagena con recogida en hotel, dirección o aeropuerto. Equipaje y paradas coordinadas. Reserva por WhatsApp.",
      en: "Private transfer between Santa Marta and Cartagena with hotel, address or airport pickup. Luggage and coordinated stops. Book via WhatsApp.",
    },
    description: {
      es: "Conectamos Santa Marta y Cartagena en servicio privado, con recogida en hoteles, direcciones o aeropuertos y llegada al punto acordado. El trayecto puede reservarse en cualquiera de los dos sentidos; cada servicio se cotiza y cobra por separado.",
      en: "We connect Santa Marta and Cartagena with a private transfer, with pickup at hotels, addresses or airports and drop-off at the agreed location. The trip can be booked in either direction; each transfer is quoted and charged separately.",
    },
    duration: { es: "Aprox. 4h - 4h 30min", en: "Approx. 4h - 4h 30min" },
    idealFor: { es: "Familias, parejas y grupos", en: "Families, couples and groups" },
    highlights: {
      es: [
        "Recogida en hoteles, direcciones y aeropuertos de Santa Marta o Cartagena",
        "Equipaje coordinado según el número de pasajeros y el vehículo",
        "Paradas de aproximadamente 30 a 40 minutos, coordinadas con anticipación",
        "Servicio privado sin terminales ni transbordos",
        "Disponible en ambos sentidos, con cada trayecto cotizado por separado",
      ],
      en: [
        "Pickup at hotels, addresses and airports in Santa Marta or Cartagena",
        "Luggage coordinated according to passenger count and vehicle",
        "Stops of approximately 30 to 40 minutes, arranged in advance",
        "Private service without terminals or transfers",
        "Available in both directions, with each trip quoted separately",
      ],
    },
    faqs: [
      {
        q: { es: "¿Cuánto dura el viaje entre Santa Marta y Cartagena?", en: "How long does the Santa Marta - Cartagena trip take?" },
        a: { es: "El trayecto suele durar aproximadamente entre 4 y 4 horas y media, según el tráfico y los puntos exactos de recogida y llegada. Las paradas coordinadas aumentan el tiempo total del viaje.", en: "The trip usually takes approximately 4 to 4.5 hours, depending on traffic and the exact pickup and drop-off points. Coordinated stops increase the total journey time." },
      },
      {
        q: { es: "¿Puedo hacer una parada durante el trayecto?", en: "Can I make a stop during the trip?" },
        a: { es: "Sí. Podemos coordinar paradas de aproximadamente 30 a 40 minutos. Son flexibles y deben acordarse con anticipación; cualquier parada extiende la duración total del trayecto.", en: "Yes. We can coordinate stops of approximately 30 to 40 minutes. They are flexible and should be arranged in advance; any stop extends the total journey time." },
      },
      {
        q: { es: "¿Puedo reservar Cartagena → Santa Marta?", en: "Can I book Cartagena → Santa Marta?" },
        a: { es: "Sí. El servicio está disponible en ambos sentidos. Cada trayecto se cotiza y cobra por separado.", en: "Yes. The service is available in both directions. Each trip is quoted and charged separately." },
      },
      {
        q: { es: "¿Dónde pueden recogerme o dejarme?", en: "Where can you pick me up or drop me off?" },
        a: { es: "Coordinamos recogidas y llegadas en hoteles, direcciones, aeropuertos, pueblos y playas cuando el acceso es adecuado. No ingresamos a zonas de alto riesgo ni a puntos que no sean accesibles para el vehículo.", en: "We coordinate pickups and drop-offs at hotels, addresses, airports, towns and beaches when access is suitable. We do not enter high-risk areas or locations that are not accessible by vehicle." },
      },
    ],
    waMessage: { es: "Hola, necesito un transporte privado entre Santa Marta y Cartagena.", en: "Hi, I need a private transfer between Santa Marta and Cartagena." },
    image: "/assets/pilot/routes/santa-marta-01.webp",
    image2: "/assets/pilot/routes/cartagena-01.webp",
  },
  {
    slug: "santa-marta-to-minca",
    priceMode: "base",
    title: { es: "Transporte privado Santa Marta - Minca | EverTrip", en: "Private Transfer Santa Marta - Minca | EverTrip" },
    h1: { es: "Santa Marta ↔ Minca", en: "Santa Marta ↔ Minca" },
    metaDescription: {
      es: "Traslado privado entre Santa Marta y Minca con recogida en hotel, dirección o aeropuerto. Equipaje, paradas coordinadas y regreso disponible.",
      en: "Private transfer between Santa Marta and Minca with hotel, address or airport pickup. Luggage, coordinated stops and return service available.",
    },
    description: {
      es: "Viajamos entre Santa Marta y Minca en servicio privado, con recogida en hoteles, direcciones o aeropuerto y llegada al punto accesible que coordinemos. En zonas de montaña, el punto final depende de las condiciones de acceso para el vehículo.",
      en: "We travel between Santa Marta and Minca by private transfer, with pickup at hotels, addresses or the airport and drop-off at the accessible point we arrange. In mountain areas, the final drop-off depends on vehicle access conditions.",
    },
    duration: { es: "Aprox. 45min - 1h", en: "Approx. 45min - 1h" },
    idealFor: { es: "Viajes a Minca, alojamientos y grupos", en: "Minca trips, lodging and groups" },
    highlights: {
      es: [
        "Recogida en hoteles, direcciones o aeropuerto de Santa Marta",
        "Equipaje coordinado según el grupo y el vehículo",
        "Paradas de aproximadamente 30 a 40 minutos, coordinadas con anticipación",
        "Regreso disponible y coordinado por separado",
        "Acceso sujeto a condiciones de seguridad y transitabilidad para el vehículo",
      ],
      en: [
        "Pickup at hotels, addresses or Santa Marta airport",
        "Luggage coordinated according to the group and vehicle",
        "Stops of approximately 30 to 40 minutes, arranged in advance",
        "Return service available and arranged separately",
        "Access subject to safety and vehicle road-access conditions",
      ],
    },
    faqs: [
      {
        q: { es: "¿Cuánto dura el viaje entre Santa Marta y Minca?", en: "How long is the trip between Santa Marta and Minca?" },
        a: { es: "Normalmente entre 45 minutos y 1 hora, según el tráfico y el punto exacto de recogida o llegada. Una parada coordinada extiende el tiempo total.", en: "Usually between 45 minutes and 1 hour, depending on traffic and the exact pickup or drop-off point. A coordinated stop extends the total journey time." },
      },
      {
        q: { es: "¿Pueden llevarme hasta cualquier alojamiento en Minca?", en: "Can you take me to any accommodation in Minca?" },
        a: { es: "Llegamos hasta puntos accesibles para el vehículo. Si un alojamiento o camino no es transitable o está en una zona de alto riesgo, coordinamos un punto seguro y accesible de llegada.", en: "We reach locations that are accessible by vehicle. If a lodging or road is not passable or is in a high-risk area, we coordinate a safe, accessible drop-off point." },
      },
      {
        q: { es: "¿Puedo hacer una parada durante el trayecto?", en: "Can I make a stop during the trip?" },
        a: { es: "Sí. Se pueden coordinar paradas de aproximadamente 30 a 40 minutos. Son flexibles y aumentan la duración total del viaje.", en: "Yes. Stops of approximately 30 to 40 minutes can be arranged. They are flexible and increase the total journey time." },
      },
      {
        q: { es: "¿El servicio funciona también de Minca a Santa Marta?", en: "Is the service also available from Minca to Santa Marta?" },
        a: { es: "Sí. Puede reservarse en ambos sentidos y cada trayecto se cotiza y cobra por separado.", en: "Yes. It can be booked in both directions, and each trip is quoted and charged separately." },
      },
    ],
    waMessage: { es: "Hola, necesito un transporte privado entre Santa Marta y Minca.", en: "Hi, I need a private transfer between Santa Marta and Minca." },
    image: "/assets/pilot/routes/santa-marta-01.webp",
    image2: "/assets/lugares/minca.jpg",
  },
  {
    slug: "cartagena-airport-to-santa-marta",
    priceMode: "base",
    title: { es: "Traslado Aeropuerto de Cartagena a Santa Marta | EverTrip", en: "Cartagena Airport to Santa Marta Transfer | EverTrip" },
    h1: { es: "Aeropuerto de Cartagena ↔ Santa Marta", en: "Cartagena Airport ↔ Santa Marta" },
    metaDescription: {
      es: "Traslado privado entre el Aeropuerto Rafael Núñez de Cartagena y Santa Marta. Equipaje, espera y paradas coordinadas. Reserva por WhatsApp.",
      en: "Private transfer between Rafael Núñez Airport in Cartagena and Santa Marta. Luggage, waiting and coordinated stops. Book via WhatsApp.",
    },
    description: {
      es: "Coordinamos tu traslado privado entre el Aeropuerto Rafael Núñez de Cartagena y Santa Marta, con recogida o llegada en el aeropuerto y conexión con hoteles, direcciones y otros puntos accesibles previamente acordados.",
      en: "We coordinate your private transfer between Rafael Núñez Airport in Cartagena and Santa Marta, with airport pickup or drop-off and connections to hotels, addresses and other accessible points arranged in advance.",
    },
    duration: { es: "Aprox. 4h - 4h 30min", en: "Approx. 4h - 4h 30min" },
    idealFor: { es: "Llegadas, salidas, familias y grupos", en: "Arrivals, departures, families and groups" },
    highlights: {
      es: [
        "Recogida o llegada coordinada en el Aeropuerto Rafael Núñez",
        "Equipaje coordinado según pasajeros y vehículo",
        "Tiempo de espera coordinable según las condiciones del servicio",
        "Paradas de aproximadamente 30 a 40 minutos, coordinadas con anticipación",
        "Servicio disponible en ambos sentidos, con cada trayecto cotizado por separado",
      ],
      en: [
        "Coordinated pickup or drop-off at Rafael Núñez Airport",
        "Luggage coordinated according to passengers and vehicle",
        "Waiting time can be coordinated according to service conditions",
        "Stops of approximately 30 to 40 minutes, arranged in advance",
        "Service available in both directions, with each trip quoted separately",
      ],
    },
    faqs: [
      {
        q: { es: "¿Cuánto dura el traslado entre el Aeropuerto de Cartagena y Santa Marta?", en: "How long is the transfer between Cartagena Airport and Santa Marta?" },
        a: { es: "El trayecto suele durar aproximadamente entre 4 y 4 horas y media, según el tráfico y el punto exacto de llegada o recogida en Santa Marta. Las paradas coordinadas aumentan el tiempo total.", en: "The trip usually takes approximately 4 to 4.5 hours, depending on traffic and the exact pickup or drop-off point in Santa Marta. Coordinated stops increase the total journey time." },
      },
      {
        q: { es: "¿Puedo viajar con equipaje?", en: "Can I travel with luggage?" },
        a: { es: "Sí. Coordinamos el equipaje según la cantidad de pasajeros y el vehículo asignado.", en: "Yes. We coordinate luggage according to the number of passengers and the vehicle assigned." },
      },
      {
        q: { es: "¿Pueden esperar si necesito tiempo adicional en el aeropuerto?", en: "Can you wait if I need extra time at the airport?" },
        a: { es: "Sí. El tiempo de espera puede coordinarse previamente o ajustarse según la situación del servicio.", en: "Yes. Waiting time can be arranged in advance or adjusted according to the service situation." },
      },
      {
        q: { es: "¿También puedo reservar Santa Marta → Aeropuerto de Cartagena?", en: "Can I also book Santa Marta → Cartagena Airport?" },
        a: { es: "Sí. El servicio está disponible en ambos sentidos y cada trayecto se cotiza y cobra por separado.", en: "Yes. The service is available in both directions, and each trip is quoted and charged separately." },
      },
    ],
    waMessage: { es: "Hola, necesito un traslado privado entre el Aeropuerto de Cartagena y Santa Marta.", en: "Hi, I need a private transfer between Cartagena Airport and Santa Marta." },
    image: "/assets/pilot/routes/cartagena-01.webp",
    image2: "/assets/pilot/routes/santa-marta-01.webp",
  },
  {
    slug: "santa-marta-to-palomino",
    priceMode: "base",
    title: {
      es: "Transporte privado de Santa Marta a Palomino | EverTrip",
      en: "Private Transfer Santa Marta to Palomino | EverTrip",
    },
    h1: { es: "Transporte privado Santa Marta ↔ Palomino", en: "Private Transfer Santa Marta ↔ Palomino" },
    metaDescription: {
      es: "Traslado privado entre Santa Marta y Palomino con recogida en hotel, dirección o aeropuerto. Equipaje y paradas coordinadas. Reserva por WhatsApp.",
      en: "Private transfer between Santa Marta and Palomino with hotel, address or airport pickup. Luggage and coordinated stops. Book via WhatsApp.",
    },
    description: {
      es: "Conectamos Santa Marta y Palomino en servicio privado, con recogida en hoteles, direcciones, aeropuerto y otros puntos accesibles previamente coordinados. Puedes viajar con equipaje y reservar el servicio en cualquiera de los dos sentidos.",
      en: "We connect Santa Marta and Palomino by private transfer, with pickup at hotels, addresses, the airport and other accessible points arranged in advance. You can travel with luggage and book the service in either direction.",
    },
    duration: { es: "Aprox. 1h 30min", en: "Approx. 1h 30min" },
    idealFor: { es: "Parejas, familias y grupos", en: "Couples, families and groups" },
    highlights: {
      es: [
        "Recogida en hoteles, direcciones o aeropuerto de Santa Marta",
        "Llegada a Palomino o a un punto accesible previamente coordinado",
        "Equipaje coordinado según pasajeros y vehículo",
        "Paradas de aproximadamente 30 a 40 minutos, coordinadas con anticipación",
        "Disponible en ambos sentidos, con cada trayecto cotizado por separado",
      ],
      en: [
        "Pickup at hotels, addresses or Santa Marta airport",
        "Drop-off in Palomino or another accessible point arranged in advance",
        "Luggage coordinated according to passengers and vehicle",
        "Stops of approximately 30 to 40 minutes, arranged in advance",
        "Available in both directions, with each trip quoted separately",
      ],
    },
    faqs: [
      {
        q: { es: "¿Cuánto dura el viaje entre Santa Marta y Palomino?", en: "How long is the trip between Santa Marta and Palomino?" },
        a: { es: "El trayecto suele durar aproximadamente 1 hora y media, dependiendo del tráfico y de los puntos exactos de recogida y llegada. Las paradas coordinadas aumentan el tiempo total.", en: "The trip usually takes approximately 1.5 hours, depending on traffic and the exact pickup and drop-off points. Coordinated stops increase the total journey time." },
      },
      {
        q: { es: "¿Puedo viajar con equipaje?", en: "Can I travel with luggage?" },
        a: { es: "Sí. Coordinamos el equipaje según la cantidad de pasajeros y el vehículo asignado para el servicio.", en: "Yes. We coordinate luggage according to the number of passengers and the vehicle assigned to the service." },
      },
      {
        q: { es: "¿Puedo hacer una parada durante el trayecto?", en: "Can I make a stop during the trip?" },
        a: { es: "Sí. Se pueden coordinar paradas de aproximadamente 30 a 40 minutos. Son flexibles y extienden la duración total del trayecto.", en: "Yes. Stops of approximately 30 to 40 minutes can be arranged. They are flexible and extend the total journey time." },
      },
      {
        q: { es: "¿Puedo reservar Palomino → Santa Marta?", en: "Can I book Palomino → Santa Marta?" },
        a: { es: "Sí. El servicio está disponible en ambos sentidos y cada trayecto se cotiza y cobra por separado.", en: "Yes. The service is available in both directions, and each trip is quoted and charged separately." },
      },
      {
        q: { es: "¿Recogen en pueblos o playas?", en: "Do you pick up in towns or at beaches?" },
        a: { es: "Sí, siempre que el punto sea accesible y se pueda operar de forma segura. No ingresamos a zonas de alto riesgo ni a lugares que no sean accesibles para el vehículo.", en: "Yes, as long as the location is accessible and can be served safely. We do not enter high-risk areas or places that are not accessible by vehicle." },
      },
    ],
    waMessage: { es: "Hola, necesito un transporte privado entre Santa Marta y Palomino.", en: "Hi, I need a private transfer between Santa Marta and Palomino." },
    image: "/assets/pilot/routes/santa-marta-01.webp",
    image2: "/assets/pilot/routes/palomino-01.webp",
  },
  {
    slug: "santa-marta-to-tayrona",
    priceMode: "base",
    title: { es: "Transporte privado Santa Marta - Parque Tayrona | EverTrip", en: "Private Transfer Santa Marta - Tayrona National Park | EverTrip" },
    h1: { es: "Santa Marta ↔ Parque Tayrona", en: "Santa Marta ↔ Tayrona National Park" },
    metaDescription: {
      es: "Traslado privado entre Santa Marta y Parque Tayrona con recogida en hotel, dirección o aeropuerto. Regreso y paradas coordinadas por WhatsApp.",
      en: "Private transfer between Santa Marta and Tayrona National Park with hotel, address or airport pickup. Return service and stops arranged via WhatsApp.",
    },
    description: {
      es: "Coordinamos tu traslado privado entre Santa Marta y el acceso acordado al Parque Tayrona, con recogida en hotel, dirección o aeropuerto. El regreso también puede reservarse y se cobra como un trayecto independiente.",
      en: "We coordinate your private transfer between Santa Marta and the agreed access point for Tayrona National Park, with pickup at a hotel, address or airport. Return service can also be booked and is charged as a separate trip.",
    },
    duration: { es: "Aprox. 45min - 1h", en: "Approx. 45min - 1h" },
    idealFor: { es: "Viajeros, familias y grupos", en: "Travelers, families and groups" },
    highlights: {
      es: [
        "Recogida en hoteles, direcciones o aeropuerto de Santa Marta",
        "Llegada al punto de acceso al parque previamente coordinado",
        "Equipaje coordinado según pasajeros y vehículo",
        "Paradas de aproximadamente 30 a 40 minutos, coordinadas con anticipación",
        "Regreso disponible y cotizado como un trayecto independiente",
      ],
      en: [
        "Pickup at hotels, addresses or Santa Marta airport",
        "Drop-off at the park access point arranged in advance",
        "Luggage coordinated according to passengers and vehicle",
        "Stops of approximately 30 to 40 minutes, arranged in advance",
        "Return service available and quoted as a separate trip",
      ],
    },
    faqs: [
      {
        q: { es: "¿Cuánto dura el viaje desde Santa Marta hasta Tayrona?", en: "How long is the trip from Santa Marta to Tayrona?" },
        a: { es: "Normalmente entre 45 minutos y 1 hora, según el tráfico y el punto exacto de recogida o acceso acordado. Las paradas coordinadas aumentan el tiempo total.", en: "Usually between 45 minutes and 1 hour, depending on traffic and the exact pickup or agreed access point. Coordinated stops increase the total journey time." },
      },
      {
        q: { es: "¿Hasta dónde llega el vehículo?", en: "How far does the vehicle go?" },
        a: { es: "El punto de llegada se coordina previamente según el acceso disponible para vehículos. No ingresamos a zonas de alto riesgo ni a lugares que no sean accesibles para el vehículo.", en: "The drop-off point is arranged in advance according to available vehicle access. We do not enter high-risk areas or locations that are not accessible by vehicle." },
      },
      {
        q: { es: "¿Puedo hacer una parada durante el trayecto?", en: "Can I make a stop during the trip?" },
        a: { es: "Sí. Podemos coordinar paradas de aproximadamente 30 a 40 minutos. Son flexibles y extienden la duración total del viaje.", en: "Yes. We can coordinate stops of approximately 30 to 40 minutes. They are flexible and extend the total journey time." },
      },
      {
        q: { es: "¿Puedo reservar también el regreso a Santa Marta?", en: "Can I also book the return to Santa Marta?" },
        a: { es: "Sí. El servicio puede reservarse en ambos sentidos y cada trayecto se cotiza y cobra por separado.", en: "Yes. The service can be booked in both directions, and each trip is quoted and charged separately." },
      },
    ],
    waMessage: { es: "Hola, necesito un transporte privado entre Santa Marta y Parque Tayrona.", en: "Hi, I need a private transfer between Santa Marta and Tayrona National Park." },
    image: "/assets/pilot/routes/santa-marta-01.webp",
    image2: "/assets/pilot/routes/tayrona-01.webp",
  },
  {
    slug: "cartagena-to-barranquilla",
    priceMode: "quote",
    title: { es: "Transporte privado Cartagena - Barranquilla | EverTrip", en: "Private Transfer Cartagena - Barranquilla | EverTrip" },
    h1: { es: "Cartagena ↔ Barranquilla", en: "Cartagena ↔ Barranquilla" },
    metaDescription: {
      es: "Traslado privado entre Cartagena y Barranquilla con recogida en hotel, dirección o aeropuerto. Equipaje y paradas coordinadas por WhatsApp.",
      en: "Private transfer between Cartagena and Barranquilla with hotel, address or airport pickup. Luggage and coordinated stops via WhatsApp.",
    },
    description: {
      es: "Conectamos Cartagena y Barranquilla en servicio privado, con recogida en hoteles, direcciones, aeropuertos y otros puntos accesibles previamente coordinados. El trayecto puede reservarse en cualquiera de los dos sentidos.",
      en: "We connect Cartagena and Barranquilla by private transfer, with pickup at hotels, addresses, airports and other accessible points arranged in advance. The trip can be booked in either direction.",
    },
    duration: { es: "Aprox. 2h - 2h 30min", en: "Approx. 2h - 2h 30min" },
    idealFor: { es: "Negocios, eventos, familias y grupos", en: "Business, events, families and groups" },
    highlights: {
      es: [
        "Recogida en hoteles, direcciones o aeropuertos de Cartagena o Barranquilla",
        "Equipaje coordinado según pasajeros y vehículo",
        "Paradas de aproximadamente 30 a 40 minutos, coordinadas con anticipación",
        "Servicio privado sin terminales ni transbordos",
        "Disponible en ambos sentidos, con cada trayecto cotizado por separado",
      ],
      en: [
        "Pickup at hotels, addresses or airports in Cartagena or Barranquilla",
        "Luggage coordinated according to passengers and vehicle",
        "Stops of approximately 30 to 40 minutes, arranged in advance",
        "Private service without terminals or transfers",
        "Available in both directions, with each trip quoted separately",
      ],
    },
    faqs: [
      {
        q: { es: "¿Cuánto dura el viaje entre Cartagena y Barranquilla?", en: "How long does the trip between Cartagena and Barranquilla take?" },
        a: { es: "Normalmente entre 2 y 2 horas y media, según el tráfico y los puntos exactos de recogida y llegada. Las paradas coordinadas aumentan el tiempo total.", en: "Usually between 2 and 2.5 hours, depending on traffic and the exact pickup and drop-off points. Coordinated stops increase the total journey time." },
      },
      {
        q: { es: "¿Pueden recogerme en el aeropuerto?", en: "Can you pick me up at the airport?" },
        a: { es: "Sí. Podemos coordinar recogida o llegada en aeropuerto, además de hoteles y direcciones.", en: "Yes. We can coordinate airport pickup or drop-off, as well as hotels and addresses." },
      },
      {
        q: { es: "¿Puedo hacer una parada durante el trayecto?", en: "Can I make a stop during the trip?" },
        a: { es: "Sí. Podemos coordinar paradas de aproximadamente 30 a 40 minutos. Son flexibles y extienden la duración total del viaje.", en: "Yes. We can coordinate stops of approximately 30 to 40 minutes. They are flexible and extend the total journey time." },
      },
      {
        q: { es: "¿Puedo reservar Barranquilla → Cartagena?", en: "Can I book Barranquilla → Cartagena?" },
        a: { es: "Sí. El servicio está disponible en ambos sentidos y cada trayecto se cotiza y cobra por separado.", en: "Yes. The service is available in both directions, and each trip is quoted and charged separately." },
      },
    ],
    waMessage: { es: "Hola, necesito un transporte privado entre Cartagena y Barranquilla.", en: "Hi, I need a private transfer between Cartagena and Barranquilla." },
    image: "/assets/pilot/routes/cartagena-01.webp",
    image2: "/assets/pilot/routes/barranquilla-01.webp",
  },
  {
    slug: "custom-private-routes",
    priceMode: "quote",
    title: { es: "Rutas personalizadas por la costa Caribe | EverTrip", en: "Custom Private Routes on the Caribbean Coast | EverTrip" },
    h1: { es: "Rutas personalizadas", en: "Custom Routes" },
    metaDescription: {
      es: "¿Tu ruta no está en la lista? Diseñamos traslados privados a la medida en toda la costa Caribe colombiana, desde Barranquilla hasta Valledupar.",
      en: "Don't see your route listed? We design custom private transfers across the entire Colombian Caribbean coast, from Barranquilla to Valledupar.",
    },
    description: {
      es: "Cubrimos toda la costa Caribe colombiana: Barranquilla, Santa Marta, Cartagena, Palomino, Tayrona, Minca, Riohacha, Cabo de la Vela, Valledupar, Mompox y más. Si tu itinerario combina varios destinos, lo armamos contigo.",
      en: "We cover the entire Colombian Caribbean coast: Barranquilla, Santa Marta, Cartagena, Palomino, Tayrona, Minca, Riohacha, Cabo de la Vela, Valledupar, Mompox and more. If your itinerary combines several destinations, we'll build it with you.",
    },
    duration: { es: "Flexible", en: "Flexible" },
    idealFor: { es: "Itinerarios a la medida", en: "Tailored itineraries" },
    highlights: {
      es: [
        "Rutas combinadas y multi-destino",
        "Disponible para grupos grandes y eventos",
        "Vehículo según el número de pasajeros",
        "Cotización personalizada por WhatsApp",
      ],
      en: [
        "Combined, multi-destination routes",
        "Available for large groups and events",
        "Vehicle sized to your passenger count",
        "Personalized quote via WhatsApp",
      ],
    },
    faqs: [
      {
        q: { es: "¿Pueden armar un itinerario de varios días?", en: "Can you build a multi-day itinerary?" },
        a: { es: "Sí, cuéntanos los destinos que quieres visitar y armamos el plan de transporte completo.", en: "Yes, tell us the destinations you want to visit and we'll build the full transport plan." },
      },
    ],
    waMessage: { es: "Hola, quiero cotizar una ruta personalizada.", en: "Hi, I'd like a quote for a custom route." },
    image: "/assets/pilot/routes/private-route-01.webp",
  },
  {
    slug: "santa-marta-airport-transfer",
    priceMode: "quote",
    title: { es: "Traslado Aeropuerto de Santa Marta | EverTrip", en: "Santa Marta Airport Transfer | EverTrip" },
    h1: { es: "Aeropuerto de Santa Marta ↔ Ciudad", en: "Santa Marta Airport ↔ City" },
    metaDescription: {
      es: "Traslado privado desde o hacia el Aeropuerto Simón Bolívar de Santa Marta. Recogida en hotel o dirección, equipaje y espera coordinada por WhatsApp.",
      en: "Private transfer to or from Santa Marta Simón Bolívar Airport. Hotel or address pickup, luggage and coordinated waiting via WhatsApp.",
    },
    description: {
      es: "Coordinamos traslados privados entre el Aeropuerto Simón Bolívar y hoteles, direcciones y otros puntos accesibles de Santa Marta. El servicio puede reservarse tanto para una llegada como para el regreso al aeropuerto.",
      en: "We coordinate private transfers between Simón Bolívar Airport and hotels, addresses and other accessible points in Santa Marta. The service can be booked for both arrivals and return trips to the airport.",
    },
    duration: { es: "Aprox. 20-40 min según el destino", en: "Approx. 20-40 min depending on destination" },
    idealFor: { es: "Llegadas, salidas, familias y grupos", en: "Arrivals, departures, families and groups" },
    highlights: {
      es: [
        "Recogida o llegada coordinada en el Aeropuerto Simón Bolívar",
        "Traslado a hoteles, direcciones y puntos accesibles de Santa Marta",
        "Equipaje coordinado según pasajeros y vehículo",
        "Tiempo de espera coordinable según las condiciones del servicio",
        "Disponible en ambos sentidos, con cada trayecto cotizado por separado",
      ],
      en: [
        "Coordinated pickup or drop-off at Simón Bolívar Airport",
        "Transfer to hotels, addresses and accessible points in Santa Marta",
        "Luggage coordinated according to passengers and vehicle",
        "Waiting time can be coordinated according to service conditions",
        "Available in both directions, with each trip quoted separately",
      ],
    },
    faqs: [
      {
        q: { es: "¿Cuánto dura el traslado desde el aeropuerto?", en: "How long does the airport transfer take?" },
        a: { es: "Normalmente entre 20 y 40 minutos, dependiendo de la zona exacta de destino o recogida y del tráfico.", en: "Usually between 20 and 40 minutes, depending on the exact pickup or drop-off zone and traffic." },
      },
      {
        q: { es: "¿Pueden recogerme en un hotel o dirección para llevarme al aeropuerto?", en: "Can you pick me up at a hotel or address and take me to the airport?" },
        a: { es: "Sí. El servicio funciona en ambos sentidos y coordinamos el punto de recogida previamente.", en: "Yes. The service works in both directions and we coordinate the pickup point in advance." },
      },
      {
        q: { es: "¿Puedo viajar con equipaje?", en: "Can I travel with luggage?" },
        a: { es: "Sí. El equipaje se coordina según la cantidad de pasajeros y el vehículo asignado.", en: "Yes. Luggage is coordinated according to the number of passengers and the vehicle assigned." },
      },
      {
        q: { es: "¿Atienden cualquier zona?", en: "Do you serve every area?" },
        a: { es: "Atendemos puntos accesibles donde el servicio pueda realizarse de forma segura. No ingresamos a zonas de alto riesgo ni a lugares que no sean accesibles para el vehículo.", en: "We serve accessible locations where the service can be operated safely. We do not enter high-risk areas or places that are not accessible by vehicle." },
      },
    ],
    waMessage: { es: "Hola, necesito un traslado privado desde o hacia el Aeropuerto de Santa Marta.", en: "Hi, I need a private transfer to or from Santa Marta Airport." },
    image: "/assets/pilot/routes/airport-transfer-01.webp",
  },
  {
    slug: "cartagena-to-palomino",
    featured: false,
    priceMode: "quote",
    title: { es: "Transporte privado de Cartagena a Palomino | EverTrip", en: "Private Transfer Cartagena to Palomino | EverTrip" },
    h1: { es: "Transporte privado Cartagena ↔ Palomino", en: "Private Transfer Cartagena ↔ Palomino" },
    metaDescription: {
      es: "Traslado privado entre Cartagena y Palomino con recogida en hotel, dirección o aeropuerto. Equipaje y paradas coordinadas. Reserva por WhatsApp.",
      en: "Private transfer between Cartagena and Palomino with hotel, address or airport pickup. Luggage and coordinated stops. Book via WhatsApp.",
    },
    description: {
      es: "Conectamos Cartagena y Palomino en servicio privado, con recogida en hoteles, direcciones, aeropuerto y otros puntos accesibles previamente coordinados. Puedes viajar con equipaje y reservar el trayecto en cualquiera de los dos sentidos.",
      en: "We connect Cartagena and Palomino by private transfer, with pickup at hotels, addresses, the airport and other accessible points arranged in advance. You can travel with luggage and book the trip in either direction.",
    },
    duration: { es: "Aprox. 5h 30m", en: "Approx. 5h 30m" },
    idealFor: { es: "Parejas, familias y grupos", en: "Couples, families and groups" },
    highlights: {
      es: [
        "Recogida en hoteles, direcciones o aeropuerto de Cartagena",
        "Llegada a Palomino o a un punto accesible previamente coordinado",
        "Equipaje coordinado según pasajeros y vehículo",
        "Paradas de aproximadamente 30 a 40 minutos, coordinadas con anticipación",
        "Disponible en ambos sentidos, con cada trayecto cotizado por separado",
      ],
      en: [
        "Pickup at hotels, addresses or Cartagena airport",
        "Drop-off in Palomino or another accessible point arranged in advance",
        "Luggage coordinated according to passengers and vehicle",
        "Stops of approximately 30 to 40 minutes, arranged in advance",
        "Available in both directions, with each trip quoted separately",
      ],
    },
    faqs: [
      {
        q: { es: "¿Cuánto dura el viaje entre Cartagena y Palomino?", en: "How long is the trip between Cartagena and Palomino?" },
        a: { es: "El trayecto suele durar aproximadamente 5 horas y media, dependiendo del tráfico y de los puntos exactos de recogida y llegada. Las paradas coordinadas aumentan el tiempo total.", en: "The trip usually takes approximately 5.5 hours, depending on traffic and the exact pickup and drop-off points. Coordinated stops increase the total journey time." },
      },
      {
        q: { es: "¿Puedo viajar con equipaje?", en: "Can I travel with luggage?" },
        a: { es: "Sí. Coordinamos el equipaje según la cantidad de pasajeros y el vehículo asignado.", en: "Yes. We coordinate luggage according to the number of passengers and the vehicle assigned." },
      },
      {
        q: { es: "¿Puedo hacer una parada durante el trayecto?", en: "Can I make a stop during the trip?" },
        a: { es: "Sí. Podemos coordinar paradas de aproximadamente 30 a 40 minutos. Son flexibles y extienden la duración total del viaje.", en: "Yes. We can coordinate stops of approximately 30 to 40 minutes. They are flexible and extend the total journey time." },
      },
      {
        q: { es: "¿Puedo reservar Palomino → Cartagena?", en: "Can I book Palomino → Cartagena?" },
        a: { es: "Sí. El servicio está disponible en ambos sentidos y cada trayecto se cotiza y cobra por separado.", en: "Yes. The service is available in both directions, and each trip is quoted and charged separately." },
      },
    ],
    waMessage: { es: "Hola, necesito un transporte privado entre Cartagena y Palomino.", en: "Hi, I need a private transfer between Cartagena and Palomino." },
    image: "/assets/pilot/routes/cartagena-01.webp",
    image2: "/assets/pilot/routes/palomino-01.webp",
  },
  {
    slug: "cartagena-to-valledupar",
    featured: false,
    priceMode: "quote",
    title: {
      es: "Transporte privado de Cartagena a Valledupar | EverTrip",
      en: "Private Transfer Cartagena to Valledupar | EverTrip",
    },
    h1: {
      es: "Transporte privado Cartagena ↔ Valledupar",
      en: "Private Transfer Cartagena ↔ Valledupar",
    },
    metaDescription: {
      es: "Viaje privado puerta a puerta entre Cartagena y Valledupar. Reserva tu traslado con EverTrip. Conductores expertos y vehiculos premium.",
      en: "Door-to-door private transfer between Cartagena and Valledupar. Book your ride with EverTrip. Expert drivers and premium vehicles.",
    },
    description: {
      es: "Disfruta de un viaje comodo, seguro y sin complicaciones entre Cartagena y Valledupar. Nuestros servicios son 100% privados, asegurando tu tranquilidad.",
      en: "Enjoy a comfortable, safe, and hassle-free journey between Cartagena and Valledupar. Our services are 100% private, ensuring your peace of mind.",
    },
    duration: { es: "Aprox. 6h", en: "Approx. 6h" },
    idealFor: { es: "Parejas, Familias y Grupos", en: "Couples, Families, and Groups" },
    highlights: {
      es: [
        "Misma tarifa en ambos sentidos",
        "Servicio puerta a puerta",
        "Vehiculo privado con aire acondicionado",
        "Conductor puntual y profesional",
        "Sin cargos ocultos",
        "Asistencia y soporte via WhatsApp"
      ],
      en: [
        "Same rate in both directions",
        "Door-to-door service",
        "Private vehicle with AC",
        "Punctual and professional driver",
        "No hidden fees",
        "WhatsApp support and assistance"
      ]
    },
    faqs: [
      {
        q: { es: "¿El servicio es compartido?", en: "Is the service shared?" },
        a: { es: "No, todos nuestros traslados son 100% privados para ti y tu grupo.", en: "No, all our transfers are 100% private for you and your group." }
      },
      {
        q: { es: "¿Puedo hacer paradas en el camino?", en: "Can I make stops along the way?" },
        a: { es: "Sí, podemos programar paradas breves para ir al baño o comprar snacks. Por favor indícalo al momento de reservar.", en: "Yes, we can schedule brief stops for restrooms or snacks. Please let us know when booking." }
      }
    ],
    waMessage: {
      es: "Hola, me gustaria cotizar un traslado privado desde Cartagena hacia Valledupar.",
      en: "Hello, I would like to get a quote for a private transfer from Cartagena to Valledupar."
    },
    image: "/assets/pilot/routes/cartagena-01.webp",
    image2: "/assets/pilot/routes/valledupar-01.webp"
  },
  {
    slug: "cartagena-to-minca",
    featured: false,
    priceMode: "quote",
    title: {
      es: "Transporte privado de Cartagena a Minca | EverTrip",
      en: "Private Transfer Cartagena to Minca | EverTrip",
    },
    h1: {
      es: "Transporte privado Cartagena ↔ Minca",
      en: "Private Transfer Cartagena ↔ Minca",
    },
    metaDescription: {
      es: "Viaje privado puerta a puerta entre Cartagena y Minca. Reserva tu traslado con EverTrip. Conductores expertos y vehiculos premium.",
      en: "Door-to-door private transfer between Cartagena and Minca. Book your ride with EverTrip. Expert drivers and premium vehicles.",
    },
    description: {
      es: "Disfruta de un viaje comodo, seguro y sin complicaciones entre Cartagena y Minca. Nuestros servicios son 100% privados, asegurando tu tranquilidad.",
      en: "Enjoy a comfortable, safe, and hassle-free journey between Cartagena and Minca. Our services are 100% private, ensuring your peace of mind.",
    },
    duration: { es: "Aprox. 4h 30m", en: "Approx. 4h 30m" },
    idealFor: { es: "Parejas, Familias y Grupos", en: "Couples, Families, and Groups" },
    highlights: {
      es: [
        "Misma tarifa en ambos sentidos",
        "Servicio puerta a puerta",
        "Vehiculo privado con aire acondicionado",
        "Conductor puntual y profesional",
        "Sin cargos ocultos",
        "Asistencia y soporte via WhatsApp"
      ],
      en: [
        "Same rate in both directions",
        "Door-to-door service",
        "Private vehicle with AC",
        "Punctual and professional driver",
        "No hidden fees",
        "WhatsApp support and assistance"
      ]
    },
    faqs: [
      {
        q: { es: "¿El servicio es compartido?", en: "Is the service shared?" },
        a: { es: "No, todos nuestros traslados son 100% privados para ti y tu grupo.", en: "No, all our transfers are 100% private for you and your group." }
      },
      {
        q: { es: "¿Puedo hacer paradas en el camino?", en: "Can I make stops along the way?" },
        a: { es: "Sí, podemos programar paradas breves para ir al baño o comprar snacks. Por favor indícalo al momento de reservar.", en: "Yes, we can schedule brief stops for restrooms or snacks. Please let us know when booking." }
      }
    ],
    waMessage: {
      es: "Hola, me gustaria cotizar un traslado privado desde Cartagena hacia Minca.",
      en: "Hello, I would like to get a quote for a private transfer from Cartagena to Minca."
    },
    image: "/assets/pilot/routes/cartagena-01.webp",
    image2: "/assets/lugares/minca.jpg"
  },
  {
    slug: "cartagena-to-tayrona",
    featured: false,
    priceMode: "quote",
    title: {
      es: "Transporte privado de Cartagena a Tayrona | EverTrip",
      en: "Private Transfer Cartagena to Tayrona | EverTrip",
    },
    h1: {
      es: "Transporte privado Cartagena ↔ Tayrona",
      en: "Private Transfer Cartagena ↔ Tayrona",
    },
    metaDescription: {
      es: "Viaje privado puerta a puerta entre Cartagena y Tayrona. Reserva tu traslado con EverTrip. Conductores expertos y vehiculos premium.",
      en: "Door-to-door private transfer between Cartagena and Tayrona. Book your ride with EverTrip. Expert drivers and premium vehicles.",
    },
    description: {
      es: "Disfruta de un viaje comodo, seguro y sin complicaciones entre Cartagena y Tayrona. Nuestros servicios son 100% privados, asegurando tu tranquilidad.",
      en: "Enjoy a comfortable, safe, and hassle-free journey between Cartagena and Tayrona. Our services are 100% private, ensuring your peace of mind.",
    },
    duration: { es: "Aprox. 5h", en: "Approx. 5h" },
    idealFor: { es: "Parejas, Familias y Grupos", en: "Couples, Families, and Groups" },
    highlights: {
      es: [
        "Misma tarifa en ambos sentidos",
        "Servicio puerta a puerta",
        "Vehiculo privado con aire acondicionado",
        "Conductor puntual y profesional",
        "Sin cargos ocultos",
        "Asistencia y soporte via WhatsApp"
      ],
      en: [
        "Same rate in both directions",
        "Door-to-door service",
        "Private vehicle with AC",
        "Punctual and professional driver",
        "No hidden fees",
        "WhatsApp support and assistance"
      ]
    },
    faqs: [
      {
        q: { es: "¿El servicio es compartido?", en: "Is the service shared?" },
        a: { es: "No, todos nuestros traslados son 100% privados para ti y tu grupo.", en: "No, all our transfers are 100% private for you and your group." }
      },
      {
        q: { es: "¿Puedo hacer paradas en el camino?", en: "Can I make stops along the way?" },
        a: { es: "Sí, podemos programar paradas breves para ir al baño o comprar snacks. Por favor indícalo al momento de reservar.", en: "Yes, we can schedule brief stops for restrooms or snacks. Please let us know when booking." }
      }
    ],
    waMessage: {
      es: "Hola, me gustaria cotizar un traslado privado desde Cartagena hacia Tayrona.",
      en: "Hello, I would like to get a quote for a private transfer from Cartagena to Tayrona."
    },
    image: "/assets/pilot/routes/cartagena-01.webp",
    image2: "/assets/pilot/routes/tayrona-01.webp"
  },
  {
    slug: "barranquilla-to-minca",
    featured: false,
    priceMode: "quote",
    title: {
      es: "Transporte privado de Barranquilla a Minca | EverTrip",
      en: "Private Transfer Barranquilla to Minca | EverTrip",
    },
    h1: {
      es: "Transporte privado Barranquilla ↔ Minca",
      en: "Private Transfer Barranquilla ↔ Minca",
    },
    metaDescription: {
      es: "Viaje privado puerta a puerta entre Barranquilla y Minca. Reserva tu traslado con EverTrip. Conductores expertos y vehiculos premium.",
      en: "Door-to-door private transfer between Barranquilla and Minca. Book your ride with EverTrip. Expert drivers and premium vehicles.",
    },
    description: {
      es: "Disfruta de un viaje comodo, seguro y sin complicaciones entre Barranquilla y Minca. Nuestros servicios son 100% privados, asegurando tu tranquilidad.",
      en: "Enjoy a comfortable, safe, and hassle-free journey between Barranquilla and Minca. Our services are 100% private, ensuring your peace of mind.",
    },
    duration: { es: "Aprox. 2h 30m", en: "Approx. 2h 30m" },
    idealFor: { es: "Parejas, Familias y Grupos", en: "Couples, Families, and Groups" },
    highlights: {
      es: [
        "Misma tarifa en ambos sentidos",
        "Servicio puerta a puerta",
        "Vehiculo privado con aire acondicionado",
        "Conductor puntual y profesional",
        "Sin cargos ocultos",
        "Asistencia y soporte via WhatsApp"
      ],
      en: [
        "Same rate in both directions",
        "Door-to-door service",
        "Private vehicle with AC",
        "Punctual and professional driver",
        "No hidden fees",
        "WhatsApp support and assistance"
      ]
    },
    faqs: [
      {
        q: { es: "¿El servicio es compartido?", en: "Is the service shared?" },
        a: { es: "No, todos nuestros traslados son 100% privados para ti y tu grupo.", en: "No, all our transfers are 100% private for you and your group." }
      },
      {
        q: { es: "¿Puedo hacer paradas en el camino?", en: "Can I make stops along the way?" },
        a: { es: "Sí, podemos programar paradas breves para ir al baño o comprar snacks. Por favor indícalo al momento de reservar.", en: "Yes, we can schedule brief stops for restrooms or snacks. Please let us know when booking." }
      }
    ],
    waMessage: {
      es: "Hola, me gustaria cotizar un traslado privado desde Barranquilla hacia Minca.",
      en: "Hello, I would like to get a quote for a private transfer from Barranquilla to Minca."
    },
    image: "/assets/pilot/routes/barranquilla-01.webp",
    image2: "/assets/lugares/minca.jpg"
  },
  {
    slug: "barranquilla-to-tayrona",
    featured: false,
    priceMode: "quote",
    title: {
      es: "Transporte privado de Barranquilla a Tayrona | EverTrip",
      en: "Private Transfer Barranquilla to Tayrona | EverTrip",
    },
    h1: {
      es: "Transporte privado Barranquilla ↔ Tayrona",
      en: "Private Transfer Barranquilla ↔ Tayrona",
    },
    metaDescription: {
      es: "Viaje privado puerta a puerta entre Barranquilla y Tayrona. Reserva tu traslado con EverTrip. Conductores expertos y vehiculos premium.",
      en: "Door-to-door private transfer between Barranquilla and Tayrona. Book your ride with EverTrip. Expert drivers and premium vehicles.",
    },
    description: {
      es: "Disfruta de un viaje comodo, seguro y sin complicaciones entre Barranquilla y Tayrona. Nuestros servicios son 100% privados, asegurando tu tranquilidad.",
      en: "Enjoy a comfortable, safe, and hassle-free journey between Barranquilla and Tayrona. Our services are 100% private, ensuring your peace of mind.",
    },
    duration: { es: "Aprox. 3h", en: "Approx. 3h" },
    idealFor: { es: "Parejas, Familias y Grupos", en: "Couples, Families, and Groups" },
    highlights: {
      es: [
        "Misma tarifa en ambos sentidos",
        "Servicio puerta a puerta",
        "Vehiculo privado con aire acondicionado",
        "Conductor puntual y profesional",
        "Sin cargos ocultos",
        "Asistencia y soporte via WhatsApp"
      ],
      en: [
        "Same rate in both directions",
        "Door-to-door service",
        "Private vehicle with AC",
        "Punctual and professional driver",
        "No hidden fees",
        "WhatsApp support and assistance"
      ]
    },
    faqs: [
      {
        q: { es: "¿El servicio es compartido?", en: "Is the service shared?" },
        a: { es: "No, todos nuestros traslados son 100% privados para ti y tu grupo.", en: "No, all our transfers are 100% private for you and your group." }
      },
      {
        q: { es: "¿Puedo hacer paradas en el camino?", en: "Can I make stops along the way?" },
        a: { es: "Sí, podemos programar paradas breves para ir al baño o comprar snacks. Por favor indícalo al momento de reservar.", en: "Yes, we can schedule brief stops for restrooms or snacks. Please let us know when booking." }
      }
    ],
    waMessage: {
      es: "Hola, me gustaria cotizar un traslado privado desde Barranquilla hacia Tayrona.",
      en: "Hello, I would like to get a quote for a private transfer from Barranquilla to Tayrona."
    },
    image: "/assets/pilot/routes/barranquilla-01.webp",
    image2: "/assets/pilot/routes/tayrona-01.webp"
  },
  {
    slug: "palomino-to-valledupar",
    featured: false,
    priceMode: "quote",
    title: {
      es: "Transporte privado de Palomino a Valledupar | EverTrip",
      en: "Private Transfer Palomino to Valledupar | EverTrip",
    },
    h1: {
      es: "Transporte privado Palomino ↔ Valledupar",
      en: "Private Transfer Palomino ↔ Valledupar",
    },
    metaDescription: {
      es: "Viaje privado puerta a puerta entre Palomino y Valledupar. Reserva tu traslado con EverTrip. Conductores expertos y vehiculos premium.",
      en: "Door-to-door private transfer between Palomino and Valledupar. Book your ride with EverTrip. Expert drivers and premium vehicles.",
    },
    description: {
      es: "Disfruta de un viaje comodo, seguro y sin complicaciones entre Palomino y Valledupar. Nuestros servicios son 100% privados, asegurando tu tranquilidad.",
      en: "Enjoy a comfortable, safe, and hassle-free journey between Palomino and Valledupar. Our services are 100% private, ensuring your peace of mind.",
    },
    duration: { es: "Aprox. 4h", en: "Approx. 4h" },
    idealFor: { es: "Parejas, Familias y Grupos", en: "Couples, Families, and Groups" },
    highlights: {
      es: [
        "Misma tarifa en ambos sentidos",
        "Servicio puerta a puerta",
        "Vehiculo privado con aire acondicionado",
        "Conductor puntual y profesional",
        "Sin cargos ocultos",
        "Asistencia y soporte via WhatsApp"
      ],
      en: [
        "Same rate in both directions",
        "Door-to-door service",
        "Private vehicle with AC",
        "Punctual and professional driver",
        "No hidden fees",
        "WhatsApp support and assistance"
      ]
    },
    faqs: [
      {
        q: { es: "¿El servicio es compartido?", en: "Is the service shared?" },
        a: { es: "No, todos nuestros traslados son 100% privados para ti y tu grupo.", en: "No, all our transfers are 100% private for you and your group." }
      },
      {
        q: { es: "¿Puedo hacer paradas en el camino?", en: "Can I make stops along the way?" },
        a: { es: "Sí, podemos programar paradas breves para ir al baño o comprar snacks. Por favor indícalo al momento de reservar.", en: "Yes, we can schedule brief stops for restrooms or snacks. Please let us know when booking." }
      }
    ],
    waMessage: {
      es: "Hola, me gustaria cotizar un traslado privado desde Palomino hacia Valledupar.",
      en: "Hello, I would like to get a quote for a private transfer from Palomino to Valledupar."
    },
    image: "/assets/pilot/routes/palomino-01.webp",
    image2: "/assets/pilot/routes/valledupar-01.webp"
  },
  {
    slug: "palomino-to-minca",
    featured: false,
    priceMode: "quote",
    title: {
      es: "Transporte privado de Palomino a Minca | EverTrip",
      en: "Private Transfer Palomino to Minca | EverTrip",
    },
    h1: {
      es: "Transporte privado Palomino ↔ Minca",
      en: "Private Transfer Palomino ↔ Minca",
    },
    metaDescription: {
      es: "Viaje privado puerta a puerta entre Palomino y Minca. Reserva tu traslado con EverTrip. Conductores expertos y vehiculos premium.",
      en: "Door-to-door private transfer between Palomino and Minca. Book your ride with EverTrip. Expert drivers and premium vehicles.",
    },
    description: {
      es: "Disfruta de un viaje comodo, seguro y sin complicaciones entre Palomino y Minca. Nuestros servicios son 100% privados, asegurando tu tranquilidad.",
      en: "Enjoy a comfortable, safe, and hassle-free journey between Palomino and Minca. Our services are 100% private, ensuring your peace of mind.",
    },
    duration: { es: "Aprox. 2h", en: "Approx. 2h" },
    idealFor: { es: "Parejas, Familias y Grupos", en: "Couples, Families, and Groups" },
    highlights: {
      es: [
        "Misma tarifa en ambos sentidos",
        "Servicio puerta a puerta",
        "Vehiculo privado con aire acondicionado",
        "Conductor puntual y profesional",
        "Sin cargos ocultos",
        "Asistencia y soporte via WhatsApp"
      ],
      en: [
        "Same rate in both directions",
        "Door-to-door service",
        "Private vehicle with AC",
        "Punctual and professional driver",
        "No hidden fees",
        "WhatsApp support and assistance"
      ]
    },
    faqs: [
      {
        q: { es: "¿El servicio es compartido?", en: "Is the service shared?" },
        a: { es: "No, todos nuestros traslados son 100% privados para ti y tu grupo.", en: "No, all our transfers are 100% private for you and your group." }
      },
      {
        q: { es: "¿Puedo hacer paradas en el camino?", en: "Can I make stops along the way?" },
        a: { es: "Sí, podemos programar paradas breves para ir al baño o comprar snacks. Por favor indícalo al momento de reservar.", en: "Yes, we can schedule brief stops for restrooms or snacks. Please let us know when booking." }
      }
    ],
    waMessage: {
      es: "Hola, me gustaria cotizar un traslado privado desde Palomino hacia Minca.",
      en: "Hello, I would like to get a quote for a private transfer from Palomino to Minca."
    },
    image: "/assets/pilot/routes/palomino-01.webp",
    image2: "/assets/lugares/minca.jpg"
  },
  {
    slug: "palomino-to-tayrona",
    featured: false,
    priceMode: "quote",
    title: {
      es: "Transporte privado de Palomino a Tayrona | EverTrip",
      en: "Private Transfer Palomino to Tayrona | EverTrip",
    },
    h1: {
      es: "Transporte privado Palomino ↔ Tayrona",
      en: "Private Transfer Palomino ↔ Tayrona",
    },
    metaDescription: {
      es: "Viaje privado puerta a puerta entre Palomino y Tayrona. Reserva tu traslado con EverTrip. Conductores expertos y vehiculos premium.",
      en: "Door-to-door private transfer between Palomino and Tayrona. Book your ride with EverTrip. Expert drivers and premium vehicles.",
    },
    description: {
      es: "Disfruta de un viaje comodo, seguro y sin complicaciones entre Palomino y Tayrona. Nuestros servicios son 100% privados, asegurando tu tranquilidad.",
      en: "Enjoy a comfortable, safe, and hassle-free journey between Palomino and Tayrona. Our services are 100% private, ensuring your peace of mind.",
    },
    duration: { es: "Aprox. 1h", en: "Approx. 1h" },
    idealFor: { es: "Parejas, Familias y Grupos", en: "Couples, Families, and Groups" },
    highlights: {
      es: [
        "Misma tarifa en ambos sentidos",
        "Servicio puerta a puerta",
        "Vehiculo privado con aire acondicionado",
        "Conductor puntual y profesional",
        "Sin cargos ocultos",
        "Asistencia y soporte via WhatsApp"
      ],
      en: [
        "Same rate in both directions",
        "Door-to-door service",
        "Private vehicle with AC",
        "Punctual and professional driver",
        "No hidden fees",
        "WhatsApp support and assistance"
      ]
    },
    faqs: [
      {
        q: { es: "¿El servicio es compartido?", en: "Is the service shared?" },
        a: { es: "No, todos nuestros traslados son 100% privados para ti y tu grupo.", en: "No, all our transfers are 100% private for you and your group." }
      },
      {
        q: { es: "¿Puedo hacer paradas en el camino?", en: "Can I make stops along the way?" },
        a: { es: "Sí, podemos programar paradas breves para ir al baño o comprar snacks. Por favor indícalo al momento de reservar.", en: "Yes, we can schedule brief stops for restrooms or snacks. Please let us know when booking." }
      }
    ],
    waMessage: {
      es: "Hola, me gustaria cotizar un traslado privado desde Palomino hacia Tayrona.",
      en: "Hello, I would like to get a quote for a private transfer from Palomino to Tayrona."
    },
    image: "/assets/pilot/routes/palomino-01.webp",
    image2: "/assets/pilot/routes/tayrona-01.webp"
  },
  {
    slug: "valledupar-to-minca",
    featured: false,
    priceMode: "quote",
    title: {
      es: "Transporte privado de Valledupar a Minca | EverTrip",
      en: "Private Transfer Valledupar to Minca | EverTrip",
    },
    h1: {
      es: "Transporte privado Valledupar ↔ Minca",
      en: "Private Transfer Valledupar ↔ Minca",
    },
    metaDescription: {
      es: "Viaje privado puerta a puerta entre Valledupar y Minca. Reserva tu traslado con EverTrip. Conductores expertos y vehiculos premium.",
      en: "Door-to-door private transfer between Valledupar and Minca. Book your ride with EverTrip. Expert drivers and premium vehicles.",
    },
    description: {
      es: "Disfruta de un viaje comodo, seguro y sin complicaciones entre Valledupar y Minca. Nuestros servicios son 100% privados, asegurando tu tranquilidad.",
      en: "Enjoy a comfortable, safe, and hassle-free journey between Valledupar and Minca. Our services are 100% private, ensuring your peace of mind.",
    },
    duration: { es: "Aprox. 4h 30m", en: "Approx. 4h 30m" },
    idealFor: { es: "Parejas, Familias y Grupos", en: "Couples, Families, and Groups" },
    highlights: {
      es: [
        "Misma tarifa en ambos sentidos",
        "Servicio puerta a puerta",
        "Vehiculo privado con aire acondicionado",
        "Conductor puntual y profesional",
        "Sin cargos ocultos",
        "Asistencia y soporte via WhatsApp"
      ],
      en: [
        "Same rate in both directions",
        "Door-to-door service",
        "Private vehicle with AC",
        "Punctual and professional driver",
        "No hidden fees",
        "WhatsApp support and assistance"
      ]
    },
    faqs: [
      {
        q: { es: "¿El servicio es compartido?", en: "Is the service shared?" },
        a: { es: "No, todos nuestros traslados son 100% privados para ti y tu grupo.", en: "No, all our transfers are 100% private for you and your group." }
      },
      {
        q: { es: "¿Puedo hacer paradas en el camino?", en: "Can I make stops along the way?" },
        a: { es: "Sí, podemos programar paradas breves para ir al baño o comprar snacks. Por favor indícalo al momento de reservar.", en: "Yes, we can schedule brief stops for restrooms or snacks. Please let us know when booking." }
      }
    ],
    waMessage: {
      es: "Hola, me gustaria cotizar un traslado privado desde Valledupar hacia Minca.",
      en: "Hello, I would like to get a quote for a private transfer from Valledupar to Minca."
    },
    image: "/assets/pilot/routes/valledupar-01.webp",
    image2: "/assets/lugares/minca.jpg"
  },
  {
    slug: "valledupar-to-tayrona",
    featured: false,
    priceMode: "quote",
    title: {
      es: "Transporte privado de Valledupar a Tayrona | EverTrip",
      en: "Private Transfer Valledupar to Tayrona | EverTrip",
    },
    h1: {
      es: "Transporte privado Valledupar ↔ Tayrona",
      en: "Private Transfer Valledupar ↔ Tayrona",
    },
    metaDescription: {
      es: "Viaje privado puerta a puerta entre Valledupar y Tayrona. Reserva tu traslado con EverTrip. Conductores expertos y vehiculos premium.",
      en: "Door-to-door private transfer between Valledupar and Tayrona. Book your ride with EverTrip. Expert drivers and premium vehicles.",
    },
    description: {
      es: "Disfruta de un viaje comodo, seguro y sin complicaciones entre Valledupar y Tayrona. Nuestros servicios son 100% privados, asegurando tu tranquilidad.",
      en: "Enjoy a comfortable, safe, and hassle-free journey between Valledupar and Tayrona. Our services are 100% private, ensuring your peace of mind.",
    },
    duration: { es: "Aprox. 4h 30m", en: "Approx. 4h 30m" },
    idealFor: { es: "Parejas, Familias y Grupos", en: "Couples, Families, and Groups" },
    highlights: {
      es: [
        "Misma tarifa en ambos sentidos",
        "Servicio puerta a puerta",
        "Vehiculo privado con aire acondicionado",
        "Conductor puntual y profesional",
        "Sin cargos ocultos",
        "Asistencia y soporte via WhatsApp"
      ],
      en: [
        "Same rate in both directions",
        "Door-to-door service",
        "Private vehicle with AC",
        "Punctual and professional driver",
        "No hidden fees",
        "WhatsApp support and assistance"
      ]
    },
    faqs: [
      {
        q: { es: "¿El servicio es compartido?", en: "Is the service shared?" },
        a: { es: "No, todos nuestros traslados son 100% privados para ti y tu grupo.", en: "No, all our transfers are 100% private for you and your group." }
      },
      {
        q: { es: "¿Puedo hacer paradas en el camino?", en: "Can I make stops along the way?" },
        a: { es: "Sí, podemos programar paradas breves para ir al baño o comprar snacks. Por favor indícalo al momento de reservar.", en: "Yes, we can schedule brief stops for restrooms or snacks. Please let us know when booking." }
      }
    ],
    waMessage: {
      es: "Hola, me gustaria cotizar un traslado privado desde Valledupar hacia Tayrona.",
      en: "Hello, I would like to get a quote for a private transfer from Valledupar to Tayrona."
    },
    image: "/assets/pilot/routes/valledupar-01.webp",
    image2: "/assets/pilot/routes/tayrona-01.webp"
  },
  {
    slug: "valledupar-to-santa-marta",
    featured: false,
    priceMode: "quote",
    title: {
      es: "Transporte privado de Valledupar a Santa Marta | EverTrip",
      en: "Private Transfer Valledupar to Santa Marta | EverTrip",
    },
    h1: {
      es: "Transporte privado Valledupar ↔ Santa Marta",
      en: "Private Transfer Valledupar ↔ Santa Marta",
    },
    metaDescription: {
      es: "Viaje privado puerta a puerta entre Valledupar y Santa Marta. Reserva tu traslado con EverTrip. Conductores expertos y vehiculos premium.",
      en: "Door-to-door private transfer between Valledupar and Santa Marta. Book your ride with EverTrip. Expert drivers and premium vehicles.",
    },
    description: {
      es: "Disfruta de un viaje comodo, seguro y sin complicaciones entre Valledupar y Santa Marta. Nuestros servicios son 100% privados, asegurando tu tranquilidad.",
      en: "Enjoy a comfortable, safe, and hassle-free journey between Valledupar and Santa Marta. Our services are 100% private, ensuring your peace of mind.",
    },
    duration: { es: "Aprox. 4h", en: "Approx. 4h" },
    idealFor: { es: "Parejas, Familias y Grupos", en: "Couples, Families, and Groups" },
    highlights: {
      es: [
        "Misma tarifa en ambos sentidos",
        "Servicio puerta a puerta",
        "Vehiculo privado con aire acondicionado",
        "Conductor puntual y profesional",
        "Sin cargos ocultos",
        "Asistencia y soporte via WhatsApp"
      ],
      en: [
        "Same rate in both directions",
        "Door-to-door service",
        "Private vehicle with AC",
        "Punctual and professional driver",
        "No hidden fees",
        "WhatsApp support and assistance"
      ]
    },
    faqs: [
      {
        q: { es: "¿El servicio es compartido?", en: "Is the service shared?" },
        a: { es: "No, todos nuestros traslados son 100% privados para ti y tu grupo.", en: "No, all our transfers are 100% private for you and your group." }
      },
      {
        q: { es: "¿Puedo hacer paradas en el camino?", en: "Can I make stops along the way?" },
        a: { es: "Sí, podemos programar paradas breves para ir al baño o comprar snacks. Por favor indícalo al momento de reservar.", en: "Yes, we can schedule brief stops for restrooms or snacks. Please let us know when booking." }
      }
    ],
    waMessage: {
      es: "Hola, me gustaria cotizar un traslado privado desde Valledupar hacia Santa Marta.",
      en: "Hello, I would like to get a quote for a private transfer from Valledupar to Santa Marta."
    },
    image: "/assets/pilot/routes/valledupar-01.webp",
    image2: "/assets/pilot/routes/santa-marta-01.webp"
  }
];

export function getRouteBySlug(slug: string): RouteDefinition | undefined {
  return routes.find((r) => r.slug === slug);
}

export function getWhatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
