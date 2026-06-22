"use client";
import Image, { StaticImageData } from "next/image";
import { useRef, useEffect } from "react";
import ReactLenis, { useLenis } from "lenis/react";

const lerp = (start: number, end: number, factor: number) =>
  start + (end - start) * factor;
export default function ParallaxImage({
  src,
  alt,
}: {
  src: string | StaticImageData;
  alt: string;
}) {
  const imageRef = useRef<HTMLImageElement>(null);
  const bound = useRef<{ top: number; bottom: number } | null>(null);
  const currentTranslateY = useRef(0);
  const targetTranslateY = useRef(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const updateBounds = () => {
      if (imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        bound.current = {
          top: rect.top + window.scrollY,
          bottom: rect.bottom + window.scrollY,
        };
      }
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);

    const animate = () => {
      if (imageRef.current) {
        currentTranslateY.current = lerp(
          currentTranslateY.current,
          targetTranslateY.current,
          0.1
        );

        if (
          Math.abs(currentTranslateY.current - targetTranslateY.current) > 0.01
        ) {
          imageRef.current.style.transform = `translateY(${currentTranslateY.current}px) scale(1.25)`;
        }
      }

      rafId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", updateBounds);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  useLenis(({ scroll }) => {
    if(!bound.current) return;
    const relativeScroll = scroll - bound.current.top;
    targetTranslateY.current = relativeScroll * 0.2;
  });

  return (
    <Image
      ref={imageRef}
      src={src}
      alt={alt}
      width={1920}
      height={1080}
      style={{
        willChange: "transform",
        transform: "translateY(0) scale(1.25)",
      }}
    />
  );
}
