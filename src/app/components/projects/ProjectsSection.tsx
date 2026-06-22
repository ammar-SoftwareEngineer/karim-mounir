"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useLenis } from "lenis/react";
import { useTransitionRouter } from "next-view-transitions";
import FlipText from "../FlipText";
import { TextReveal } from "@/app/[locale]/about/AboutPage";
import { Link } from "@/navigations";
import { slideInOut } from "@/lib/utils";
import { Category, Section } from "@/types/homeApiTypes";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, ArrowLeft } from "lucide-react";

const marqueeTextsByLocale: Record<string, string[]> = {
  en: [
    "Design Beyond Boundaries",
    "Built For Tomorrow",
    "Real Impact",
    "Digital Visions",
  ],
  ar: [
    "تصميم يتجاوز الحدود",
    "مبني للغد",
    "أثر حقيقي",
    "رؤى رقمية",
  ],
};

export default function ProjectsSection({ categories, sections }: { categories: Category[], sections: Section[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLElement>(null);
  const outroRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const marqueeTimelineRef = useRef<any>(null);
  const lenis = useLenis();
  const viewRouter = useTransitionRouter();
  const t = useTranslations("home")
  const locale = useLocale();
  const visionSection = sections?.find(
    (s) => s.key === "projects_section_home",
  );

  useEffect(() => {
    if (!lenis) return;
    gsap.registerPlugin(ScrollTrigger, SplitText);

    // Intro/outro text elements
    const introEls = introRef.current
      ? gsap.utils.toArray<HTMLElement>(
        introRef.current.querySelectorAll(".intro-animate"),
      )
      : [];

    // Intro animation
    if (introEls.length) {
      gsap.set(introEls, { opacity: 0, y: 60, filter: "blur(8px)" });
      gsap.fromTo(
        introEls,
        { y: 60, opacity: 0, filter: "blur(8px)" },
        {
          delay: 0.5,
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.5,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: introRef.current,
            start: "top center",
            end: "bottom center",
            toggleActions: "play reverse play reverse",
          },
        },
      );
    }
    // Cards animation (unchanged)
    const cards = cardsRef.current.filter(Boolean);
    const introCard = cards[0];

    const titles = cards
      .map((card) => card.querySelector(".card-title h2"))
      .filter(Boolean);

    titles.forEach((title) => {
      if (title) {
        const split = new SplitText(title, {
          type: "char",
          charsClass: "char",
          tag: "div",
        });
        split.chars.forEach((char) => {
          char.innerHTML = `<span>${char.textContent}</span>`;
        });
      }
    });

    cards.forEach((card, index) => {
      if (index === 0) return;
      const cardTextEls = gsap.utils.toArray<HTMLElement>(
        card.querySelectorAll(".card-text-animate"),
      );
      if (!cardTextEls.length) return;
      gsap.set(cardTextEls, { opacity: 0, y: 60, filter: "blur(8px)" });
      gsap.fromTo(
        cardTextEls,
        { y: 60, opacity: 0, filter: "blur(8px)" },
        {
          y: 0,
          opacity: 1,
          delay: 0.2,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: card,
            start: "top center",
            toggleActions: "play reverse play reverse",
          },
        },
      );
    });

    // Intro card animations
    if (introCard) {
      const cardImgWrapper = introCard.querySelector(".card-img");
      const cardImg = introCard.querySelector(".card-img img");
      const introTextEls = introCard.querySelectorAll(".card-text-animate");

      gsap.set(cardImgWrapper, { scale: 0.5, borderRadius: "400px" });
      gsap.set(cardImg, { scale: 1 });
      gsap.set(introTextEls, { opacity: 0, y: 60, filter: "blur(8px)" });

      ScrollTrigger.create({
        trigger: introCard,
        start: "top top",
        end: "+=600vh",
        scrub: 1.2,
        onUpdate: (self) => {
          const progress = self.progress;
          const imgScale = 0.5 + progress * 0.5;
          const borderRadius = 400 - progress * 375;
          const imgInnerScale = 1.5 - progress * 0.5;

          if (cardImgWrapper)
            gsap.set(cardImgWrapper, {
              scale: imgScale,
              borderRadius: borderRadius + "px",
            });
          if (cardImg) gsap.set(cardImg, { scale: imgInnerScale });

          let textProgress = gsap.utils.clamp(
            0,
            1,
            (progress - 0.15) / (0.55 - 0.15),
          );
          if (progress >= 1) textProgress = 1;
          gsap.set(introTextEls, {
            opacity: textProgress,
            y: 60 * (1 - textProgress),
            filter: `blur(${8 * (1 - textProgress)}px)`,
          });

          const marquee = introCard.querySelector(".card-marquee .marquee");
          if (marquee) {
            if (imgScale <= 0.75) {
              const fadeProgress = (imgScale - 0.5) / (0.75 - 0.5);
              gsap.set(marquee, { opacity: 1 - fadeProgress });
            } else if (imgScale > 0.75) gsap.set(marquee, { opacity: 0 });
          }
        },
      });
    }

    // Pin cards
    const scrollMultiplier = 2.5;
    cards.forEach((card, index) => {
      const isLastCard = index === cards.length - 1;
      ScrollTrigger.create({
        trigger: card,
        start: "top top",
        end: isLastCard ? `+=${100 * scrollMultiplier}vh` : `top top`,
        endTrigger: isLastCard ? null : cards[cards.length - 1],
        pin: true,
        pinSpacing: isLastCard,
      });
    });

    // Previous card scale/fade & card image scroll animations
    cards.forEach((card, index) => {
      if (index < cards.length - 1) {
        const cardImgWrapper = card.querySelector(".card-wrapper");
        ScrollTrigger.create({
          trigger: cards[index + 1],
          start: "top bottom",
          end: "top top",
          onUpdate: (self) => {
            const progress = self.progress;
            if (cardImgWrapper)
              gsap.set(cardImgWrapper, {
                scale: 1 - progress * 0.25,
                opacity: 1 - progress,
              });
          },
        });
      }

      if (index > 0) {
        const cardImg = card.querySelector(".card-img img");
        const imgContainer = card.querySelector(".card-img");
        ScrollTrigger.create({
          trigger: card,
          start: "top bottom",
          end: "top top",
          onUpdate: (self) => {
            const progress = self.progress;
            const scaleValue = 1.05 - progress * 0.05;
            if (cardImg) gsap.set(cardImg, { scale: scaleValue });
            else if (imgContainer)
              gsap.set(imgContainer, { scale: scaleValue });
            if (imgContainer)
              gsap.set(imgContainer, {
                borderRadius: Math.max(0, 40 - progress * 40) + "px",
              });
          },
        });
      }
    });

    // Animate card titles
    cards.forEach((card, index) => {
      if (index === 0) return;
      const cardTitleChars = card.querySelector(".char span");
      ScrollTrigger.create({
        trigger: card,
        start: "top top",
        onEnter: () =>
          gsap.to(cardTitleChars, {
            x: "0%",
            duration: 0.75,
            ease: "power4.out",
          }),
        onLeaveBack: () =>
          gsap.to(cardTitleChars, {
            x: "100%",
            duration: 0.5,
            ease: "power4.out",
          }),
      });
    });

    ScrollTrigger.refresh();
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [lenis]);

  // Dedicated marquee effect — re-runs when locale changes so Arabic texts animate correctly
  useEffect(() => {
    if (!lenis) return;

    if (marqueeTimelineRef.current) {
      marqueeTimelineRef.current.kill();
      marqueeTimelineRef.current = null;
    }

    const raf = requestAnimationFrame(() => {
      const marqueeItems = gsap.utils.toArray(".marquee h2");
      if (marqueeItems.length > 0) {
        marqueeTimelineRef.current = horizontalLoop(marqueeItems, {
          repeat: -1,
          paddingRight: 30,
        });
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      if (marqueeTimelineRef.current) {
        marqueeTimelineRef.current.kill();
        marqueeTimelineRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lenis, locale]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const horizontalLoop = (items: any[], config: any) => {
    items = gsap.utils.toArray(items);
    config = config || {};
    const tl = gsap.timeline({
      repeat: config.repeat,
      defaults: { ease: "none" },
    });

    const length = items.length;
    const startX = items[0].offsetLeft;
    const widths: number[] = [];
    const xPercents: number[] = [];
    const pixelsPerSecond = (config.speed || 1) * 100;

    gsap.set(items, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      xPercent: (i: number, el: any) => {
        const w = (widths[i] = parseFloat(
          gsap.getProperty(el, "width", "px") as string,
        ));
        xPercents[i] =
          (parseFloat(gsap.getProperty(el, "x", "px") as string) / w) * 100 +
          (gsap.getProperty(el, "xPercent") as number);
        return xPercents[i];
      },
    });

    gsap.set(items, { x: 0 });
    const totalWidth =
      items[length - 1].offsetLeft +
      (xPercents[length - 1] / 100) * widths[length - 1] -
      startX +
      items[length - 1].offsetWidth *
      (gsap.getProperty(items[length - 1], "scaleX") as number) +
      (parseFloat(config.paddingRight) || 0);

    for (let i = 0; i < length; i++) {
      const item = items[i];
      const curX = (xPercents[i] / 100) * widths[i];
      const distanceToStart = item.offsetLeft + curX - startX;
      const distanceToLoop =
        distanceToStart +
        widths[i] * (gsap.getProperty(item, "scaleX") as number);

      tl.to(
        item,
        {
          xPercent: ((curX - distanceToLoop) / widths[i]) * 100,
          duration: distanceToLoop / pixelsPerSecond,
        },
        0,
      ).fromTo(
        item,
        {
          xPercent: ((curX - distanceToLoop + totalWidth) / widths[i]) * 100,
        },
        {
          xPercent: xPercents[i],
          duration:
            (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
          immediateRender: false,
        },
        distanceToLoop / pixelsPerSecond,
      );
    }

    tl.progress(1, true).progress(0, true);
    return tl;
  };

  return (
    <div ref={sectionRef} className="overflow-x-hidden">
      {/* Cards Section */}
      <section className="projects-cards relative flex flex-col bg-[var(--color-primary)] text-white gap-[25vh]">
        {categories.map((project, index) => (
          <div
            key={project.id}
            ref={(el) => {
              if (el) cardsRef.current[index] = el;
            }}
            className={`project-card card relative w-[100vw] h-screen ${
              index === 1 ? "mt-[50vh]" : ""
            }`}
          >
            {/* Marquee - Only on first card */}
            {index === 0 && (
              <div
                className="card-marquee absolute w-full top-1/2 -translate-y-1/2 overflow-hidden"
                style={{ left: 0, right: "unset" }}
              >
                <div className="marquee flex" dir="ltr">
                  {Array.from({ length: 4 }, (_, rep) =>
                    (
                      marqueeTextsByLocale[locale] ?? marqueeTextsByLocale.en
                    ).map((text, i) => (
                      <h2
                        key={`${rep}-${i}`}
                        className="whitespace-nowrap text-[10vw] font-semibold mr-[30px]"
                      >
                        {text}
                      </h2>
                    )),
                  )}
                </div>
              </div>
            )}

            {/* Card Wrapper */}
            <div className="card-wrapper relative w-[100vw] h-full will-change-transform left-0">
              {/* Image Container */}
              {index === 0 ? (
                <div className="card-img absolute inset-0 w-full h-full overflow-hidden rounded-[150px] z-0">
                  <Image
                    src={project.image}
                    alt={project.alt_image || "Category Image"}
                    fill
                    className="absolute top-0 left-0 w-full h-full object-cover will-change-transform"
                  />

                  {/* DARK OVERLAY */}
                  <div className="absolute inset-0 bg-black/45" />
                </div>
              ) : (
                <div
                  className="card-img absolute inset-0 left-0 w-[100vw] h-[100vh] bg-center bg-cover will-change-transform z-0"
                  style={{ backgroundImage: `url(${project.image})` }}
                ></div>
              )}

              {/* Content */}
              <div className="card-content absolute inset-0 w-full h-full flex items-center justify-center z-10 px-6 md:px-12">
                <div className="card-copy max-w-4xl space-y-4 md:space-y-6 text-center flex flex-col items-center">
                  <div className="card-text-animate flex items-center justify-center gap-3 text-lg text-white font-medium">
                    <span className="h-px w-10 bg-white" />
                    <div
                      className="whitespace-nowrap inline-block"
                      style={{ unicodeBidi: "isolate" }}
                    >
                      {t("Category")} 0{index + 1}
                    </div>
                  </div>
                  <div className="card-title text-center card-text-animate">
                    <h2 className="text-4xl md:text-[5rem] font-semibold leading-[1.05] tracking-[-0.08em] drop-shadow-xl uppercase">
                      {project.name}
                    </h2>
                  </div>
                  <div className="card-description max-w-4xl card-text-animate mx-auto">
                    <p className="text-lg md:text-xl leading-relaxed text-white/85 capitalize">
                      {project.short_desc}
                    </p>
                  </div>
                  <div className="card-text-animate">
                    <Link
                      href={`/projects?category=${project.slug}`}
                      className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-4 sm:px-6 py-3 text-sm font-semibold tracking-tight text-black transition duration-400 ease-out hover:-translate-y-0.5"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--color-main-white), rgba(200,200,200,0.9) 45%, rgba(26,26,26,0.9) 140%)",
                        boxShadow:
                          "0 14px 50px rgba(14,14,14,0.45), 0 0 28px rgba(200,200,200,0.22), 0 0 0 1px rgba(200,200,200,0.08) inset",
                      }}
                    >
                      <span className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                        <span className="absolute inset-0 blur-2xl bg-white/25" />
                        <span className="absolute inset-0 bg-gradient-to-r from-[rgba(200,200,200,0.25)] via-[rgba(255,255,255,0.45)] to-[rgba(26,26,26,0.3)]" />
                      </span>
                      <span className="absolute inset-y-0 left-[-40%] w-[40%] -skew-x-12 bg-white/50 opacity-50 transition-all duration-700 group-hover:translate-x-[220%]" />
                      <span className="relative text-xs sm:text-sm z-10 text-[var(--color-primary)]">
                        {project.name}
                      </span>
                      <span
                        className={`relative z-10 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-primary)] text-white transition-transform duration-300 ${locale === "ar" ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"} group-hover:rotate-3 shadow-[0_0_18px_rgba(26,26,26,0.45)]`}
                      >
                        {locale === "ar" ? (
                          <ArrowLeft size={14} />
                        ) : (
                          <ArrowRight size={14} />
                        )}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Outro Section */}
      <section
        ref={outroRef}
        className="relative flex flex-col gap-10 justify-center items-center w-full min-h-fit bg-gradient-to-t from-[var(--color-primary)] via-[color-mix(in_srgb,var(--color-primary) 75%,var(--color-dark-gray))] to-[var(--color-dark-gray)] text-white flex items-center px-6"
      >
        <div className="max-w-6xl mx-auto w-full space-y-8 text-center min-h-[100vh] flex flex-col gap-10 justify-center items-center">
          <FlipText className="outro-animate text-4xl md:text-5xl font-semibold leading-[1.45] tracking-[-0.05em] capitalize min-h-fit">
            {locale === "en" ? (
              <>
                We <span className="text-mid-gray">Design</span> With Purpose
                Merging <span className="text-mid-gray">Innovation</span>,
                Technical <span className="text-mid-gray">Precision</span>, And
                Expressive <span className="text-mid-gray">Beauty</span> To
                Create Spaces That{" "}
                <span className="text-mid-gray">Elevate</span> Everyday Life
              </>
            ) : (
              <>
                نحن <span className="text-mid-gray">نصمم</span> بغاية لنجمع بين{" "}
                <span className="text-mid-gray">الابتكار</span>، و{" "}
                <span className="text-mid-gray">الدقة</span> التقنية، و{" "}
                <span className="text-mid-gray">الجمال</span> التعبيري لنصنع
                مساحات <span className="text-mid-gray">ترتقي</span> بالحياة
                اليومية
              </>
            )}
          </FlipText>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 mb-[250px]">
          <TextReveal>
            <div className="relative group">
              <div className="absolute -inset-[1.5px] bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-pink-500/50 rounded-[25px] transition-all duration-1000 opacity-70 group-hover:opacity-100"></div>

              <div className="relative bg-gradient-to-br from-neutral-900/95 via-neutral-800/90 to-neutral-900/95 border border-transparent rounded-[24px] p-12 md:p-20 shadow-2xl">
                <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-neutral-600/50 rounded-tl-3xl"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-neutral-600/50 rounded-br-3xl"></div>

                <div className="absolute top-8 left-8 text-neutral-700/30 text-8xl font-serif leading-none">
                  &quot;
                </div>
                <div className="absolute bottom-8 right-8 text-neutral-700/30 text-8xl font-serif leading-none transform rotate-180">
                  &quot;
                </div>

                <div className="relative z-10 text-center space-y-8">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent via-neutral-500 to-transparent"></div>
                    <svg
                      className="w-8 h-8 text-neutral-500"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="h-px w-16 bg-gradient-to-r from-transparent via-neutral-500 to-transparent"></div>
                  </div>

                  <blockquote className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight tracking-tight text-neutral-100">
                    <FlipText
                      rotateFrom={0}
                      stagger={0.02}
                      className="inline-block"
                    >
                      {visionSection?.long_desc ? (
                        <span
                          className="capitalize"
                          dangerouslySetInnerHTML={{
                            __html: visionSection.long_desc,
                          }}
                        />
                      ) : (
                        "Discover how we transform vision into reality"
                      )}
                    </FlipText>
                  </blockquote>

                  <div className="pt-4">
                    <Link
                      href="/projects"
                      className="group/btn relative inline-flex items-center gap-3 text-xl font-light tracking-wide px-4 lg:px-10 py-5 border border-white overflow-hidden transition-all duration-300 hover:scale-105"
                      onClick={(e) => {
                        e.preventDefault();
                        viewRouter.push("/projects", {
                          onTransitionReady: slideInOut,
                        });
                      }}
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
                </div>
              </div>
            </div>
          </TextReveal>
        </div>
      </section>
    </div>
  );
}
