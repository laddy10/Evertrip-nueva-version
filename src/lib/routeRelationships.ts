import { routes, type RouteDefinition } from "@/data/routes";

type RouteKind = "city" | "airport" | "tourist" | "custom";

interface RouteRelationshipMeta {
  locations: string[];
  kind: RouteKind;
}

const metadata: Record<string, RouteRelationshipMeta> = {
  "barranquilla-to-palomino": { locations: ["Barranquilla", "Palomino"], kind: "city" },
  "barranquilla-to-santa-marta": { locations: ["Barranquilla", "Santa Marta"], kind: "city" },
  "barranquilla-to-valledupar": { locations: ["Barranquilla", "Valledupar"], kind: "city" },
  "private-transfer-santa-marta-cartagena": { locations: ["Santa Marta", "Cartagena"], kind: "city" },
  "santa-marta-to-minca": { locations: ["Santa Marta", "Minca"], kind: "tourist" },
  "cartagena-airport-to-santa-marta": { locations: ["Cartagena", "Santa Marta"], kind: "airport" },
  "santa-marta-to-palomino": { locations: ["Santa Marta", "Palomino"], kind: "tourist" },
  "santa-marta-to-tayrona": { locations: ["Santa Marta", "Tayrona"], kind: "tourist" },
  "cartagena-to-barranquilla": { locations: ["Cartagena", "Barranquilla"], kind: "city" },
  "custom-private-routes": { locations: [], kind: "custom" },
  "santa-marta-airport-transfer": { locations: ["Santa Marta"], kind: "airport" },
  "cartagena-to-palomino": { locations: ["Cartagena", "Palomino"], kind: "city" },
  "cartagena-to-valledupar": { locations: ["Cartagena", "Valledupar"], kind: "city" },
  "cartagena-to-minca": { locations: ["Cartagena", "Minca"], kind: "tourist" },
  "cartagena-to-tayrona": { locations: ["Cartagena", "Tayrona"], kind: "tourist" },
  "barranquilla-to-minca": { locations: ["Barranquilla", "Minca"], kind: "tourist" },
  "barranquilla-to-tayrona": { locations: ["Barranquilla", "Tayrona"], kind: "tourist" },
  "palomino-to-valledupar": { locations: ["Palomino", "Valledupar"], kind: "city" },
  "palomino-to-minca": { locations: ["Palomino", "Minca"], kind: "tourist" },
  "palomino-to-tayrona": { locations: ["Palomino", "Tayrona"], kind: "tourist" },
  "valledupar-to-minca": { locations: ["Valledupar", "Minca"], kind: "tourist" },
  "valledupar-to-tayrona": { locations: ["Valledupar", "Tayrona"], kind: "tourist" },
  "valledupar-to-santa-marta": { locations: ["Valledupar", "Santa Marta"], kind: "city" },
};

const preferredRelationships: Record<string, string[]> = {
  "private-transfer-santa-marta-cartagena": [
    "cartagena-airport-to-santa-marta",
    "santa-marta-airport-transfer",
    "santa-marta-to-palomino",
    "cartagena-to-barranquilla",
  ],
  "santa-marta-to-palomino": [
    "santa-marta-to-tayrona",
    "santa-marta-to-minca",
    "santa-marta-airport-transfer",
    "palomino-to-tayrona",
  ],
  "santa-marta-to-tayrona": [
    "santa-marta-to-palomino",
    "santa-marta-to-minca",
    "santa-marta-airport-transfer",
    "palomino-to-tayrona",
  ],
  "cartagena-airport-to-santa-marta": [
    "private-transfer-santa-marta-cartagena",
    "santa-marta-airport-transfer",
    "santa-marta-to-palomino",
    "cartagena-to-barranquilla",
  ],
};

function scoreRelationship(currentSlug: string, candidateSlug: string): number {
  const current = metadata[currentSlug];
  const candidate = metadata[candidateSlug];
  if (!current || !candidate || currentSlug === candidateSlug) return -1;

  const sharedLocations = current.locations.filter((location) =>
    candidate.locations.includes(location),
  ).length;

  let score = sharedLocations * 100;

  if (sharedLocations > 0 && (current.kind === "airport" || candidate.kind === "airport")) {
    score += 25;
  }
  if (current.kind === candidate.kind && current.kind !== "custom") {
    score += 10;
  }
  if (current.kind === "tourist" && candidate.kind === "tourist") {
    score += 5;
  }
  if (candidate.kind === "custom") {
    score -= 20;
  }

  return score;
}

export function getRelatedRoutes(routeSlug: string, limit = 4): RouteDefinition[] {
  const bySlug = new Map(routes.map((route) => [route.slug, route]));
  const selected: RouteDefinition[] = [];
  const used = new Set([routeSlug]);

  for (const preferredSlug of preferredRelationships[routeSlug] ?? []) {
    const route = bySlug.get(preferredSlug);
    if (route && !used.has(preferredSlug)) {
      selected.push(route);
      used.add(preferredSlug);
      if (selected.length === limit) return selected;
    }
  }

  const ranked = routes
    .filter((route) => !used.has(route.slug))
    .map((route, index) => ({
      route,
      index,
      score: scoreRelationship(routeSlug, route.slug),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index);

  for (const item of ranked) {
    if (item.score < 0) continue;
    selected.push(item.route);
    used.add(item.route.slug);
    if (selected.length === limit) break;
  }

  return selected;
}

export const routeRelationshipMetadata = metadata;
