"use client";

import { useEffect, useState } from "react";
import {
  getFavorites,
  toggleFavorite,
} from "@/lib/favorites";

type FavoriteButtonProps = {
  listingId: string;
};

export default function FavoriteButton({
  listingId,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] =
    useState(false);

  useEffect(() => {
    const favorites = getFavorites();

    setIsFavorite(
      favorites.includes(listingId)
    );
  }, [listingId]);

  function handleToggleFavorite() {
    const updatedFavorites =
      toggleFavorite(listingId);

    setIsFavorite(
      updatedFavorites.includes(listingId)
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggleFavorite}
      aria-label={
        isFavorite
          ? "Remove from saved listings"
          : "Save listing"
      }
      className={`flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm transition ${
        isFavorite
          ? "bg-white text-red-500 shadow-md"
          : "bg-white/90 text-slate-700 shadow-sm hover:bg-white hover:text-red-500"
      }`}
    >
      <span className="text-xl leading-none">
        {isFavorite ? "♥" : "♡"}
      </span>
    </button>
  );
}