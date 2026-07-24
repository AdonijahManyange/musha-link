"use client";


import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import {
  isFavorite,
  toggleFavorite,
} from "@/lib/favorites";

type FavoriteButtonProps = {
  listingId: number;
};

export default function FavoriteButton({
  listingId,
}: FavoriteButtonProps) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    setFavorite(isFavorite(listingId));
  }, [listingId]);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    toggleFavorite(listingId);
    setFavorite(isFavorite(listingId));
  }

  return (
    <button
        onClick={handleClick}
        aria-label="Save listing"
        className="rounded-full bg-white p-2 shadow-lg transition duration-200 hover:scale-110 hover:shadow-xl"
    >
      <Heart
        size={22}
        className={`transition-all duration-200 ${
            favorite
            ? "fill-red-500 text-red-500 scale-110"
            : "text-slate-700"
        }`}
      />
    </button>
  );
}