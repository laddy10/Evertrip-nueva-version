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
      if (passengers > 4) isQuoteOnly = true; // For base pricing, >4 needs a manual quote
      break;
    case "santa-marta-to-palomino":
      price = getBase("palomino") || 0;
      if (passengers > 4) isQuoteOnly = true;
      break;
    case "private-transfer-santa-marta-cartagena":
    case "cartagena-airport-to-santa-marta":
      price = getBase("cartagena") || 0;
      if (passengers > 4) isQuoteOnly = true;
      break;
    case "santa-marta-to-tayrona":
      price = getBase("parque-tayrona") || 0;
      if (passengers > 4) isQuoteOnly = true;
      break;
    case "santa-marta-to-minca":
      price = getBase("minca") || 0;
      if (passengers > 4) isQuoteOnly = true;
      break;
    default:
      // Custom routes or routes that are always manual quote
      isQuoteOnly = true;
  }

  return {
    vehicle,
    price,
    priceFormatted: formatCOP(price),
    isQuoteOnly,
  };
}

export interface PriceCard {
  label: Localized;
  price: string;
  note?: Localized;
}

export function getPriceCards(route: RouteDefinition): PriceCard[] {
  const quote = getQuoteForRoute(route.slug, 4); // Get quote for base vehicle
  if (!quote || quote.price === 0) return [];
  
  return [
    {
      label: { es: "Desde (1 a 4 pasajeros)", en: "From (1 to 4 passengers)" },
      price: quote.priceFormatted,
      note: { es: quote.vehicle.name.es, en: quote.vehicle.name.en }
    }
  ];
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
      es: "Viaje puerta a puerta desde Barranquilla hasta Palomino (La Guajira). Vehículo privado, precio por vehículo según grupo, reserva por WhatsApp en minutos.",
      en: "Door-to-door private transfer from Barranquilla to Palomino (La Guajira). Private vehicle, price per group size, book on WhatsApp in minutes.",
    },
    description: {
      es: "Conectamos Barranquilla con Palomino en un vehículo 100% privado, sin paradas para recoger a otros pasajeros. Ideal para quienes llegan al Aeropuerto Ernesto Cortissoz o salen desde cualquier punto de la ciudad directo a la playa.",
      en: "We connect Barranquilla with Palomino in a 100% private vehicle, no stops to pick up other passengers. Ideal for travelers arriving at Ernesto Cortissoz Airport or leaving from anywhere in the city straight to the beach.",
    },
    duration: { es: "Aprox. 2h 30min - 3h", en: "Approx. 2h 30min - 3h" },
    idealFor: { es: "Familias y grupos", en: "Families and groups" },
    highlights: {
      es: [
        "Recogida puerta a puerta en Barranquilla (hotel, aeropuerto o domicilio)",
        "Vehículo 100% privado, sin compartir con otros pasajeros",
        "Precio por vehículo, no por persona",
        "Conductor local con experiencia en la vía a La Guajira",
        "Disponible para grupos grandes (hasta 17 pasajeros)",
      ],
      en: [
        "Door-to-door pickup in Barranquilla (hotel, airport or address)",
        "100% private vehicle, never shared with other passengers",
        "Priced per vehicle, not per person",
        "Local driver experienced on the route to La Guajira",
        "Available for large groups (up to 17 passengers)",
      ],
    },
    faqs: [
      {
        q: { es: "¿Cuánto dura el viaje de Barranquilla a Palomino?", en: "How long is the trip from Barranquilla to Palomino?" },
        a: { es: "En promedio entre 2 horas y media y 3 horas, dependiendo del tráfico en la vía y el punto exacto de recogida en Barranquilla.", en: "On average between 2.5 and 3 hours, depending on traffic and the exact pickup point in Barranquilla." },
      },
      {
        q: { es: "¿El precio es por persona o por vehículo?", en: "Is the price per person or per vehicle?" },
        a: { es: "El precio es por vehículo completo. Por eso mostramos 3 tarifas según el tamaño del grupo (1 a 4, 5 a 10 y 11 a 17 pasajeros).", en: "The price is for the entire vehicle. That's why we show 3 rates based on group size (1-4, 5-10 and 11-17 passengers)." },
      },
      {
        q: { es: "¿Pueden recogerme en el Aeropuerto Ernesto Cortissoz?", en: "Can you pick me up at Ernesto Cortissoz Airport?" },
        a: { es: "Sí. Solo indícanos el número de vuelo y te esperamos en la sala de llegadas, incluso si el vuelo se retrasa.", en: "Yes. Just share your flight number and we'll be waiting in the arrivals area, even if your flight is delayed." },
      },
      {
        q: { es: "¿Puedo hacer una parada en el camino, por ejemplo en Santa Marta?", en: "Can I make a stop along the way, for example in Santa Marta?" },
        a: { es: "Claro, al ser un servicio privado podemos coordinar paradas cortas. Cuéntanos con anticipación por WhatsApp.", en: "Of course, since it's a private service we can arrange short stops. Just let us know in advance on WhatsApp." },
      },
    ],
    waMessage: {
      es: "Hola, necesito un transporte privado de Barranquilla a Palomino.",
      en: "Hi, I need a private transfer from Barranquilla to Palomino.",
    },
    image: "/assets/lugares/barranquilla.jpg",
    image2: "/assets/lugares/palomino.jpg",
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
      es: "Traslado privado puerta a puerta entre Barranquilla y Santa Marta. Mismo precio en ambos sentidos, reserva por WhatsApp.",
      en: "Private door-to-door transfer between Barranquilla and Santa Marta. Same price both directions, book on WhatsApp.",
    },
    description: {
      es: "Uno de los trayectos más solicitados de la costa Caribe. Te llevamos directo desde tu hotel, casa o el aeropuerto en Barranquilla hasta cualquier punto de Santa Marta, sin escalas ni paradas para recoger a otros pasajeros.",
      en: "One of the most requested routes on the Caribbean coast. We take you directly from your hotel, home or the airport in Barranquilla to any point in Santa Marta, no layovers or stops to pick up other passengers.",
    },
    duration: { es: "Aprox. 1h 30min - 2h", en: "Approx. 1h 30min - 2h" },
    idealFor: { es: "Viajeros y negocios", en: "Travelers and business" },
    highlights: {
      es: [
        "Mismo precio en ambos sentidos: Barranquilla → Santa Marta o Santa Marta → Barranquilla",
        "Recogida en el Aeropuerto Ernesto Cortissoz o en cualquier dirección de la ciudad",
        "Vehículo privado con aire acondicionado",
        "Conductor puntual, seguimiento de vuelo si aplica",
        "Reserva confirmada por WhatsApp en minutos",
      ],
      en: [
        "Same price in both directions: Barranquilla → Santa Marta or Santa Marta → Barranquilla",
        "Pickup at Ernesto Cortissoz Airport or anywhere in the city",
        "Private air-conditioned vehicle",
        "On-time driver, flight tracking when applicable",
        "Booking confirmed on WhatsApp within minutes",
      ],
    },
    faqs: [
      {
        q: { es: "¿El precio cambia si voy de Santa Marta a Barranquilla en vez de al revés?", en: "Does the price change if I go from Santa Marta to Barranquilla instead?" },
        a: { es: "No, el precio es el mismo sin importar la dirección del viaje.", en: "No, the price is the same regardless of the direction of travel." },
      },
      {
        q: { es: "¿Cuánto se demora el viaje?", en: "How long does the trip take?" },
        a: { es: "Normalmente entre 1 hora y media y 2 horas, según el tráfico y el punto exacto de recogida.", en: "Usually between 1.5 and 2 hours, depending on traffic and the exact pickup point." },
      },
      {
        q: { es: "¿Sirve para llegar a tiempo a un vuelo internacional en Barranquilla?", en: "Is it reliable to catch an international flight in Barranquilla?" },
        a: { es: "Sí, recomendamos salir con al menos 3 horas de anticipación para vuelos internacionales. Coordinamos la hora de salida contigo.", en: "Yes, we recommend leaving at least 3 hours in advance for international flights. We coordinate the departure time with you." },
      },
    ],
    waMessage: {
      es: "Hola, necesito un transporte privado entre Barranquilla y Santa Marta.",
      en: "Hi, I need a private transfer between Barranquilla and Santa Marta.",
    },
    image: "/assets/lugares/barranquilla.jpg",
    image2: "/assets/lugares/santa-marta.jpg",
  },
  {
    slug: "barranquilla-to-valledupar",
    featured: true,
    priceMode: "quote",
    title: {
      es: "Transporte privado a Valledupar desde Barranquilla | EverTrip",
      en: "Valledupar Private Transfer from Barranquilla | EverTrip",
    },
    h1: {
      es: "Barranquilla ↔ Valledupar",
      en: "Barranquilla ↔ Valledupar",
    },
    metaDescription: {
      es: "Organizamos tu viaje desde Barranquilla hasta Valledupar. Transporte privado puerta a puerta, cómodo y seguro. Cotización personalizada por WhatsApp.",
      en: "We arrange your trip from Barranquilla to Valledupar. Private, comfortable, and safe door-to-door transport. Personalized quote via WhatsApp.",
    },
    description: {
      es: "Disfruta de un viaje cómodo y directo entre Barranquilla y Valledupar. Nuestro servicio de transporte privado puerta a puerta te garantiza seguridad y tranquilidad, ideal para viajes de negocios o turismo.",
      en: "Enjoy a comfortable and direct trip between Barranquilla and Valledupar. Our private door-to-door transport service guarantees safety and peace of mind, ideal for business trips or tourism.",
    },
    duration: { es: "4 a 5 horas", en: "4 to 5 hours" },
    idealFor: { es: "Viajeros de negocios, familias y turismo", en: "Business travelers, families and tourism" },
    highlights: {
      es: [
        "Salida coordinada desde Barranquilla (aeropuerto o punto de encuentro)",
        "Viaje directo sin paradas innecesarias",
        "Vehículos cómodos y climatizados",
        "Conductores experimentados en la ruta",
        "Cotización a la medida según cantidad de personas",
      ],
      en: [
        "Coordinated departure from Barranquilla (airport or meeting point)",
        "Direct trip without unnecessary stops",
        "Comfortable and air-conditioned vehicles",
        "Experienced drivers on the route",
        "Custom quote based on group size",
      ],
    },
    faqs: [
      {
        q: { es: "¿El servicio es puerta a puerta?", en: "Is the service door-to-door?" },
        a: { es: "Sí, te recogemos en tu hotel o en el aeropuerto de Barranquilla y te llevamos directamente a tu destino en Valledupar.", en: "Yes, we pick you up at your hotel or at the Barranquilla airport and take you directly to your destination in Valledupar." },
      },
      {
        q: { es: "¿Puedo hacer paradas en el camino?", en: "Can I make stops along the way?" },
        a: { es: "Sí, al ser un servicio privado, puedes solicitar paradas breves para descansar o ir al baño.", en: "Yes, since it is a private service, you can request brief stops to rest or use the restroom." },
      },
      {
        q: { es: "¿Qué tipo de vehículos utilizan?", en: "What kind of vehicles do you use?" },
        a: { es: "Utilizamos vans y camionetas modernas, espaciosas y con aire acondicionado, ideales para la duración del viaje.", en: "We use modern, spacious vans and SUVs with air conditioning, ideal for the duration of the trip." },
      },
    ],
    waMessage: {
      es: "Hola, quiero cotizar un viaje desde Barranquilla hasta Valledupar.",
      en: "Hi, I'd like a quote for a trip from Barranquilla to Valledupar.",
    },
    image: "/assets/lugares/barranquilla.jpg",
    image2: "/assets/lugares/valledupar.jpg",
  },
  {
    slug: "private-transfer-santa-marta-cartagena",
    priceMode: "base",
    title: { es: "Transporte privado Santa Marta - Cartagena | EverTrip", en: "Private Transfer Santa Marta - Cartagena | EverTrip" },
    h1: { es: "Transporte privado Santa Marta ↔ Cartagena", en: "Private Transfer Santa Marta ↔ Cartagena" },
    metaDescription: {
      es: "Traslado privado puerta a puerta entre Santa Marta y Cartagena. Vehículo cómodo con aire acondicionado, reserva por WhatsApp.",
      en: "Private door-to-door transfer between Santa Marta and Cartagena. Comfortable air-conditioned vehicle, book on WhatsApp.",
    },
    description: {
      es: "Un recorrido escénico por la costa Caribe, ideal para familias y parejas que prefieren viajar sin escalas ni terminales de transporte.",
      en: "A scenic ride along the Caribbean coast, ideal for families and couples who prefer to travel without layovers or bus terminals.",
    },
    duration: { es: "Aprox. 4h - 4h 30min", en: "Approx. 4h - 4h 30min" },
    idealFor: { es: "Familias y parejas", en: "Families and couples" },
    highlights: {
      es: [
        "Recogida puerta a puerta en Santa Marta o Cartagena",
        "Sin paradas en terminales ni transbordos",
        "Vehículo privado con aire acondicionado",
        "Ideal para llegar directo al hotel",
        "Seguimiento de vuelo si vienes desde el aeropuerto",
      ],
      en: [
        "Door-to-door pickup in Santa Marta or Cartagena",
        "No terminal stops or transfers",
        "Private air-conditioned vehicle",
        "Ideal for going straight to your hotel",
        "Flight tracking if arriving from the airport",
      ],
    },
    faqs: [
      {
        q: { es: "¿Cuánto dura el viaje entre Santa Marta y Cartagena?", en: "How long does the Santa Marta - Cartagena trip take?" },
        a: { es: "Entre 4 y 4 horas y media, según el tráfico en la vía.", en: "Between 4 and 4.5 hours, depending on road traffic." },
      },
    ],
    waMessage: { es: "Hola, necesito un transporte privado entre Santa Marta y Cartagena.", en: "Hi, I need a private transfer between Santa Marta and Cartagena." },
    image: "/assets/lugares/santa-marta.jpg",
    image2: "/assets/lugares/cartagena.jpg",
  },
  {
    slug: "santa-marta-to-minca",
    priceMode: "base",
    title: { es: "Transporte privado a Minca | EverTrip", en: "Private Transfer to Minca | EverTrip" },
    h1: { es: "Santa Marta ↔ Minca", en: "Santa Marta ↔ Minca" },
    metaDescription: {
      es: "Traslado privado y seguro desde Santa Marta hasta Minca. Vías de montaña, conductores expertos, reserva por WhatsApp.",
      en: "Private, safe transfer from Santa Marta to Minca. Mountain roads, expert drivers, book on WhatsApp.",
    },
    description: {
      es: "Minca tiene vías estrechas de montaña, por eso nuestros conductores conocen bien el trayecto para llevarte con total seguridad a fincas, cascadas y miradores.",
      en: "Minca has narrow mountain roads, which is why our drivers know the route well to safely take you to farms, waterfalls and viewpoints.",
    },
    duration: { es: "Aprox. 45min - 1h", en: "Approx. 45min - 1h" },
    idealFor: { es: "Retiros de montaña", en: "Mountain retreats" },
    highlights: {
      es: [
        "Conductores con experiencia en vías de montaña",
        "Recogida puerta a puerta en Santa Marta",
        "Ideal para fincas cafeteras, cascadas y avistamiento de aves",
        "Podemos coordinar el regreso el mismo día",
      ],
      en: [
        "Drivers experienced on mountain roads",
        "Door-to-door pickup in Santa Marta",
        "Ideal for coffee farms, waterfalls and bird watching",
        "We can coordinate a same-day return",
      ],
    },
    faqs: [
      {
        q: { es: "¿Es seguro el camino a Minca?", en: "Is the road to Minca safe?" },
        a: { es: "Sí, es un camino de montaña con curvas; nuestros conductores están familiarizados con la ruta y conducen con precaución.", en: "Yes, it's a winding mountain road; our drivers are familiar with the route and drive carefully." },
      },
    ],
    waMessage: { es: "Hola, necesito un transporte a Minca.", en: "Hi, I need a transfer to Minca." },
    image: "/assets/lugares/santa-marta.jpg",
    image2: "/assets/lugares/minca.jpg",
  },
  {
    slug: "cartagena-airport-to-santa-marta",
    priceMode: "base",
    title: { es: "Traslado Aeropuerto de Cartagena a Santa Marta | EverTrip", en: "Cartagena Airport to Santa Marta Transfer | EverTrip" },
    h1: { es: "Aeropuerto de Cartagena ↔ Santa Marta", en: "Cartagena Airport ↔ Santa Marta" },
    metaDescription: {
      es: "Traslado privado desde el Aeropuerto Rafael Núñez de Cartagena hasta Santa Marta. Seguimiento de vuelo incluido, reserva por WhatsApp.",
      en: "Private transfer from Rafael Núñez Airport in Cartagena to Santa Marta. Flight tracking included, book on WhatsApp.",
    },
    description: {
      es: "Llegas, tomas tus maletas y tu conductor ya está esperando en la sala de llegadas del aeropuerto de Cartagena, listo para llevarte directo a Santa Marta.",
      en: "You land, grab your bags, and your driver is already waiting in the arrivals area of Cartagena's airport, ready to take you straight to Santa Marta.",
    },
    duration: { es: "Aprox. 4h - 4h 30min", en: "Approx. 4h - 4h 30min" },
    idealFor: { es: "Llegadas internacionales y nacionales", en: "International and domestic arrivals" },
    highlights: {
      es: [
        "Conductor esperando en la sala de llegadas con cartel",
        "Seguimiento de vuelo en tiempo real",
        "Espera sin costo adicional en caso de demora",
        "Vehículo privado directo a tu hotel en Santa Marta",
      ],
      en: [
        "Driver waiting in the arrivals area with a sign",
        "Real-time flight tracking",
        "No extra charge for waiting if your flight is delayed",
        "Private vehicle straight to your hotel in Santa Marta",
      ],
    },
    faqs: [
      {
        q: { es: "¿Qué pasa si mi vuelo se retrasa?", en: "What happens if my flight is delayed?" },
        a: { es: "No hay problema, seguimos tu vuelo en tiempo real y ajustamos la hora de recogida sin costo adicional.", en: "No problem, we track your flight in real time and adjust the pickup time at no extra cost." },
      },
    ],
    waMessage: { es: "Hola, necesito un traslado desde el Aeropuerto de Cartagena a Santa Marta.", en: "Hi, I need a transfer from Cartagena Airport to Santa Marta." },
    image: "/assets/lugares/cartagena.jpg",
    image2: "/assets/lugares/santa-marta.jpg",
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
      es: "Traslado privado puerta a puerta de Santa Marta a Palomino. Van cómoda, espacio para maletas, reserva por WhatsApp.",
      en: "Private door-to-door transfer from Santa Marta to Palomino. Comfortable van, luggage space, book on WhatsApp.",
    },
    description: {
      es: "El trayecto favorito de mochileros y parejas que van a Palomino. Salimos desde cualquier punto de Santa Marta con espacio de sobra para tablas, maletas y equipo de playa.",
      en: "The favorite route for backpackers and couples heading to Palomino. We depart from anywhere in Santa Marta with plenty of room for boards, luggage and beach gear.",
    },
    duration: { es: "Aprox. 1h 30min", en: "Approx. 1h 30min" },
    idealFor: { es: "Mochileros y parejas", en: "Backpackers and couples" },
    highlights: {
      es: [
        "Recogida puerta a puerta en Santa Marta",
        "Espacio amplio para maletas y equipo de playa",
        "Vehículo privado, sin compartir con desconocidos",
        "Conductor conoce bien la vía Santa Marta - Riohacha",
        "Grupos grandes: cotización directa por WhatsApp",
      ],
      en: [
        "Door-to-door pickup in Santa Marta",
        "Plenty of room for luggage and beach gear",
        "Private vehicle, never shared with strangers",
        "Driver knows the Santa Marta - Riohacha road well",
        "Larger groups: direct quote via WhatsApp",
      ],
    },
    faqs: [
      {
        q: { es: "¿Cuánto dura el viaje a Palomino?", en: "How long is the trip to Palomino?" },
        a: { es: "Aproximadamente 1 hora y media desde Santa Marta, según el tráfico.", en: "Approximately 1.5 hours from Santa Marta, depending on traffic." },
      },
      {
        q: { es: "¿Puedo pedir un vehículo más grande para mi grupo?", en: "Can I request a bigger vehicle for my group?" },
        a: { es: "Sí, para grupos de más de 4 personas te cotizamos el vehículo adecuado por WhatsApp.", en: "Yes, for groups larger than 4 people we'll quote the right vehicle for you on WhatsApp." },
      },
    ],
    waMessage: { es: "Hola, necesito un transporte privado de Santa Marta a Palomino.", en: "Hi, I need a private transfer from Santa Marta to Palomino." },
    image: "/assets/lugares/santa-marta.jpg",
    image2: "/assets/lugares/palomino.jpg",
  },
  {
    slug: "santa-marta-to-tayrona",
    priceMode: "base",
    title: { es: "Transporte privado a Parque Tayrona | EverTrip", en: "Private Transfer to Tayrona National Park | EverTrip" },
    h1: { es: "Santa Marta ↔ Parque Tayrona", en: "Santa Marta ↔ Tayrona National Park" },
    metaDescription: {
      es: "Traslado privado desde Santa Marta hasta la entrada del Parque Tayrona. Salidas tempranas disponibles, reserva por WhatsApp.",
      en: "Private transfer from Santa Marta to the entrance of Tayrona National Park. Early departures available, book on WhatsApp.",
    },
    description: {
      es: "Te llevamos hasta la entrada del Parque Tayrona a la hora que necesites, incluso en horarios tempranos para aprovechar el día completo en la playa.",
      en: "We take you to the entrance of Tayrona National Park whenever you need, even early morning departures to make the most of your beach day.",
    },
    duration: { es: "Aprox. 45min - 1h", en: "Approx. 45min - 1h" },
    idealFor: { es: "Amantes de la naturaleza", en: "Nature lovers" },
    highlights: {
      es: [
        "Salidas tempranas disponibles",
        "Recogida puerta a puerta en Santa Marta",
        "Vehículo privado, cómodo para grupos y familias",
        "Podemos coordinar la hora de regreso también",
      ],
      en: [
        "Early morning departures available",
        "Door-to-door pickup in Santa Marta",
        "Private vehicle, comfortable for groups and families",
        "We can also coordinate the return pickup time",
      ],
    },
    faqs: [
      {
        q: { es: "¿Hasta dónde llega el vehículo dentro del parque?", en: "How far into the park does the vehicle go?" },
        a: { es: "Te dejamos en la entrada principal del Parque Tayrona; desde ahí el ingreso se hace caminando o en transporte interno del parque.", en: "We drop you at the main entrance of Tayrona Park; from there entry continues on foot or via the park's internal transport." },
      },
    ],
    waMessage: { es: "Hola, necesito un transporte a Parque Tayrona.", en: "Hi, I need a transfer to Tayrona Park." },
    image: "/assets/lugares/santa-marta.jpg",
    image2: "/assets/lugares/tayrona.jpg",
  },
  {
    slug: "cartagena-to-barranquilla",
    priceMode: "quote",
    title: { es: "Transporte privado Cartagena - Barranquilla | EverTrip", en: "Private Transfer Cartagena - Barranquilla | EverTrip" },
    h1: { es: "Cartagena ↔ Barranquilla", en: "Cartagena ↔ Barranquilla" },
    metaDescription: {
      es: "Traslado privado y puntual entre Cartagena y Barranquilla, ideal para viajes de negocios y eventos. Cotiza por WhatsApp.",
      en: "Private, punctual transfer between Cartagena and Barranquilla, ideal for business trips and events. Get a quote on WhatsApp.",
    },
    description: {
      es: "Conexión directa y puntual entre dos de las ciudades más importantes de la costa Caribe, pensada para viajeros de negocios y eventos que no pueden fallar en su hora de llegada.",
      en: "A direct, punctual connection between two of the most important cities on the Caribbean coast, designed for business travelers and event attendees who can't miss their arrival time.",
    },
    duration: { es: "Aprox. 2h - 2h 30min", en: "Approx. 2h - 2h 30min" },
    idealFor: { es: "Negocios y eventos", en: "Business & events" },
    highlights: {
      es: [
        "Salidas puntuales, ideal para agendas de negocio",
        "Vehículo privado con aire acondicionado",
        "Recogida en aeropuerto, hotel u oficina",
        "Cotización según horario y punto exacto de recogida",
      ],
      en: [
        "On-time departures, ideal for business schedules",
        "Private air-conditioned vehicle",
        "Pickup at the airport, hotel or office",
        "Quote based on schedule and exact pickup point",
      ],
    },
    faqs: [
      {
        q: { es: "¿Puedo reservar para primera hora de la mañana?", en: "Can I book for early morning?" },
        a: { es: "Sí, coordinamos la hora exacta que necesites, incluyendo madrugadas para vuelos o reuniones tempranas.", en: "Yes, we coordinate the exact time you need, including early mornings for flights or early meetings." },
      },
    ],
    waMessage: { es: "Hola, necesito un transporte privado entre Cartagena y Barranquilla.", en: "Hi, I need a private transfer between Cartagena and Barranquilla." },
    image: "/assets/lugares/cartagena.jpg",
    image2: "/assets/lugares/barranquilla.jpg",
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
    image: "/assets/lugares/real-bus.jpg",
  },
  {
    slug: "santa-marta-airport-transfer",
    priceMode: "quote",
    title: { es: "Traslado Aeropuerto de Santa Marta | EverTrip", en: "Santa Marta Airport Transfer | EverTrip" },
    h1: { es: "Aeropuerto de Santa Marta ↔ Ciudad", en: "Santa Marta Airport ↔ City" },
    metaDescription: {
      es: "Traslado privado desde el Aeropuerto Simón Bolívar de Santa Marta hasta tu hotel. Seguimiento de vuelo, reserva por WhatsApp.",
      en: "Private transfer from Simón Bolívar Airport in Santa Marta to your hotel. Flight tracking, book on WhatsApp.",
    },
    description: {
      es: "Servicio de recogida en el aeropuerto de Santa Marta con seguimiento de vuelo en tiempo real, para que llegues directo a tu hotel sin esperas.",
      en: "Airport pickup service in Santa Marta with real-time flight tracking, so you get straight to your hotel without waiting.",
    },
    duration: { es: "Aprox. 20-40 min según el destino", en: "Approx. 20-40 min depending on destination" },
    idealFor: { es: "Todos los viajeros", en: "All travelers" },
    highlights: {
      es: [
        "Conductor esperando en la sala de llegadas",
        "Seguimiento de vuelo en tiempo real",
        "Precio según la zona exacta de destino en Santa Marta",
        "Disponible también para el regreso al aeropuerto",
      ],
      en: [
        "Driver waiting in the arrivals area",
        "Real-time flight tracking",
        "Price depends on the exact drop-off zone in Santa Marta",
        "Also available for the return trip to the airport",
      ],
    },
    faqs: [
      {
        q: { es: "¿Cuánto cuesta el traslado desde el aeropuerto?", en: "How much does the airport transfer cost?" },
        a: { es: "Depende de la zona exacta de tu hotel en Santa Marta (Rodadero, El Rodadero, centro, Pozos Colorados, etc). Escríbenos por WhatsApp con tu dirección y te damos el precio exacto al momento.", en: "It depends on the exact zone of your hotel in Santa Marta (Rodadero, downtown, Pozos Colorados, etc). Message us on WhatsApp with your address and we'll give you the exact price right away." },
      },
    ],
    waMessage: { es: "Hola, necesito un traslado desde el Aeropuerto de Santa Marta.", en: "Hi, I need a transfer from Santa Marta Airport." },
    image: "/assets/lugares/real-airport-transfer.jpg",
  },
  {
    slug: "cartagena-to-palomino",
    featured: false,
    priceMode: "quote",
    title: {
      es: "Transporte privado de Cartagena a Palomino | EverTrip",
      en: "Private Transfer Cartagena to Palomino | EverTrip",
    },
    h1: {
      es: "Transporte privado Cartagena ↔ Palomino",
      en: "Private Transfer Cartagena ↔ Palomino",
    },
    metaDescription: {
      es: "Viaje privado puerta a puerta entre Cartagena y Palomino. Reserva tu traslado con EverTrip. Conductores expertos y vehiculos premium.",
      en: "Door-to-door private transfer between Cartagena and Palomino. Book your ride with EverTrip. Expert drivers and premium vehicles.",
    },
    description: {
      es: "Disfruta de un viaje comodo, seguro y sin complicaciones entre Cartagena y Palomino. Nuestros servicios son 100% privados, asegurando tu tranquilidad.",
      en: "Enjoy a comfortable, safe, and hassle-free journey between Cartagena and Palomino. Our services are 100% private, ensuring your peace of mind.",
    },
    duration: { es: "Aprox. 5h 30m", en: "Approx. 5h 30m" },
    idealFor: { es: "Parejas, Familias y Grupos", en: "Couples, Families, and Groups" },
    highlights: {
      es: [
        "Mismo precio en ambos sentidos",
        "Servicio puerta a puerta",
        "Vehiculo privado con aire acondicionado",
        "Conductor puntual y profesional",
        "Sin cargos ocultos",
        "Asistencia y soporte via WhatsApp"
      ],
      en: [
        "Same price in both directions",
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
      es: "Hola, me gustaria cotizar un traslado privado desde Cartagena hacia Palomino.",
      en: "Hello, I would like to get a quote for a private transfer from Cartagena to Palomino."
    },
    image: "/assets/lugares/cartagena.jpg",
    image2: "/assets/lugares/palomino.jpg"
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
        "Mismo precio en ambos sentidos",
        "Servicio puerta a puerta",
        "Vehiculo privado con aire acondicionado",
        "Conductor puntual y profesional",
        "Sin cargos ocultos",
        "Asistencia y soporte via WhatsApp"
      ],
      en: [
        "Same price in both directions",
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
    image: "/assets/lugares/cartagena.jpg",
    image2: "/assets/lugares/valledupar.jpg"
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
        "Mismo precio en ambos sentidos",
        "Servicio puerta a puerta",
        "Vehiculo privado con aire acondicionado",
        "Conductor puntual y profesional",
        "Sin cargos ocultos",
        "Asistencia y soporte via WhatsApp"
      ],
      en: [
        "Same price in both directions",
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
    image: "/assets/lugares/cartagena.jpg",
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
        "Mismo precio en ambos sentidos",
        "Servicio puerta a puerta",
        "Vehiculo privado con aire acondicionado",
        "Conductor puntual y profesional",
        "Sin cargos ocultos",
        "Asistencia y soporte via WhatsApp"
      ],
      en: [
        "Same price in both directions",
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
    image: "/assets/lugares/cartagena.jpg",
    image2: "/assets/lugares/tayrona.jpg"
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
        "Mismo precio en ambos sentidos",
        "Servicio puerta a puerta",
        "Vehiculo privado con aire acondicionado",
        "Conductor puntual y profesional",
        "Sin cargos ocultos",
        "Asistencia y soporte via WhatsApp"
      ],
      en: [
        "Same price in both directions",
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
    image: "/assets/lugares/barranquilla.jpg",
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
        "Mismo precio en ambos sentidos",
        "Servicio puerta a puerta",
        "Vehiculo privado con aire acondicionado",
        "Conductor puntual y profesional",
        "Sin cargos ocultos",
        "Asistencia y soporte via WhatsApp"
      ],
      en: [
        "Same price in both directions",
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
    image: "/assets/lugares/barranquilla.jpg",
    image2: "/assets/lugares/tayrona.jpg"
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
        "Mismo precio en ambos sentidos",
        "Servicio puerta a puerta",
        "Vehiculo privado con aire acondicionado",
        "Conductor puntual y profesional",
        "Sin cargos ocultos",
        "Asistencia y soporte via WhatsApp"
      ],
      en: [
        "Same price in both directions",
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
    image: "/assets/lugares/palomino.jpg",
    image2: "/assets/lugares/valledupar.jpg"
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
        "Mismo precio en ambos sentidos",
        "Servicio puerta a puerta",
        "Vehiculo privado con aire acondicionado",
        "Conductor puntual y profesional",
        "Sin cargos ocultos",
        "Asistencia y soporte via WhatsApp"
      ],
      en: [
        "Same price in both directions",
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
    image: "/assets/lugares/palomino.jpg",
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
        "Mismo precio en ambos sentidos",
        "Servicio puerta a puerta",
        "Vehiculo privado con aire acondicionado",
        "Conductor puntual y profesional",
        "Sin cargos ocultos",
        "Asistencia y soporte via WhatsApp"
      ],
      en: [
        "Same price in both directions",
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
    image: "/assets/lugares/palomino.jpg",
    image2: "/assets/lugares/tayrona.jpg"
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
        "Mismo precio en ambos sentidos",
        "Servicio puerta a puerta",
        "Vehiculo privado con aire acondicionado",
        "Conductor puntual y profesional",
        "Sin cargos ocultos",
        "Asistencia y soporte via WhatsApp"
      ],
      en: [
        "Same price in both directions",
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
    image: "/assets/lugares/valledupar.jpg",
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
        "Mismo precio en ambos sentidos",
        "Servicio puerta a puerta",
        "Vehiculo privado con aire acondicionado",
        "Conductor puntual y profesional",
        "Sin cargos ocultos",
        "Asistencia y soporte via WhatsApp"
      ],
      en: [
        "Same price in both directions",
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
    image: "/assets/lugares/valledupar.jpg",
    image2: "/assets/lugares/tayrona.jpg"
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
        "Mismo precio en ambos sentidos",
        "Servicio puerta a puerta",
        "Vehiculo privado con aire acondicionado",
        "Conductor puntual y profesional",
        "Sin cargos ocultos",
        "Asistencia y soporte via WhatsApp"
      ],
      en: [
        "Same price in both directions",
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
    image: "/assets/lugares/valledupar.jpg",
    image2: "/assets/lugares/santa-marta.jpg"
  }
];

export function getRouteBySlug(slug: string): RouteDefinition | undefined {
  return routes.find((r) => r.slug === slug);
}

export function getWhatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
