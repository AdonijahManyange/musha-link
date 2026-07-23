"use client";

import { useState } from "react";
import Image from "next/image";

type ImageGalleryProps = {
  images: string[];
  title: string;
};

export default function ImageGallery({
  images,
  title,
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(
    images[0] ?? "/images/placeholder.jpg"
  );

  return (
    <div>
      {/* Main Image */}
      <div className="relative h-[560px] w-full overflow-hidden rounded-3xl shadow-lg">
        <Image
          src={selectedImage}
          alt={title}
          fill
          priority
          className="object-cover transition duration-300"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-4 flex gap-4 overflow-x-auto">
          {images.map((image, index) => (
            <button
              type="button"
              key={index}
              onClick={() => setSelectedImage(image)}
              className={`relative h-24 w-32 overflow-hidden rounded-xl border-2 transition ${
                selectedImage === image
                  ? "border-brand-blue scale-105"
                  : "border-transparent hover:border-slate-300"
              }`}
            >
              <Image
                src={image}
                alt={`${title} ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}