"use client";
import Image from "next/image";
import { useTransitionRouter } from "next-view-transitions";
import { ArrowUpRight, ArrowUpLeft } from "lucide-react";
import { Project } from "@/types/projectsApiTypes";
import { slideInOut } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";

interface ProjectCardProps {
  project: Project;
  href?: string;
  index: number;
}

export default function ProjectCard({
  project,
  href,
  index,
}: ProjectCardProps) {
  const viewRouter = useTransitionRouter();
  const locale = useLocale();
  const t = useTranslations("home");
  const card = (
    <>
      {/* Animated Border Glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 bg-gradient-to-r from-white/12 via-white/6 to-white/12 blur-xl animate-border-flow" />
      </div>

      {/* Main Card Content */}
      <div className="relative h-full flex flex-col bg-zinc-950/90 border border-zinc-800/50 group-hover:border-white/30 transition-all duration-700 overflow-hidden">
        {/* Image Section */}
        <div className="relative h-72 overflow-hidden">
          {/* Glass overlay */}
          <div className="pointer-events-none absolute inset-0 bg-white/5 z-10" />

          <Image
            src={project.image}
            alt={project.alt_image || project.name}
            fill
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
          />

          {/* Gradient overlays */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent to-zinc-950/40 z-10" />

          {/* Floating Number */}
          <div className="pointer-events-none absolute top-6 right-6 z-20 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
            <span
              className="text-8xl font-bold text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {index + 1 > 9 ? index + 1 : `0${index + 1}`}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="relative p-8 space-y-6 flex-grow flex flex-col">
          {/* Decorative Line */}
          <div className="pointer-events-none w-12 h-px bg-gradient-to-r from-white/70 to-transparent group-hover:w-24 transition-all duration-700" />

          {/* Title */}
          <h3
            className="text-[28px] font-light text-white tracking-tight leading-tight group-hover:tracking-wide transition-all duration-500 capitalize"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {project.name}
          </h3>

          {/* Description */}
          <p
            className="text-zinc-400 text-base leading-relaxed line-clamp-2 font-light capitalize"
            style={{
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "0.01em",
            }}
          >
            {project.short_desc}
          </p>

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-zinc-800/50 group-hover:border-white/25 transition-colors duration-500">
            <span
              className="text-xs uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors duration-300"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
            >
              {t("explore our project")}
            </span>

            {/* Arrow */}
            <div className="relative w-9 h-9 flex items-center justify-center">
              <div className="pointer-events-none absolute inset-0 bg-white/10 backdrop-blur-md rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
              {locale === "en" ? (
                <ArrowUpRight
                  className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors duration-300 relative z-10"
                  strokeWidth={1.5}
                />
              ) : (
                <ArrowUpLeft
                  className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors duration-300 relative z-10"
                  strokeWidth={1.5}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const className =
    "group relative block h-full transition-transform duration-700 hover:scale-[1.02] cursor-pointer";

  if (href) {
    return (
      <article
        className={className}
        role="link"
        tabIndex={0}
        aria-label={project.name}
        onClick={() => {
          if (!href) return;
          viewRouter.push(href, { onTransitionReady: slideInOut });
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && href) {
            viewRouter.push(href, { onTransitionReady: slideInOut });
          }
        }}
      >
        {card}
      </article>
    );
  }

  return <article className={className}>{card}</article>;
}
