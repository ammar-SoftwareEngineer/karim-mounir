"use client";

import React, { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";

interface InfiniteCarouselProps {
  /** Array of images to display in the carousel */
  images: StaticImageData[];
  /** Height of the carousel (e.g., '400px', '50vh', '100svh') */
  height?: string;
  /** Animation duration in seconds (default: 60s) */
  duration?: number;
  /** Background color (default: 'white') */
  backgroundColor?: string;
  /** Image width in rem (default: 30) */
  imageWidth?: number;
  /** Image height in rem (default: 30) */
  imageHeight?: number;
}

export default function InfiniteCarousel({
  images,
  duration = 60,
  imageWidth = 25,
  imageHeight = 25,
}: InfiniteCarouselProps) {
  const [selectedImage, setSelectedImage] = useState<StaticImageData | null>(
    null,
  );
  const totalImages = images.length;
  const trackWidth = imageWidth;

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [selectedImage]);

  return (
    <>
      <section
        className="relative w-full overflow-hidden mt-16 py-12"
        style={{ height: `${imageHeight + 9}rem` }}
      >
        <div
          className="carousel-track relative"
          style={{
            minWidth: `calc(${imageWidth}rem * ${totalImages})`,
          }}
        >
          {images.map((item, index) => (
            <div
              key={index}
              className="carousel-item absolute flex justify-center cursor-pointer transition-all duration-500 ease-in-out"
              style={{
                width: `${imageWidth}rem`,
                left: "100%",
                perspective: "1000px",
                transformStyle: "preserve-3d",
                animation: `scroll-left ${duration}s linear infinite`,
                animationDelay: `calc(${duration}s / ${totalImages} * ${index} - ${duration}s)`,
                willChange: "left",
              }}
              onClick={() => setSelectedImage(item)}
            >
              <Image
                src={item}
                alt={"Carousel Image " + (index + 1)}
                width={imageWidth * 10}
                height={imageHeight * 10}
                className="w-full h-full object-cover bg-white transition-all duration-500 ease-in-out hover:scale-105"
                style={{
                  transform: "rotateY(-45deg)",
                  maskImage:
                    "linear-gradient(to bottom, black 70%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, black 70%, transparent 100%)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "rotateY(0deg) translateY(-1rem)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "rotateY(-45deg)";
                }}
              />
            </div>
          ))}
        </div>

        <style jsx>{`
          @keyframes scroll-left {
            to {
              left: -${trackWidth}rem;
            }
          }
        `}</style>
      </section>

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute right-4 top-20 md:top-20 lg:right-20 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover:scale-110"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Image container */}
          <div
            className="relative max-w-5xl w-full mx-4 h-[80vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt="Full size image"
              width={2000}
              height={2000}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
