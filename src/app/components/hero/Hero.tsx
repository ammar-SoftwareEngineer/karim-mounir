"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import SplitType from "split-type";
import { useLocale } from "next-intl";
import { Banner } from "@/types/homeApiTypes";

export default function Hero({ banner }: { banner: Banner }) {
  const container = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const locale = useLocale();
  const isArabic = locale === "ar";

  const titleText = `${banner.title} `;

  useGSAP(
    () => {
      const video = bgRef.current;
      const title = titleRef.current;
      if (!video || !title) return;

      gsap.set(video, { opacity: 0 });

      const split = new SplitType(title, {
        types: isArabic ? "lines,words" : "lines,chars",
        lineClass: "line",
        ...(isArabic ? { wordClass: "word" } : { charClass: "char" }),
      });

      const targets = (isArabic ? split.words : split.chars) ?? [];
      const animateTargets = targets.length > 0 ? targets : [title];

      gsap.set(animateTargets, {
        opacity: 0,
        y: 28,
        filter: "blur(10px)",
      });

      const animateIn = () => {
        gsap.to(video, {
          opacity: 1,
          duration: 1.4,
          ease: "power2.out",
        });

        gsap.to(animateTargets, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: isArabic ? 1.4 : 2,
          stagger: isArabic ? 0.12 : 0.045,
          ease: "power3.out",
          delay: 0.5,
        });
      };

      if (video.readyState >= 2) {
        animateIn();
      } else {
        video.addEventListener("canplay", animateIn, { once: true });
      }

      return () => {
        video.removeEventListener("canplay", animateIn);
        split.revert();
      };
    },
    { scope: container, dependencies: [titleText, locale] },
  );

  return (
    <main
      ref={container}
      className="hero relative h-screen overflow-hidden bg-gradient-to-br from-black via-neutral-900 to-black flex flex-col items-center justify-center px-4"
    >
      <div className="parallax">
        <video
          ref={bgRef}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out will-change-transform opacity-0"
          style={{ transform: "scale(1.02)" }}
          src="/Concept.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden
        />
      </div>

      <h1
        ref={titleRef}
        dir={isArabic ? "rtl" : "ltr"}
        className={`relative z-10 w-full px-0 md:px-12 mx-auto text-center font-medium text-3xl md:text-6xl capitalize leading-relaxed md:leading-loose lg:leading-[1.55] [&_.line]:block [&_.line:not(:last-child)]:mb-3 md:[&_.line:not(:last-child)]:mb-5 ${
          isArabic
            ? "[&_.word]:inline-block [&_.word]:opacity-0"
            : "[&_.char]:inline-block [&_.char]:opacity-0"
        }`}
      >
        {titleText}
      </h1>
    </main>
  );
}
