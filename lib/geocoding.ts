type Coordinates = {
  latitude: number;
  longitude: number;
};

export async function geocodeAddress(
  address: string
): Promise<Coordinates | null> {
  const url = new URL("https://nominatim.openstreetmap.org/search");

  url.searchParams.set("q", `${address}, Zimbabwe`);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");

  const response = await fetch(url.toString(), {
    headers: {
      "User-Agent": "MushaLink/1.0",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Geocoding request failed.");
  }

  const results = await response.json();

  if (!results.length) {
    return null;
  }

  return {
    latitude: Number(results[0].lat),
    longitude: Number(results[0].lon),
  };
}

export function calculateDistanceKm(
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number
): number {
  const earthRadiusKm = 6371;

  const lat1 = (latitude1 * Math.PI) / 180;
  const lat2 = (latitude2 * Math.PI) / 180;

  const deltaLat =
    ((latitude2 - latitude1) * Math.PI) / 180;

  const deltaLon =
    ((longitude2 - longitude1) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) ** 2;

  const c =
    2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Number((earthRadiusKm * c).toFixed(1));
}