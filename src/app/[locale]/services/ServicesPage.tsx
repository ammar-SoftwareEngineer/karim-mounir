"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { FadeInWords, TextReveal } from "../about/AboutPage";
import { ServicesResponse } from "@/types/servicesApiTypes";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, ArrowLeft } from "lucide-react";
gsap.registerPlugin(ScrollTrigger);

export default function ServicesPage({ servicesApiData }: { servicesApiData: ServicesResponse }) {
  const heroRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<(HTMLDivElement | null)[]>([]);
  const integratedRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const floatingShapes = useRef<(HTMLDivElement | null)[]>([]);
  const [mounted, setMounted] = useState(false);
  const locale = useLocale();
  const t = useTranslations("home");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const ctx = gsap.context(() => {
      if (heroRef.current) {
        const heroTimeline = gsap.timeline({ delay: 0.3 });
        heroTimeline
          .from(heroRef.current.querySelector("h1"), {
            opacity: 0,
            y: 30,
            duration: 1.4,
            ease: "power2.out",
            delay: 0.8,
          })
          .from(
            heroRef.current.querySelector("p"),
            {
              opacity: 0,
              y: 20,
              duration: 1.2,
              ease: "power2.out",
            },
            "-=0.8",
          );
      }

      // Floating shapes animations - very gentle
      floatingShapes.current.forEach((shape, index) => {
        if (shape) {
          gsap.to(shape, {
            y: "random(-15, 15)",
            x: "random(-8, 8)",
            rotation: "random(-3, 3)",
            duration: "random(20, 30)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: index * 3,
          });
        }
      });

      // Pulse animations for gradient blobs - subtle
      const blobs = document.querySelectorAll(".gradient-blob");
      blobs.forEach((blob, index) => {
        gsap.to(blob, {
          opacity: 0.12,
          duration: 5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 2.5,
        });
      });

      // Services animations - cinematic reveal
      servicesRef.current.forEach((service, index) => {
        if (service) {
          const isLeft = index % 2 === 0;

          const serviceTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: service,
              start: "top 90%",
              end: "top 20%",
              toggleActions: "play none none reverse",
            },
          });

          // Main container
          serviceTimeline.from(service, {
            opacity: 0,
            x: isLeft ? -120 : 120,
            scale: 0.9,
            duration: 1.8,
            ease: "power4.out",
            transformPerspective: 1000,
          });

          // Title - character-by-character reveal (split by words first to prevent breaking words on wrap)
          const title = service.querySelector("h3");
          if (title) {
            const titleText = title.textContent || "";
            if (locale === "ar") {
              const words = titleText.split(" ");
              title.innerHTML = words
                .map(
                  (word) =>
                    `<span class="char-span inline-block whitespace-nowrap">${word}&nbsp;</span>`,
                )
                .join("");
            } else {
              const words = titleText.split(" ");
              title.innerHTML = words
                .map(
                  (word) =>
                    `<span class="inline-block whitespace-nowrap">${word
                      .split("")
                      .map(
                        (char) =>
                          `<span class="char-span inline-block">${char === " " ? "&nbsp;" : char}</span>`,
                      )
                      .join("")}&nbsp;</span>`,
                )
                .join("");
            }
            serviceTimeline.from(
              title.querySelectorAll(".char-span"),
              {
                opacity: 0,
                y: 40,
                rotationX: -90,
                transformOrigin: "50% 50% -20px",
                stagger: {
                  each: 0.03,
                  from: isLeft ? "start" : "end",
                },
                duration: 0.8,
                ease: "back.out(1.2)",
              },
              "-=1.4",
            );
          }

          // Subtitle
          const subtitle = service.querySelector(".service-subtitle");
          if (subtitle) {
            serviceTimeline.from(
              subtitle,
              {
                opacity: 0,
                filter: "blur(10px)",
                y: 20,
                duration: 1,
                ease: "power2.out",
              },
              "-=1.2",
            );
          }

          // Line
          const line = service.querySelector(".service-line");
          if (line) {
            serviceTimeline.from(
              line,
              {
                scaleX: 0,
                opacity: 0,
                transformOrigin: isLeft ? "left center" : "right center",
                duration: 1.4,
                ease: "power3.inOut",
              },
              "-=0.8",
            );
          }

          // Image reveal
          const image = service.querySelector(".service-image-container");
          if (image) {
            serviceTimeline.from(
              image,
              {
                opacity: 0,
                scale: 1.2,
                x: isLeft ? 200 : -200,
                duration: 1.5,
                ease: "power3.out",
              },
              "-=1",
            );
          }

          // Description - reveal to preserve HTML structure
          const description = service.querySelector(".service-description");
          if (description) {
            serviceTimeline.from(
              description,
              {
                opacity: 0,
                y: 20,
                filter: "blur(8px)",
                duration: 1.2,
                ease: "power2.out",
              },
              "-=1.5",
            );
          }

        }
      });

      // Integrated section animation
      if (integratedRef.current) {
        const children = integratedRef.current.children;
        gsap.from(children, {
          scrollTrigger: {
            trigger: integratedRef.current,
            start: "top 65%",
          },
          opacity: 0,
          y: 30,
          duration: 1.2,
          stagger: 0.25,
          ease: "power2.out",
        });
      }

      // CTA animation
      if (ctaRef.current) {
        gsap.from(ctaRef.current, {
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 65%",
          },
          opacity: 0,
          y: 40,
          duration: 1.4,
          ease: "power2.out",
        });
      }
    });

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [mounted]);

  const breadcrumbSection = servicesApiData.data.services_page_section.find(
    (item) => item.key === "services_page_breadcrumb",
  );

  const integratedSection = servicesApiData.data.services_page_section.find(
    (item) => item.key === "services_page_section",
  );

  const exploreSection = servicesApiData.data.services_page_section.find(
    (item) => item.key === "explore_our_works_section",
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white overflow-hidden">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center items-center px-6 py-20 z-10"
      >
        <div className="max-w-6xl text-center relative z-10">
          <div className="text-5xl md:text-8xl font-medium tracking-tight mb-2">
            <FadeInWords text={breadcrumbSection?.title} />
          </div>

          <div className="text-xl md:text-3xl text-neutral-400 font-light tracking-wide mb-1 capitalize">
            <TextReveal>
              <div
                dangerouslySetInnerHTML={{
                  __html: breadcrumbSection?.long_desc,
                }}
              />
            </TextReveal>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section relative py-5 px-6 z-10 min-h-fit">
        <div className="max-w-7xl mx-auto space-y-[100px] md:space-y-[250px] 2xl:space-y-[300px]">
          {servicesApiData.data.services.map((service, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div
                key={service.id}
                ref={(el) => {
                  servicesRef.current[index] = el;
                }}
                className={`flex flex-col md:flex-row items-center gap-12 2xl:gap-24 ${
                  isLeft ? "" : "md:flex-row-reverse"
                }`}
                style={{ perspective: "1000px" }}
              >
                {/* Text Content */}
                <div className="flex-1 space-y-8 text-start w-full md:max-w-[50%]">
                  <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl font-extralight text-white tracking-tight leading-tight whitespace-normal">
                      {service.name}
                    </h3>
                    <p className="service-subtitle text-base tracking-[0.25em] uppercase text-gray-500 font-light">
                      {service.short_desc}
                    </p>
                  </div>
                  <div
                    className={`service-line h-px w-56 bg-gradient-to-r from-transparent via-white/20 to-white/40`}
                  ></div>
                  <div
                    className="service-description text-lg md:text-xl text-gray-300/90 leading-[1.9] font-light capitalize"
                    dangerouslySetInnerHTML={{ __html: service.long_desc }}
                  ></div>
                </div>

                {/* Image Content */}
                <div className="service-image-container -mt-2 sm:mt-0 flex-1 w-full aspect-[4/3] md:aspect-[3/4] lg:aspect-[4/3] relative overflow-hidden rounded-2xl border border-white/10 group">
                  <Image
                    src={service.image}
                    alt={service.alt_image || service.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Integrated Approach Section */}
      <section className="relative py-32 px-6 z-10 flex justify-center items-center min-h-fit">
        <div ref={integratedRef} className="max-w-4xl mx-auto text-center">
          <div className="mb-8 flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div className="w-2 h-2 bg-white/20 rounded-full"></div>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
          <div className="text-4xl md:text-6xl font-extralight mb-8 tracking-tight">
            <FadeInWords text={integratedSection?.title} />
          </div>

          <div className="text-xl md:text-2xl text-gray-400 leading-relaxed font-light capitalize">
            <TextReveal>
              <div
                dangerouslySetInnerHTML={{
                  __html: integratedSection?.long_desc,
                }}
              />
            </TextReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20 z-10">
        <div className="max-w-5xl w-full">
          <div ref={ctaRef} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-neutral-900/90 to-neutral-800/90 backdrop-blur-xl border border-neutral-700/50 rounded-3xl py-8 px-4 md:py-16 md:px-16">
              <div className="absolute top-0 left-0 w-20 h-20 border-t border-l border-neutral-600/30 rounded-tl-3xl"></div>
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b border-r border-neutral-600/30 rounded-br-3xl"></div>
              <div className="text-center space-y-8">
                <h2 className="text-4xl md:text-6xl font-extralight tracking-tight">
                  {exploreSection?.title || t("Explore Our Work")}
                </h2>
                <div
                  className="text-base md:text-xl text-gray-400 leading-relaxed font-light max-w-3xl mx-auto capitalize"
                  dangerouslySetInnerHTML={{
                    __html: exploreSection?.long_desc,
                  }}
                />
                <div className="pt-4">
                  <Link
                    href="/projects"
                    className="group/btn relative inline-flex items-center gap-3 text-xl font-light tracking-wide px-10 py-5 border border-white overflow-hidden transition-all duration-300 hover:scale-105"
                  >
                    <span className="relative z-10 group-hover/btn:text-black transition-colors duration-300">
                      {t("View Projects")}
                    </span>
                    {locale === "en" ? (
                      <ArrowRight className="w-5 h-5 relative z-10 group-hover/btn:text-black transition-all duration-300 group-hover/btn:translate-x-1" />
                    ) : (
                      <ArrowLeft className="w-5 h-5 relative z-10 group-hover/btn:text-black transition-all duration-300 group-hover/btn:translate-x-1" />
                    )}
                    <div className="absolute inset-0 bg-white transform translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                  </Link>
                </div>
                <div className="flex items-center justify-center gap-3 pt-6">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-neutral-600"></div>
                  <span
                    className={`text-neutral-500 ${locale === "en" ? "text-xs" : "text-base"} tracking-[0.3em] uppercase font-normal`}
                  >
                    {t("From Concept to Completion")}
                  </span>
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-neutral-600"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
