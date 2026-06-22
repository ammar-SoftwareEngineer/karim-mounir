"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { Category } from "@/types/projectsApiTypes";
import ProjectCard from "./ProjectCard";
import { useTranslations } from "next-intl";

interface ProjectModalProps {
  category: Category | null;
  onClose: () => void;
}

export default function ProjectModal({
  category,
  onClose,
}: ProjectModalProps) {
  const pathname = usePathname();
  const lenis = useLenis();
  const t = useTranslations("home");

  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!category) return;

      const cards = projectsRef.current?.children || [];

      // Initial states
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(contentRef.current, { y: "100%" });

      gsap.set(cards, {
        opacity: 0,
        y: 20,
        willChange: "transform, opacity",
        force3D: true,
      });

      // Disable hover during intro animation
      gsap.set(projectsRef.current, { pointerEvents: "none" });

      const tl = gsap.timeline();

      tl.to(overlayRef.current, {
        opacity: 1,
        duration: 0.25,
        ease: "power1.out",
      })
        .to(
          contentRef.current,
          {
            y: "0%",
            duration: 0.45,
            ease: "power1.out",
          },
          "-=0.1",
        )
        .from(
          headerRef.current,
          {
            opacity: 0,
            y: -16,
            duration: 0.3,
            ease: "power1.out",
          },
          "-=0.25",
        )
        .to(
          cards,
          {
            opacity: 1,
            y: 0,
            stagger: 0.04,
            duration: 0.35,
            ease: "power1.out",
            clearProps: "opacity",
          },
          "-=0.15",
        )
        .add(() => {
          // Re-enable hover after animation
          gsap.set(projectsRef.current, { pointerEvents: "auto" });
        });
    },
    { dependencies: [category], scope: modalRef },
  );

  const handleClose = () => {
    if (!contentRef.current || !overlayRef.current) return;

    const tl = gsap.timeline({ onComplete: onClose });

    tl.to(contentRef.current, {
      y: "100%",
      duration: 0.4,
      ease: "power1.in",
    }).to(
      overlayRef.current,
      {
        opacity: 0,
        duration: 0.25,
        ease: "power1.in",
      },
      "-=0.2",
    );
  };

  useEffect(() => {
    if (!category) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [category]);

  useEffect(() => {
    if (!category || !lenis) return;

    lenis.stop();
    return () => lenis.start();
  }, [category, lenis]);

  if (!category) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-end justify-center"
    >
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={handleClose}
        className="absolute inset-0 z-0 bg-black/80 opacity-0"
      />

      {/* Modal Content */}
      <div
        ref={contentRef}
        className="relative z-10 w-full h-[calc(100vh-80px)] bg-gradient-to-br from-neutral-900 via-black to-neutral-950 flex flex-col translate-y-full"
      >
        {/* Header */}
        <div
          ref={headerRef}
          className="border-b border-neutral-800 bg-black/40 shrink-0"
        >
          <div className="container mx-auto px-6 py-8 flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-5xl font-bold text-white tracking-tight">
                {category.name}
              </h2>
              <p className="text-neutral-400 mt-2">
                {category.projects.length}{" "}
                {category.projects.length === 1 ? t("project"): t("projects")}
              </p>
            </div>

            <button
              onClick={handleClose}
              className="group relative p-2 text-neutral-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded-lg"
              aria-label="Close modal"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Scroll Area */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain"
          data-lenis-prevent
        >
          <div className="container mx-auto px-6 py-12">
            <div
              ref={projectsRef}
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                lg:grid-cols-3
                gap-8
                auto-rows-fr
              "
            >
              {category.projects.map((project, index) => (
                <div key={project.id} className="h-full">
                  <ProjectCard
                    project={project}
                    index={index}
                    href={`${pathname}/${project.slug}?category=${category.slug}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
