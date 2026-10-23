import type { Locale } from "@/i18n/config";

type LocalizedText = Record<Locale, string>;

export type TourImage = {
  src: string;
  alt: LocalizedText;
};

export type TourExperience = {
  slug: string;
  name: LocalizedText;
  category: LocalizedText;
  location: LocalizedText;
  duration?: LocalizedText;
  metaDescription: LocalizedText;
  intro: LocalizedText;
  description: LocalizedText;
  highlights: Record<Locale, string[]>;
  images: TourImage[];
  /** Optional Tours-page photography, independent of the homepage selection. */
  pageImages?: TourImage[];
};

const ASSET_ORIGIN = "https://assets.evertripviajes.com";

export const tours: TourExperience[] = [
  {
    slug: "tubing-rio-don-diego",
    name: { es: "Tubing por el río Don Diego", en: "Tubing on the Don Diego River" },
    category: { es: "Naturaleza · Aventura", en: "Nature · Adventure" },
    location: { es: "Río Don Diego · Sierra Nevada", en: "Don Diego River · Sierra Nevada" },
    duration: { es: "Aprox. 3 horas", en: "Approx. 3 hours" },
    metaDescription: {
      es: "Descubre la experiencia de tubing por el río Don Diego: sendero, naturaleza, descenso en flotador y encuentro del río con el mar Caribe.",
      en: "Discover tubing on the Don Diego River: a short trail, nature, a tubing descent and the meeting point between the river and the Caribbean Sea.",
    },
    intro: {
      es: "Una experiencia entre río, selva y mar en el entorno natural del río Don Diego.",
      en: "An experience between river, forest and sea in the natural setting of the Don Diego River.",
    },
    description: {
      es: "La actividad inicia con una caminata corta por el sendero tras la huella del Tairona. Después, el recorrido continúa en flotador por el río Don Diego hasta su desembocadura en el mar Caribe, acompañado por el paisaje y la fauna del entorno.",
      en: "The activity begins with a short walk along the trail known as Tras la Huella del Tairona. The journey then continues by tube along the Don Diego River until it reaches the Caribbean Sea, surrounded by the area's landscape and wildlife.",
    },
    highlights: {
      es: [
        "Caminata corta por el sendero tras la huella del Tairona.",
        "Descenso en tubing por las aguas del río Don Diego.",
        "Observación del entorno natural y de fauna de la zona durante el recorrido.",
        "Llegada a la unión del río Don Diego con el mar Caribe.",
        "Acompañamiento de guías locales durante la experiencia.",
      ],
      en: [
        "A short walk along the Tras la Huella del Tairona trail.",
        "Tubing descent along the Don Diego River.",
        "Observation of the area's natural environment and wildlife along the way.",
        "Arrival at the meeting point between the Don Diego River and the Caribbean Sea.",
        "Local guides accompany the experience.",
      ],
    },
    images: [
      {
        src: ASSET_ORIGIN + "/tours/tubing-rio-don-diego/hero_Tubing.webp",
        alt: {
          es: "Viajeros con chalecos salvavidas junto a flotadores en la orilla del río Don Diego",
          en: "Travelers wearing life jackets beside tubes on the bank of the Don Diego River",
        },
      },
      {
        src: ASSET_ORIGIN + "/tours/tubing-rio-don-diego/hero.webp",
        alt: {
          es: "Experiencia de tubing en el río Don Diego, Sierra Nevada",
          en: "Tubing experience on the Don Diego River in the Sierra Nevada",
        },
      },
      {
        src: ASSET_ORIGIN + "/tours/tubing-rio-don-diego/actividad-01.webp",
        alt: {
          es: "Viajeros preparados para la actividad de tubing en el río Don Diego",
          en: "Travelers preparing for the tubing experience on the Don Diego River",
        },
      },
      {
        src: ASSET_ORIGIN + "/tours/tubing-rio-don-diego/actividad-02.webp",
        alt: {
          es: "Recorrido de tubing rodeado por el entorno natural del río Don Diego",
          en: "Tubing route surrounded by the natural landscape of the Don Diego River",
        },
      },
      {
        src: ASSET_ORIGIN + "/tours/tubing-rio-don-diego/actividad-03.webp",
        alt: {
          es: "Actividad de tubing en las aguas del río Don Diego",
          en: "Tubing activity on the waters of the Don Diego River",
        },
      },
    ],
  },
  {
    slug: "avistamiento-flamencos-tarde-rancheria",
    name: {
      es: "Pasadía de avistamiento de flamencos y tarde de ranchería",
      en: "Flamingo watching and Wayuu ranchería day experience",
    },
    category: { es: "Naturaleza · Cultura", en: "Nature · Culture" },
    location: { es: "Camarones · La Guajira", en: "Camarones · La Guajira" },
    metaDescription: {
      es: "Conoce el Santuario de los Flamencos en Camarones y vive un acercamiento a la cultura Wayuu en una ranchería de La Guajira.",
      en: "Visit the Flamingo Sanctuary in Camarones and experience an introduction to Wayuu culture at a ranchería in La Guajira.",
    },
    intro: {
      es: "Una experiencia que une el paisaje del Santuario de los Flamencos con un acercamiento a la cultura Wayuu.",
      en: "An experience that brings together the landscape of the Flamingo Sanctuary and an introduction to Wayuu culture.",
    },
    description: {
      es: "El recorrido visita el Santuario de los Flamencos en Camarones, con observación de aves en su hábitat y un recorrido por la laguna en canoa artesanal. Después, la experiencia continúa en una ranchería Wayuu para acercarse a expresiones tradicionales de su cultura.",
      en: "The experience visits the Flamingo Sanctuary in Camarones, with birdwatching in their natural habitat and a trip across the lagoon in a traditional canoe. It then continues at a Wayuu ranchería for an introduction to traditional cultural expressions.",
    },
    highlights: {
      es: [
        "Visita al Santuario de los Flamencos en Camarones.",
        "Observación de aves en su hábitat natural.",
        "Recorrido por la laguna en canoa artesanal.",
        "Visita a una ranchería Wayuu.",
        "Acercamiento a expresiones culturales como pintura facial, vestimenta, música y bebidas tradicionales.",
      ],
      en: [
        "Visit to the Flamingo Sanctuary in Camarones.",
        "Birdwatching in their natural habitat.",
        "Trip across the lagoon in a traditional canoe.",
        "Visit to a Wayuu ranchería.",
        "Introduction to cultural expressions such as face painting, clothing, music and traditional drinks.",
      ],
    },
    images: [
      {
        src: ASSET_ORIGIN + "/tours/flamencos-rancheria/Avistamiento_flamencos.webp",
        alt: {
          es: "Flamencos rosados en las aguas poco profundas de la laguna de Camarones",
          en: "Pink flamingos in the shallow waters of the Camarones lagoon",
        },
      },
      {
        src: ASSET_ORIGIN + "/tours/flamencos-rancheria/canoa.webp",
        alt: {
          es: "Recorrido en canoa durante la experiencia en Camarones",
          en: "Canoe trip during the experience in Camarones",
        },
      },
      {
        src: ASSET_ORIGIN + "/tours/flamencos-rancheria/canoa-02.webp",
        alt: {
          es: "Navegación en canoa por la laguna de Camarones",
          en: "Canoe navigation across the lagoon in Camarones",
        },
      },
      {
        src: ASSET_ORIGIN + "/tours/flamencos-rancheria/rancheria.webp",
        alt: {
          es: "Experiencia cultural en una ranchería Wayuu",
          en: "Cultural experience at a Wayuu ranchería",
        },
      },
    ],
  },
  {
    slug: "pasadia-cabo-de-la-vela",
    name: { es: "Pasadía Cabo de la Vela", en: "Cabo de la Vela day experience" },
    category: { es: "Paisaje · Cultura", en: "Landscape · Culture" },
    location: { es: "Cabo de la Vela · La Guajira", en: "Cabo de la Vela · La Guajira" },
    metaDescription: {
      es: "Recorre paisajes y lugares emblemáticos de La Guajira en un pasadía por Manaure, Uribia, Cabo de la Vela y otros puntos de interés de la región.",
      en: "Explore emblematic landscapes and places in La Guajira on a day experience through Manaure, Uribia, Cabo de la Vela and other regional highlights.",
    },
    intro: {
      es: "Un recorrido por algunos de los paisajes y lugares emblemáticos de La Guajira.",
      en: "A journey through some of La Guajira's emblematic landscapes and places.",
    },
    description: {
      es: "La experiencia recorre distintos puntos de interés de La Guajira, desde las Salinas de Manaure y Uribia hasta Cabo de la Vela. El recorrido contempla además lugares como el Mirador del Arcoíris, el Pilón de Azúcar y el Ojo de Agua, y finaliza con un paso por Riohacha y su malecón.",
      en: "The experience visits several points of interest across La Guajira, from the salt flats of Manaure and Uribia to Cabo de la Vela. The route also features places such as Mirador del Arcoíris, Pilón de Azúcar and Ojo de Agua, before finishing with a visit to Riohacha and its waterfront.",
    },
    highlights: {
      es: [
        "Salinas de Manaure.",
        "Paso por Uribia y recorrido hacia Cabo de la Vela.",
        "Mirador del Arcoíris.",
        "Pilón de Azúcar y Ojo de Agua.",
        "Recorrido por Riohacha, el malecón y artesanías Wayuu.",
      ],
      en: [
        "Manaure salt flats.",
        "Pass through Uribia on the way to Cabo de la Vela.",
        "Mirador del Arcoíris.",
        "Pilón de Azúcar and Ojo de Agua.",
        "Visit to Riohacha, its waterfront and Wayuu handicrafts.",
      ],
    },
    images: [],
    pageImages: [
      {
        src: ASSET_ORIGIN + "/tours/cabo-de-la-vela/Cabo_de_la_Vela._Guajira_2.webp",
        alt: {
          es: "Playa de arena dorada y cerros rocosos frente al mar turquesa en Cabo de la Vela",
          en: "Golden beach and rocky hills beside turquoise water at Cabo de la Vela",
        },
      },
      {
        src: ASSET_ORIGIN + "/tours/cabo-de-la-vela/Cabo_de_la_Vela._Guajira.webp",
        alt: {
          es: "Playa y costa rocosa de Cabo de la Vela, La Guajira",
          en: "Beach and rocky coastline at Cabo de la Vela, La Guajira",
        },
      },
      {
        src: ASSET_ORIGIN + "/tours/cabo-de-la-vela/PLAYA_EL_PIL%C3%93N_DE_AZ%C3%9ACAR_-_CABO_DE_LA_VELA.webp",
        alt: {
          es: "Arena dorada y mar Caribe en la playa del Pilón de Azúcar",
          en: "Golden sand and Caribbean waters at Pilón de Azúcar beach",
        },
      },
      {
        src: ASSET_ORIGIN + "/tours/cabo-de-la-vela/Ojo_del_Agua.webp",
        alt: {
          es: "Playa y acantilados de Ojo del Agua en Cabo de la Vela",
          en: "Beach and cliffs at Ojo del Agua in Cabo de la Vela",
        },
      },
      {
        src: ASSET_ORIGIN + "/tours/cabo-de-la-vela/Playa_Arcoiris.webp",
        alt: {
          es: "Escaleras hacia la arena dorada y el mar turquesa de Playa Arcoíris en Cabo de la Vela",
          en: "Steps leading to the golden sand and turquoise sea at Playa Arcoíris in Cabo de la Vela",
        },
      },
    ],
  },
];

export function getTourBySlug(slug: string): TourExperience | undefined {
  return tours.find((tour) => tour.slug === slug);
}
