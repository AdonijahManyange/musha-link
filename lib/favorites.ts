const FAVORITES_KEY = "musha-favorites";

export function getFavorites(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(
      FAVORITES_KEY
    );

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map(String);
  } catch (error) {
    console.error(
      "Failed to load favorites:",
      error
    );

    return [];
  }
}

function saveFavorites(
  favoriteIds: string[]
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    FAVORITES_KEY,
    JSON.stringify(favoriteIds)
  );
}

export function toggleFavorite(
  listingId: string
): string[] {
  const favorites = getFavorites();

  if (favorites.includes(listingId)) {
    const updatedFavorites =
      favorites.filter(
        (id) => id !== listingId
      );

    saveFavorites(updatedFavorites);

    return updatedFavorites;
  }

  const updatedFavorites = [
    ...favorites,
    listingId,
  ];

  saveFavorites(updatedFavorites);

  return updatedFavorites;
}

export function isFavorite(
  listingId: string
): boolean {
  return getFavorites().includes(
    listingId
  );
}