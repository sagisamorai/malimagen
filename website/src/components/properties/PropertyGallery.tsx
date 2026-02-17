"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft, X, Camera } from "lucide-react";
import type { PropertyImage } from "@/types";

interface PropertyGalleryProps {
  images: PropertyImage[];
  title: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <div className="aspect-video bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
        אין תמונות
      </div>
    );
  }

  const goNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  const goPrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  // Single image
  if (images.length === 1) {
    return (
      <>
        <div
          className="relative aspect-[16/9] rounded-2xl overflow-hidden cursor-pointer group"
          onClick={() => setSelectedIndex(0)}
        >
          <Image
            src={images[0].url}
            alt={images[0].alt || title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="100vw"
            priority
          />
        </div>
        <Lightbox
          images={images}
          title={title}
          selectedIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          onNext={goNext}
          onPrev={goPrev}
        />
      </>
    );
  }

  // Two images
  if (images.length === 2) {
    return (
      <>
        <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden">
          {images.map((image, i) => (
            <div
              key={image.id}
              className="relative aspect-[4/3] cursor-pointer group"
              onClick={() => setSelectedIndex(i)}
            >
              <Image
                src={image.url}
                alt={image.alt || title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="50vw"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
        <Lightbox
          images={images}
          title={title}
          selectedIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          onNext={goNext}
          onPrev={goPrev}
        />
      </>
    );
  }

  // Three or more images
  const sideImages = images.slice(1, 5);
  const moreCount = images.length - 5;

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden h-[450px]">
        {/* Main large image */}
        <div
          className="col-span-2 row-span-2 relative cursor-pointer group"
          onClick={() => setSelectedIndex(0)}
        >
          <Image
            src={images[0].url}
            alt={images[0].alt || title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Side images */}
        {sideImages.map((image, i) => (
          <div
            key={image.id}
            className="relative cursor-pointer group"
            onClick={() => setSelectedIndex(i + 1)}
          >
            <Image
              src={image.url}
              alt={image.alt || title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            {/* "Show more" overlay on last side image */}
            {i === sideImages.length - 1 && moreCount > 0 && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1 hover:bg-black/40 transition-colors">
                <Camera className="w-6 h-6 text-white" />
                <span className="text-white text-sm font-bold">
                  +{moreCount} תמונות
                </span>
              </div>
            )}
          </div>
        ))}

        {/* Fill empty slots if less than 5 images */}
        {sideImages.length < 4 &&
          Array.from({ length: 4 - sideImages.length }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-gray-100" />
          ))}
      </div>

      {/* View all button */}
      {images.length > 1 && (
        <button
          onClick={() => setSelectedIndex(0)}
          className="mt-3 flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
        >
          <Camera className="w-4 h-4" />
          צפה בכל {images.length} התמונות
        </button>
      )}

      <Lightbox
        images={images}
        title={title}
        selectedIndex={selectedIndex}
        onClose={() => setSelectedIndex(null)}
        onNext={goNext}
        onPrev={goPrev}
      />
    </>
  );
}

function Lightbox({
  images,
  title,
  selectedIndex,
  onClose,
  onNext,
  onPrev,
}: {
  images: PropertyImage[];
  title: string;
  selectedIndex: number | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  if (selectedIndex === null) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 text-white/70 p-2 hover:bg-white/10 rounded-full z-10 hover:text-white transition-colors"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Counter */}
      <div className="absolute top-5 right-5 text-white/60 text-sm font-medium z-10">
        {selectedIndex + 1} / {images.length}
      </div>

      {/* Prev */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 p-3 hover:bg-white/10 rounded-full z-10 hover:text-white transition-colors"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Next */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 p-3 hover:bg-white/10 rounded-full z-10 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      {/* Image */}
      <div
        className="relative w-full max-w-5xl aspect-[16/10] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[selectedIndex].url}
          alt={images[selectedIndex].alt || title}
          fill
          className="object-contain"
          sizes="100vw"
        />
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto px-4 py-2"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => {
                const idx = i;
                onClose();
                setTimeout(() => {
                  const el = document.querySelector(`[data-lightbox-idx="${idx}"]`);
                  if (el) (el as HTMLElement).click();
                }, 50);
              }}
              className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                i === selectedIndex
                  ? "border-white opacity-100"
                  : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <Image
                src={img.url}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
