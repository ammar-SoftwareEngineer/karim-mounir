"use client";

import { useLocale } from "next-intl";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { AboutStruct, About as AboutType } from "@/types/homeApiTypes";
import { FadeInWords } from "@/app/[locale]/about/AboutPage";

gsap.registerPlugin(ScrollTrigger);

export default function About({
  about,
  about_structs,
}: {
  about: AboutType;
  about_structs: AboutStruct[];
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const visionRef = useRef<HTMLDivElement | null>(null);
  const ownerSectionRef = useRef<HTMLDivElement | null>(null);

  const locale = useLocale();
  const isRTL = locale === "ar";

  /* ===============================
     GSAP HORIZONTAL SCROLL (useGSAP)
  =============================== */
  useGSAP(
    () => {
      if (!containerRef.current || !scrollContainerRef.current) return;

      const sections = gsap.utils.toArray<HTMLElement>(
        ".scroll-section-horizontaliy",
      );

      ScrollTrigger.refresh();

      const horizontalScrollLength =
        scrollContainerRef.current.offsetWidth - window.innerWidth;

      const pauseDuration = window.innerHeight * 0.3;

      gsap.set(sections, {
        xPercent: isRTL ? 100 : -100 * (sections.length - 1),
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            pin: true,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 0,
            refreshPriority: 1,
            end: () => "+=" + (horizontalScrollLength + pauseDuration * 2),
            invalidateOnRefresh: true,
          },
        })
        .to({}, { duration: pauseDuration })
        .to(sections, {
          xPercent: 0,
          ease: "none",
          duration: horizontalScrollLength,
        })
        .to({}, { duration: pauseDuration });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 15%",
          toggleActions: "play reverse play reverse",
        },
      });

      tl.from(".about-animate > *", {
        y: 120,
        opacity: 0,
        duration: 3.5,
        ease: "power4.out",
        stagger: 0.6,
        filter: "blur(5px)",
        scale: 1.2,
      });
    },
    {
      scope: containerRef,
      dependencies: [isRTL],
    },
  );

  return (
    <div ref={containerRef} className="scroll-section-outer about">
      <div ref={scrollContainerRef} className="scroll-section-inner">
        {/* OUR VISION */}
        <div
          ref={visionRef}
          className="scroll-section-horizontaliy about-panel about-panel--vision bg-gradient-to-b from-[var(--color-dark-gray)] via-[color-mix(in_srgb,var(--color-dark-gray)_70%,var(--color-primary))] to-[var(--color-primary)] relative overflow-hidden will-change-transform"
        >

          <div className="vision-content max-w-[900px] mx-auto px-6 lg:px-8 py-6 lg:py-0 text-center relative z-10 w-full">
            <div className="vision-para-1 text-xl md:text-3xl text-gray-200 leading-relaxed mb-6 !text-justify [&_p]:!text-justify max-lg:!text-center max-lg:[&_p]:!text-center">
              <FadeInWords text={about_structs[0].text} />
            </div>
          </div>
        </div>

        {/* OWNER SECTION */}
        <div
          ref={ownerSectionRef}
          className="scroll-section-horizontaliy about-panel about-panel--owner bg-gradient-to-b"
        >
          <div className="flex flex-col lg:flex-row items-center ltr:justify-end rtl:justify-start gap-8 lg:gap-12 px-0 lg:px-8 py-0 max-w-6xl mx-auto w-full max-lg:justify-center">
          <div className="about-panel-mobile-visual lg:hidden" aria-hidden="true" />
            <div className="relative hidden lg:block" />

            <div className="rtl:max-w-sm ltr:max-w-md about-animate w-full">
              <div
                className="text-base md:text-xl text-gray-300 leading-relaxed mb-6 !text-justify [&_p]:!text-justify max-lg:!text-center max-lg:[&_p]:!text-center"
                dangerouslySetInnerHTML={{ __html: about.text }}
              />

              <h3
                className={`text-end !text-2xl md:!text-5xl text-gray-200 font-semibold max-lg:text-center ${locale === "ar" ? "text-start max-lg:text-center" : "text-end"}`}
                dangerouslySetInnerHTML={{ __html: about.title2 }}
              />

              <h3
                className={`!text-sm lg:!text-lg text-gray-200 font-semibold capitalize max-lg:text-center ${locale === "ar" ? "text-start max-lg:text-center" : "text-end"}`}
              >
                {locale === "ar"
                  ? "المؤسس و المهندس المعمارى الرئيسي"
                  : "Design Leader & Principal Architect"}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
