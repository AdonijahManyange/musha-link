const STORAGE_KEY = "favoriteListings";

export function getFavorites(): number[] {
  if (typeof window === "undefined") return [];

  const favorites = localStorage.getItem(STORAGE_KEY);

  return favorites ? JSON.parse(favorites) : [];
}

export function isFavorite(id: number) {
  return getFavorites().includes(id);
}

export function toggleFavorite(id: number) {
  const favorites = getFavorites();

  const updated = favorites.includes(id)
    ? favorites.filter((favoriteId) => favoriteId !== id)
    : [...favorites, id];

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );

  window.dispatchEvent(new Event("favoritesUpdated"));
  return updated;
}