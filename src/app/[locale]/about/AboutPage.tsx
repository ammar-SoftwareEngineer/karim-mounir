/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useRef, useState, ReactNode, useMemo } from "react";

import { usePageReady } from "@/app/hooks/usePageReady";
import { AboutResponse } from "@/types/aboutApiTypes";
import { useLocale, useTranslations } from "next-intl";
import { Compass, Layers, Hexagon, Shield } from "lucide-react";

interface TextRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function TextReveal({
  children,
  delay = 0,
  className = "",
}: TextRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.2 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface FadeInWordsProps {
  text: string;
  delay?: number;
}

export function FadeInWords({ text, delay = 0 }: FadeInWordsProps) {
  const pageReady = usePageReady(600);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsVisible(false);
    if (!pageReady) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [pageReady, delay, text]);

  // Recursively transform HTML string to a stable React element tree with animated words
  const animatedElements = useMemo(() => {
    if (!text) return null;
    if (!mounted) return <span dangerouslySetInnerHTML={{ __html: text }} />;

    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    let globalWordIdx = 0;

    const traverse = (node: Node, path: string): React.ReactNode => {
      // Handle Text Nodes: split into words and wrap in animated spans
      if (node.nodeType === Node.TEXT_NODE) {
        const words = (node.textContent || "").split(/(\s+)/);
        return words.map((word, i) => {
          if (word.match(/^\s+$/)) {
            return (
              <React.Fragment key={`${path}-s-${i}`}>{word}</React.Fragment>
            );
          }
          if (!word) return null;

          const currentIdx = globalWordIdx++;
          return (
            <span
              key={`${path}-w-${i}`}
              className={`inline-block transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${currentIdx * 50}ms` }}
            >
              {word}
            </span>
          );
        });
      }

      // Handle Element Nodes: preserve tags and recurse down
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const Tag = el.tagName.toLowerCase() as any;
        const attrs: any = {};

        Array.from(el.attributes).forEach((attr) => {
          const name = attr.name.toLowerCase();
          if (name === "style" || name.startsWith("on")) return;
          attrs[name === "class" ? "className" : name] = attr.value;
        });

        const VOID_ELEMENTS = new Set([
          "area",
          "base",
          "br",
          "col",
          "embed",
          "hr",
          "img",
          "input",
          "link",
          "meta",
          "param",
          "source",
          "track",
          "wbr",
        ]);

        if (VOID_ELEMENTS.has(Tag)) {
          return <Tag key={path} {...attrs} />;
        }

        return (
          <Tag key={path} {...attrs}>
            {Array.from(el.childNodes).map((child, i) =>
              traverse(child, `${path}-${i}`),
            )}
          </Tag>
        );
      }

      return null;
    };

    return Array.from(doc.body.childNodes).map((node, i) => (
      <React.Fragment key={`root-${i}`}>
        {traverse(node, `root-${i}`)}
      </React.Fragment>
    ));
  }, [text, isVisible, mounted]);

  return (
    <div ref={ref} className="inline">
      {animatedElements}
    </div>
  );
}

const getValueConfig = (index: number) => {
  const configs = [
    {
      hoverBg: "from-blue-500/5 to-transparent",
      glow: "from-blue-500/20 to-purple-500/20",
      renderIcon: () => (
        <svg className="w-full h-full relative z-10" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r="30"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            className="text-neutral-600 group-hover:text-blue-400 transition-colors duration-500"
          />
          <path
            d="M40,10 L40,70 M10,40 L70,40"
            stroke="currentColor"
            strokeWidth="1"
            className="text-neutral-600 group-hover:text-blue-400 transition-colors duration-500"
          />
          <circle
            cx="40"
            cy="40"
            r="12"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-neutral-500 group-hover:text-blue-300 transition-colors duration-500"
          />
        </svg>
      ),
    },
    {
      hoverBg: "from-purple-500/5 to-transparent",
      glow: "from-purple-500/20 to-pink-500/20",
      renderIcon: () => (
        <svg className="w-full h-full relative z-10" viewBox="0 0 80 80">
          <rect
            x="10"
            y="10"
            width="60"
            height="60"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            className="text-neutral-600 group-hover:text-purple-400 transition-colors duration-500"
            rx="4"
          />
          <rect
            x="20"
            y="20"
            width="40"
            height="40"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-neutral-500 group-hover:text-purple-300 transition-colors duration-500"
            rx="2"
          />
          <path
            d="M40,10 L40,20 M40,60 L40,70 M10,40 L20,40 M60,40 L70,40"
            stroke="currentColor"
            strokeWidth="1"
            className="text-neutral-600 group-hover:text-purple-400 transition-colors duration-500"
          />
        </svg>
      ),
    },
    {
      hoverBg: "from-pink-500/5 to-transparent",
      glow: "from-pink-500/20 to-orange-500/20",
      renderIcon: () => (
        <svg className="w-full h-full relative z-10" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r="30"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            className="text-neutral-600 group-hover:text-pink-400 transition-colors duration-500"
          />
          <circle
            cx="40"
            cy="40"
            r="20"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            className="text-neutral-600 group-hover:text-pink-400 transition-colors duration-500"
          />
          <path
            d="M40,20 L45,35 L60,40 L45,45 L40,60 L35,45 L20,40 L35,35 Z"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-neutral-500 group-hover:text-pink-300 transition-colors duration-500"
          />
        </svg>
      ),
    },
    {
      hoverBg: "from-emerald-500/5 to-transparent",
      glow: "from-emerald-500/20 to-teal-500/20",
      renderIcon: () => (
        <Compass
          size={60}
          className="relative z-10 stroke-[1.2] text-neutral-600 group-hover:text-emerald-400 transition-colors duration-500"
        />
      ),
    },
    {
      hoverBg: "from-amber-500/5 to-transparent",
      glow: "from-amber-500/20 to-orange-500/20",
      renderIcon: () => (
        <Layers
          size={60}
          className="relative z-10 stroke-[1.2] text-neutral-600 group-hover:text-amber-400 transition-colors duration-500"
        />
      ),
    },
    {
      hoverBg: "from-cyan-500/5 to-transparent",
      glow: "from-cyan-500/20 to-blue-500/20",
      renderIcon: () => (
        <Hexagon
          size={60}
          className="relative z-10 stroke-[1.2] text-neutral-600 group-hover:text-cyan-400 transition-colors duration-500"
        />
      ),
    },
    {
      hoverBg: "from-indigo-500/5 to-transparent",
      glow: "from-indigo-500/20 to-purple-500/20",
      renderIcon: () => (
        <Shield
          size={60}
          className="relative z-10 stroke-[1.2] text-neutral-600 group-hover:text-indigo-400 transition-colors duration-500"
        />
      ),
    },
  ];

  return configs[index % configs.length];
};

export default function AboutPage({
  aboutApiData,
}: {
  aboutApiData: AboutResponse;
}) {
  const t = useTranslations("home");
  const locale = useLocale();
console.log(aboutApiData);
  return (
    <main className="min-h-screen relative overflow-x-hidden bg-gradient-to-br from-black via-neutral-900 to-black text-neutral-100">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600&display=swap");

        body {
          font-family:
            "Inter",
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(5deg);
          }
          66% {
            transform: translateY(10px) rotate(-5deg);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.05;
          }
          50% {
            opacity: 0.15;
          }
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>

      {/* Section 1: Introduction */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 py-20 relative overflow-hidden">
        <div className="max-w-4xl text-center relative z-10">
          <div className="text-6xl md:text-8xl font-medium tracking-tight mb-4">
            <FadeInWords text={aboutApiData.data.about.title} />
          </div>

          <div className="text-xl md:text-4xl text-neutral-400 font-light tracking-wide capitalize">
            <FadeInWords
             text={"Design Beyond Form" || ""}
            />
          </div>
        </div>
      </section>

      {/* Section 2: Philosophy Statement */}
      <section className="min-h-[50vh] flex items-center px-6 py-20 relative">
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 800 600">
            <path
              d="M100,300 Q200,150 300,250 T500,300 T700,200"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            <circle
              cx="150"
              cy="350"
              r="60"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
            <polygon
              points="350,200 450,220 430,320 330,300"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M550,250 L650,250 L650,400 L600,450 L550,400 Z"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-3xl md:text-4xl font-extralight leading-relaxed text-neutral-200 text-center">
            <FadeInWords text={aboutApiData.data.about.short_desc} />
          </div>
        </div>
      </section>

      {/* Section 3: Role and Vision */}
      <section className="min-h-fit md:min-h-screen flex items-center px-6 py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center w-full">
          <TextReveal className="w-full">
            <div className="relative w-full">
              {/* Main image with permanent clip-path */}
              <div
                className="aspect-[3/4] w-full bg-gradient-to-br from-neutral-800 via-neutral-850 to-neutral-900 shadow-2xl relative overflow-hidden"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%)",
                }}
              >
                {/* === IMAGE === */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={aboutApiData.data.about.vision.image}
                    alt={
                      aboutApiData.data.about.vision.alt_image ||
                      "Idea Illustration"
                    }
                    className="opacity-70 object-cover w-full h-full"
                  />
                </div>

                {/* Bottom-right decorative corner */}
                <div className="absolute bottom-0 right-0 w-32 h-32 border-l-2 border-t-2 border-white opacity-50"></div>

                {/* Bottom label */}
                {/* <div className="absolute bottom-8 left-8 right-8">
                  <div className="h-px bg-gradient-to-r from-transparent via-white to-transparent mb-4"></div>
                  <p className="text-white text-xs tracking-[0.3em] font-light uppercase">
                    {t("Principal Architect")}
                  </p>
                </div> */}
              </div>

              {/* Top-right accent polygon, now always visible */}
              <div
                className="absolute -top-4 -right-4 w-24 h-24 border border-white opacity-50 transition-opacity duration-500"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)",
                }}
              ></div>
            </div>
          </TextReveal>

          <TextReveal delay={200} className="w-full">
            <div className="space-y-6 w-full">
              <div className="inline-block">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-px bg-neutral-600"></div>
                  <span className="text-neutral-500 text-sm tracking-[0.3em] font-normal uppercase">
                    {t("Vision")}
                  </span>
                </div>
                <h2 className="text-5xl md:text-6xl font-extralight tracking-tight text-neutral-100">
                  <FadeInWords text={aboutApiData.data.about.vision.title} />
                </h2>
              </div>

              <div className="space-y-4 pl-0 md:pl-4 border-l-0 md:border-l border-neutral-800">
                <div className="text-lg md:text-xl font-light leading-relaxed text-neutral-300">
                  <FadeInWords text={aboutApiData.data.about.vision.text} />
                </div>
              </div>

              {/* <div className="grid grid-cols-2 gap-6 pt-8">
                <div className="border-t border-neutral-800 pt-4">
                  <p className="text-3xl font-light text-white">
                    {aboutApiData.data.about.statistics.years_of_experience}+
                  </p>
                  <p className="text-sm text-neutral-500 font-light tracking-wide">
                    {t("Years Experience")}
                  </p>
                </div>
                <div className="border-t border-neutral-800 pt-4">
                  <p className="text-3xl font-light text-white">
                    {aboutApiData.data.about.statistics.projects_completed}+
                  </p>
                  <p className="text-sm text-neutral-500 font-light tracking-wide">
                    {t("Projects Completed")}
                  </p>
                </div>
              </div> */}
            </div>
          </TextReveal>
        </div>
      </section>

      {/* Section 4: Approach and Execution (Mirrored layout) */}
      <section className="min-h-fit md:min-h-screen flex items-center px-6 py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center w-full">
          {/* Text block */}
          <TextReveal className="w-full">
            <div className="space-y-6 w-full">
              <div className="inline-block">
                <div className={`flex items-center gap-3 mb-2`}>
                  <div className="w-12 h-px bg-neutral-600"></div>
                  <span className="text-neutral-500 text-sm tracking-[0.3em] font-normal uppercase">
                    {t("Approach")}
                  </span>
                </div>
                <h2
                  className={`text-5xl md:text-6xl font-extralight tracking-tight text-neutral-100`}
                >
                  <FadeInWords
                    text={aboutApiData.data.about.approach_section.title}
                  />
                </h2>
              </div>

              <div className={`space-y-4`}>
                <div className="text-lg md:text-xl font-light leading-relaxed text-neutral-300">
                  <FadeInWords
                    text={aboutApiData.data.about.approach_section.text}
                  />
                </div>
              </div>
            </div>
          </TextReveal>

          {/* Image block */}
          <TextReveal delay={200} className="w-full">
            <div className="relative w-full">
              {/* Main image with permanent clip-path */}
              <div
                className="aspect-[3/4] w-full bg-gradient-to-br from-neutral-800 via-neutral-850 to-neutral-900 shadow-2xl relative overflow-hidden"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 15% 100%, 0 85%)",
                }}
              >
                {/* === IMAGE === */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={aboutApiData.data.about.approach_section.image}
                    alt={
                      aboutApiData.data.about.approach_section.alt_image ||
                      "Approach Illustration"
                    }
                    className="opacity-70 object-cover w-full h-full"
  
                  />
                </div>

                {/* Bottom-left decorative corner */}
                <div className="absolute bottom-0 left-0 w-32 h-32 border-r-2 border-t-2 border-white opacity-50"></div>
              </div>

              {/* Top-left accent polygon */}
              <div
                className="absolute -top-4 -left-4 w-24 h-24 border border-white opacity-50 transition-opacity duration-500"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 30% 100%, 0 70%)",
                }}
              ></div>
            </div>
          </TextReveal>
        </div>
      </section>

      {/* the compant section */}
      {/* Section 5: Core Values */}
      <section className="min-h-screen flex items-center px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <TextReveal>
            <h2 className="text-4xl md:text-5xl font-extralight mb-20 text-center tracking-tight">
              {aboutApiData.data.our_values.title}
            </h2>
          </TextReveal>

          <div className="flex flex-wrap justify-center gap-8">
            {aboutApiData?.data?.our_values?.values?.map((value, index) => {
              if (!value || !value.title) return null;
              const config = getValueConfig(index);
              return (
                <TextReveal
                  key={value.id || index}
                  delay={(index + 1) * 100}
                  className="w-full md:w-[350px] flex flex-col"
                >
                  <div className="group relative bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 backdrop-blur-sm border border-neutral-700/30 rounded-2xl p-8 hover:border-neutral-600/50 transition-all duration-500 hover:transform hover:scale-105 flex flex-col h-full">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${config.hoverBg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}
                    ></div>

                    <div className="relative z-10 flex flex-col flex-1">
                      <div className="w-20 h-20 mx-auto mb-6 relative flex-shrink-0 flex items-center justify-center">
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${config.glow} rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                        ></div>
                        {config.renderIcon()}
                      </div>
                      <div className="flex-1 flex items-center justify-center">
                        <h3 className="text-2xl font-light tracking-wide text-center text-neutral-200 group-hover:text-neutral-100 transition-colors duration-300">
                          {value.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </TextReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 6: Quote Highlight */}
      <section className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-30">
            <div
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
              style={{ animationDuration: "4s" }}
            ></div>
            <div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
              style={{ animationDuration: "6s", animationDelay: "1s" }}
            ></div>
          </div>
        </div>

        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 1000 1000">
            <defs>
              <pattern
                id="grid"
                width="50"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 50 0 L 0 0 0 50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <TextReveal>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl group-hover:blur-2xl transition-all duration-1000 opacity-75 group-hover:opacity-100"></div>

              <div className="relative bg-gradient-to-br from-neutral-900/90 via-neutral-800/80 to-neutral-900/90 border border-neutral-700/50 rounded-3xl p-12 md:p-20 shadow-2xl">
                <div
                  className={`absolute top-0 ${locale === "ar" ? "right-0" : "left-0"} w-20 h-20 border-t-2 ${locale === "ar" ? "border-r-2 rounded-tr-3xl" : "border-l-2 rounded-tl-3xl"} border-neutral-600/50`}
                ></div>
                <div
                  className={`absolute bottom-0 ${locale === "ar" ? "left-0" : "right-0"} w-20 h-20 border-b-2 ${locale === "ar" ? "border-l-2 rounded-bl-3xl" : "border-r-2 rounded-br-3xl"} border-neutral-600/50`}
                ></div>

                <div
                  className={`absolute top-8 ${locale === "ar" ? "right-8" : "left-8"} text-neutral-700/30 text-8xl font-serif leading-none`}
                >
                  &quot;
                </div>
                <div
                  className={`absolute bottom-8 ${locale === "ar" ? "left-8" : "right-8"} text-neutral-700/30 text-8xl font-serif leading-none transform rotate-180`}
                >
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
                    <FadeInWords
                      text={
                        aboutApiData.data.about.about_section.title ||
                        aboutApiData.data.about.about_section.text
                      }
                    />
                  </blockquote>

                  <div className="flex items-center justify-center gap-3 pt-6">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-neutral-600"></div>
                    <div
                      className={`text-neutral-400 font-medium ${locale === "ar" ? "text-lg" : "text-sm"}`}
                    >
                      {t("Karim Mounir")}
                    </div>
                    <div className="h-px w-12 bg-gradient-to-l from-transparent to-neutral-600"></div>
                  </div>
                </div>
              </div>
            </div>
          </TextReveal>
        </div>
      </section>
    </main>
  );
}
