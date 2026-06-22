"use client";

import { useLocale } from "next-intl";
import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import Image from "next/image";
import { AboutStruct, About as AboutType } from "@/types/homeApiTypes";
import { FadeInWords } from "@/app/[locale]/about/AboutPage";

gsap.registerPlugin(ScrollTrigger);

export default function About({ about, about_structs }: { about: AboutType, about_structs: AboutStruct[] }) {
  function useIsDesktop() {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
      const check = () => setIsDesktop(window.innerWidth >= 1024);
      check();
      window.addEventListener("resize", check);
      return () => window.removeEventListener("resize", check);
    }, []);

    return isDesktop;
  }

  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const visionRef = useRef<HTMLDivElement | null>(null);
  const ownerSectionRef = useRef<HTMLDivElement | null>(null);

  const locale = useLocale();
  const isRTL = locale === "ar";
  const isDesktop = useIsDesktop();

  const [visionVisible, setVisionVisible] = useState(false);
  const [ownerVisible, setOwnerVisible] = useState(false);

  /* ===============================
     GSAP HORIZONTAL SCROLL (useGSAP)
  =============================== */
  useGSAP(
    () => {
      if (!isDesktop) return;
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
      dependencies: [isDesktop, isRTL],
    },
  );

  /* ===============================
     INTERSECTION OBSERVERS
  =============================== */
  useEffect(() => {
    if (!visionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setVisionVisible(entries[0].isIntersecting);
      },
      { threshold: 0.4 },
    );

    observer.observe(visionRef.current);
    return () => observer.disconnect();
  }, [isDesktop]);

  useEffect(() => {
    if (!ownerSectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setOwnerVisible(entries[0].isIntersecting);
      },
      { threshold: 0.4 },
    );

    observer.observe(ownerSectionRef.current);
    return () => observer.disconnect();
  }, [isDesktop]);

  return (
    <>
      {isDesktop ? (
        <div ref={containerRef} className="scroll-section-outer">
          <div ref={scrollContainerRef} className="scroll-section-inner">
            {/* OUR VISION */}
            <div
              ref={visionRef}
              className="scroll-section-horizontaliy bg-gradient-to-b from-[var(--color-dark-gray)] via-[color-mix(in_srgb,var(--color-dark-gray)_70%,var(--color-primary))] to-[var(--color-primary)] relative overflow-hidden will-change-transform"
            >
              <div className="vision-content max-w-[900px] mx-auto px-8 py-8 lg:py-0 text-center relative z-10 w-full">
                {/* <h2
                  className="vision-title text-5xl md:text-8xl font-bold uppercase text-main-white mb-8 transition-all duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
                  style={{
                    opacity: visionVisible ? 1 : 0,
                    transform: visionVisible
                      ? "translateY(0px) scale(1)"
                      : "translateY(24px) scale(0.98)",
                    filter: visionVisible ? "blur(0px)" : "blur(12px)",
                    transitionDelay: visionVisible ? "200ms" : "0ms",
                  }}
                  dangerouslySetInnerHTML={{ __html: about_structs[0].title }}
                /> */}

                <div className="vision-para-1 text-xl md:text-3xl text-gray-200 leading-relaxed mb-6 !text-justify [&_p]:!text-justify">
                  <FadeInWords text={about_structs[0].text} />
                </div>
              </div>
            </div>

            {/* OWNER SECTION */}
            <div
              ref={ownerSectionRef}
              className="scroll-section-horizontaliy bg-gradient-to-b from-[var(--color-dark-gray)] via-[color-mix(in_srgb,var(--color-dark-gray)_70%,var(--color-primary))] to-[var(--color-primary)] will-change-transform"
            >
              <div className="flex flex-col lg:flex-row items-center justify-center gap-12 px-8 py-8 lg:py-0 max-w-7xl mx-auto w-full">
                <div className="relative">
                  <div
                    className="owner-image-container relative w-80 h-96 lg:w-96 lg:h-[500px] overflow-hidden transition-all duration-[1200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
                    style={{
                      opacity: ownerVisible ? 1 : 0,
                      transform: ownerVisible
                        ? "scale(1) translateY(0px)"
                        : "scale(1.12) translateY(24px)",
                      filter: ownerVisible ? "blur(0px)" : "blur(10px)",
                      transitionDelay: ownerVisible ? "400ms" : "0ms",
                    }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        clipPath:
                          "polygon(30% 0%, 100% 0%, 100% 70%, 70% 100%, 0% 100%, 0% 30%)",
                      }}
                    >
                      <Image
                        src={about.image}
                        alt={about.alt_image || "Karim Mounir Picture"}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>

                  <div
                    className="absolute inset-0 border-4 border-main-white shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-[1200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
                    style={{
                      opacity: ownerVisible ? 1 : 0,
                      transform: ownerVisible ? "scale(1)" : "scale(0.9)",
                      filter: ownerVisible ? "blur(0px)" : "blur(8px)",
                      transitionDelay: ownerVisible ? "350ms" : "0ms",
                      clipPath:
                        "polygon(30% 0%, 100% 0%, 100% 70%, 70% 100%, 0% 100%, 0% 30%)",
                    }}
                  />
                </div>

                <div className="flex-1 max-w-4xl about-animate">
                  {/* <h2 className="text-4xl md:text-5xl font-bold text-main-white mb-4">
                    {about.title}
                  </h2> */}

                  <div
                    className="text-base md:text-xl text-gray-300 leading-relaxed mb-6 !text-justify [&_p]:!text-justify"
                    dangerouslySetInnerHTML={{ __html: about.text }}
                  />

                  <h3
                    className={`text-end !text-2xl md:!text-5xl text-gray-200 font-semibold ${
                      locale === "ar" ? "text-start" : "text-end"
                    }`}
                    dangerouslySetInnerHTML={{ __html: about.title2 }}
                  />

                  <h3
                    className={`!text-lg text-gray-200 font-semibold capitalize ${locale === "ar" ? "text-start" : "text-end"}`}
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
      ) : (
        <div className="flex flex-col gap-10 lg:gap-24 bg-gradient-to-b from-[var(--color-dark-gray)] via-[color-mix(in_srgb,var(--color-dark-gray)_70%,var(--color-primary))] to-[var(--color-primary)] min-h-fit">
          <div
            ref={visionRef}
            className="px-6 pt-24 pb-6 lg:py-24 text-center w-full min-h-fit"
          >
            {/* <h2
              className="text-4xl font-bold text-main-white mb-4 transition-all duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
              style={{
                opacity: visionVisible ? 1 : 0,
                transform: visionVisible
                  ? "translateY(0px) scale(1)"
                  : "translateY(24px) scale(0.98)",
                filter: visionVisible ? "blur(0px)" : "blur(12px)",
                transitionDelay: visionVisible ? "200ms" : "0ms",
              }}
              dangerouslySetInnerHTML={{ __html: about_structs[0].title }}
            /> */}
            <div className="text-xl text-gray-300 leading-relaxed !text-center">
              <FadeInWords text={about_structs[0].text} />
            </div>
          </div>

          <div
            ref={ownerSectionRef}
            className="px-6 pb-6 lg:pb-24 flex flex-col items-center text-center w-full min-h-fit"
          >
            <div className="relative mb-8">
              <div
                className="relative w-72 h-96 overflow-hidden transition-all duration-[1200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
                style={{
                  opacity: ownerVisible ? 1 : 0,
                  transform: ownerVisible
                    ? "scale(1) translateY(0px)"
                    : "scale(1.12) translateY(24px)",
                  filter: ownerVisible ? "blur(0px)" : "blur(10px)",
                  transitionDelay: ownerVisible ? "350ms" : "0ms",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    clipPath:
                      "polygon(30% 0%, 100% 0%, 100% 70%, 70% 100%, 0% 100%, 0% 30%)",
                  }}
                >
                  <Image
                    src={about.image}
                    alt={about.alt_image || "Owner"}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              <div
                className="absolute inset-0 border-4 border-main-white shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-[1200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
                style={{
                  opacity: ownerVisible ? 1 : 0,
                  transform: ownerVisible ? "scale(1)" : "scale(0.9)",
                  filter: ownerVisible ? "blur(0px)" : "blur(8px)",
                  transitionDelay: ownerVisible ? "800ms" : "0ms",
                  clipPath:
                    "polygon(30% 0%, 100% 0%, 100% 70%, 70% 100%, 0% 100%, 0% 30%)",
                }}
              />
            </div>

            {/* <h2
              className="text-start w-full sm:text-center text-3xl font-bold text-main-white mb-2 transition-all duration-[1200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
              style={{
                opacity: ownerVisible ? 1 : 0,
                transform: ownerVisible
                  ? "translateY(0px) scale(1)"
                  : "translateY(24px) scale(0.98)",
                filter: ownerVisible ? "blur(0px)" : "blur(12px)",
                transitionDelay: ownerVisible ? "1600ms" : "0ms",
              }}
            >
              {about.title}
            </h2> */}

            <div
              className="text-center text-base text-gray-300 leading-relaxed mb-4 transition-all duration-[1200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] [&_p]:!text-center"
              style={{
                opacity: ownerVisible ? 1 : 0,
                transform: ownerVisible
                  ? "translateY(0px)"
                  : "translateY(28px)",
                filter: ownerVisible ? "blur(0px)" : "blur(10px)",
                transitionDelay: ownerVisible ? "2100ms" : "0ms",
              }}
              dangerouslySetInnerHTML={{ __html: about.text }}
            />

            <h3
              className="text-start sm:text-center owner-subtitle text-4xl lg:text-5xl text-gray-200 font-semibold transition-all duration-[1200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
              style={{
                opacity: ownerVisible ? 1 : 0,
                transform: ownerVisible
                  ? "translateY(0px)"
                  : "translateY(26px)",
                filter: ownerVisible ? "blur(0px)" : "blur(10px)",
                transitionDelay: ownerVisible ? "3100ms" : "0ms",
              }}
              dangerouslySetInnerHTML={{ __html: about.title2 }}
            />

            <h3
              className="text-start sm:text-center text-sm lg:text-lg text-gray-200 font-semibold transition-all duration-[1200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
              style={{
                opacity: ownerVisible ? 1 : 0,
                transform: ownerVisible
                  ? "translateY(0px)"
                  : "translateY(26px)",
                filter: ownerVisible ? "blur(0px)" : "blur(10px)",
                transitionDelay: ownerVisible ? "3100ms" : "0ms",
              }}
            >
              {locale === "ar"
                ? "المؤسس و المهندس المعمارى الرئيسي"
                : "Design Leader & Principal Architect"}
            </h3>
          </div>
        </div>
      )}
    </>
  );
}
