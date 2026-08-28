"use client";

import { useState } from "react";
import { Home } from "lucide-react";

type ListingPhoto = {
  id: string;
  url: string;
  isCover: boolean;
};

type ListingGalleryProps = {
  photos: ListingPhoto[];
  title: string;
};

export default function ListingGallery({
  photos,
  title,
}: ListingGalleryProps) {
  const coverPhoto =
    photos.find((photo) => photo.isCover) || photos[0];

  const [selectedPhoto, setSelectedPhoto] =
    useState(coverPhoto);

  if (!selectedPhoto) {
    return (
      <div className="flex h-[280px] items-center justify-center rounded-2xl bg-slate-200 sm:h-[400px] lg:h-[500px]">
        <div className="text-center text-slate-500">
          <Home
            size={48}
            className="mx-auto"
          />

          <p className="mt-3 font-medium">
            No photos available
          </p>
        </div>
      </div>
    );
  }

  return (
    <section>
      {/* ====================================================
          MAIN PHOTO
      ==================================================== */}

      <div className="relative overflow-hidden rounded-2xl bg-slate-200 shadow-sm">
        <div className="h-[280px] sm:h-[400px] lg:h-[500px]">
          <img
            src={selectedPhoto.url}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* ====================================================
          THUMBNAIL STRIP
      ==================================================== */}

      {photos.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {photos.map((photo) => {
            const isSelected =
              photo.id === selectedPhoto.id;

            return (
              <button
                key={photo.id}
                type="button"
                onClick={() =>
                  setSelectedPhoto(photo)
                }
                aria-label={`View photo ${
                  photos.indexOf(photo) + 1
                }`}
                aria-pressed={isSelected}
                className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition sm:h-20 sm:w-24 ${
                  isSelected
                    ? "border-brand-blue"
                    : "border-transparent hover:border-slate-300"
                }`}
              >
                <img
                  src={photo.url}
                  alt={`${title} photo ${
                    photos.indexOf(photo) + 1
                  }`}
                  className="h-full w-full object-cover transition hover:scale-105"
                />
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}