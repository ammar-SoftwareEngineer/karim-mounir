"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import {
  X,
  ChevronLeft,
  ChevronRight,
  HardHat,
  Hammer,
  Home,
  FolderOpen,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransitionRouter } from "next-view-transitions";
import { slideInOut } from "@/lib/utils";
import fallbackImg from "@/app/images/pd1.jpg";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ProjectResponse } from "@/types/singleProjectApiType";
import Image from "next/image";

export default function ProjectDetails({
  projectApiData,
}: {
  projectApiData: ProjectResponse;
}) {
  const t = useTranslations("home");
  const locale = useLocale();
  const isArabic = locale.startsWith("ar");
  const viewRouter = useTransitionRouter();

  const project = projectApiData.data.project;
  const projectImages = project.images || [];

  const getImageUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const baseUrl = "https://api.karimmounir.com";
    return `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const heroBgImage =
    projectImages.length > 0 ? getImageUrl(projectImages[0].path) : fallbackImg;

  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState<boolean[]>(
    new Array(projectImages.length).fill(false),
  );

  // Refs for GSAP
  const heroRef = useRef<HTMLDivElement>(null);
  const breadcrumbRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const lightboxImageRef = useRef<HTMLDivElement>(null);

  // GSAP fade-in for hero breadcrumb
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(heroRef.current, { opacity: 0, duration: 1.2 }).from(
      breadcrumbRef.current,
      { opacity: 0, y: 20, duration: 0.8 },
      "-=0.6",
    );
  });

  // GSAP fade-in for title, description, badges
  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: { duration: 0.85, ease: "power2.out" },
    });
    tl.from(titleRef.current, { opacity: 0, y: 30 })
      .from(descRef.current, { opacity: 0, y: 20 }, "-=0.4")
      .from(
        badgesRef.current?.children,
        { opacity: 0, y: 10, stagger: 0.15 },
        "-=0.4",
      );
  });

  // GSAP scale-in for lightbox
  useGSAP(() => {
    if (selectedImage !== null && lightboxImageRef.current) {
      gsap.fromTo(
        lightboxImageRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
          overwrite: true,
        },
      );
    }
  }, [selectedImage]);

  const handleImageLoad = (index: number) => {
    setImageLoaded((prev) => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  const isNavigating = useRef(false);

  const navigateLightbox = (direction: number) => {
    if (isNavigating.current || selectedImage === null) return;
    const nextIndex = selectedImage + direction;
    if (nextIndex >= 0 && nextIndex < projectImages.length) {
      isNavigating.current = true;
      setSelectedImage(nextIndex);
      // Cooldown slightly less than animation duration for responsiveness
      setTimeout(() => {
        isNavigating.current = false;
      }, 400);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
      if (e.key === "ArrowRight") navigateLightbox(isArabic ? -1 : 1);
      if (e.key === "ArrowLeft") navigateLightbox(isArabic ? 1 : -1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, isArabic]);

  // Sync translated slugs with window for Header language switcher
  useEffect(() => {
    if (typeof window !== "undefined" && project?.slugs) {
      (window as any).__PROJECT_SLUGS = project.slugs;
    }
    return () => {
      if (typeof window !== "undefined") {
        delete (window as any).__PROJECT_SLUGS;
      }
    };
  }, [project?.slugs]);

  return (
    <main
      className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* ── Hero Breadcrumb Banner ── */}
      <div
        ref={heroRef}
        className="relative w-full h-[50vh] min-h-[300px] max-h-[620px] overflow-hidden"
      >
        {/* Background image */}
        <Image
          src={heroBgImage}
          alt={project?.name || "Project"}
          className="object-cover object-center"
          fill
          priority
        />

        {/* Layered overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/30" />

        {/* Subtle noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: "150px 150px",
          }}
        />

        {/* Breadcrumb content */}
        <div
          ref={breadcrumbRef}
          className="absolute inset-0 flex flex-col justify-end px-6 sm:px-8 2xl:px-12 pb-10"
          style={{ maxWidth: "1800px", margin: "0 auto", left: 0, right: 0 }}
        >
          {/* Breadcrumb trail */}
          <nav
            aria-label="breadcrumb"
            className="flex items-center gap-2 text-sm sm:text-base text-white/50 mb-4 flex-wrap"
          >
            {/* Home */}
            <Link
              href="/"
              className="flex items-center gap-1.5 text-white/50 hover:text-white/90 transition-colors duration-200"
            >
              <Home size={14} />
              <span>{isArabic ? "الرئيسية" : "Home"}</span>
            </Link>

            {/* Separator */}
            <span className="text-white/25 select-none">/</span>

            {/* Projects */}
            <Link
              href="/projects"
              className="flex items-center gap-1.5 text-white/50 hover:text-white/90 transition-colors duration-200"
              onClick={(e) => {
                e.preventDefault();
                viewRouter.push("/projects", {
                  onTransitionReady: slideInOut,
                });
              }}
            >
              <FolderOpen size={14} />
              <span>{isArabic ? "المشاريع" : "Projects"}</span>
            </Link>

            {/* Separator */}
            <span className="text-white/25 select-none">/</span>

            {/* Current project — truncated */}
            <span className="text-white/90 font-medium truncate max-w-[200px] sm:max-w-xs capitalize">
              {project?.name}
            </span>
          </nav>

          {/* Back link (kept inside hero) */}
          {/* <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/90 transition-colors duration-200 w-fit"
            onClick={(e) => {
              e.preventDefault();
              viewRouter.push("/projects", { onTransitionReady: slideInOut });
            }}
          >
            {isArabic ? <StepForward size={16} /> : <StepBack size={16} />}
            <span>
              {isArabic ? "العودة إلى المشاريع" : "Back To The Projects Page"}
            </span>
          </Link> */}
        </div>
      </div>

      {/* ── Page Body ── */}
      <div className="px-6 sm:px-8 2xl:px-12 max-w-[1800px] mx-auto pb-20">
        {/* Thin divider connecting hero to body */}
        <div className="relative h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-10" />

        {/* Title and Description */}
        <div className="flex flex-col mb-16">
          <h2
            ref={titleRef}
            className={`text-4xl sm:text-5xl md:text-5xl font-bold mb-5 capitalize ${
              isArabic ? "text-right" : "text-left"
            }`}
          >
            {project?.name}
          </h2>

          <div
            ref={descRef}
            className="text-base sm:text-lg md:text-xl max-w-8xl text-neutral-400 leading-relaxed capitalize !text-justify [&_p]:!text-justify"
            dangerouslySetInnerHTML={{ __html: project.long_desc }}
          />

          {/* Badges */}
          <div ref={badgesRef} className="mt-4 flex flex-wrap gap-3">
            {project.location && (
              <span className="badge bg-white/20 text-white py-2 px-5 rounded-full text-sm sm:text-base font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                {project.location}
              </span>
            )}
            {project.category?.name && (
              <span className="badge bg-white/20 text-white py-2 px-5 rounded-full text-sm sm:text-base font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                {project.category.name}
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Grid Gallery */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 auto-rows-[280px]">
          {projectImages.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-40 bg-neutral-900/40 rounded-[2rem] border border-neutral-800/60 backdrop-blur-md space-y-8">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full animate-pulse" />
                <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 flex items-center justify-center shadow-2xl">
                  <HardHat
                    size={48}
                    className="text-yellow-500/80"
                    strokeWidth={1}
                  />
                  <Hammer
                    size={38}
                    className="absolute -bottom-2 -right-2 text-white/50 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-full p-1"
                  />
                </div>
              </div>
              <div className="text-center space-y-3 px-6">
                <h3 className="text-2xl font-semibold tracking-tight text-white/70">
                  {t("Gallery Under Construction")}
                </h3>
                <p className="text-neutral-500 max-w-sm mx-auto text-base leading-relaxed">
                  {t("Gallery description")}
                </p>
              </div>
            </div>
          )}

          {projectImages.map((img, i) => {
            let spanClass = "col-span-1";

            if (i === 0) spanClass = "xl:col-span-8 xl:row-span-2";
            else if (i === 1 || i === 2)
              spanClass = "xl:col-span-4 xl:row-span-1";
            else spanClass = "xl:col-span-6 xl:row-span-1";

            return (
              <div
                key={img.id || i}
                className={`relative overflow-hidden rounded-2xl cursor-pointer group  ${spanClass}`}
                onClick={() => setSelectedImage(i)}
              >
                <img
                  src={getImageUrl(img.path)}
                  alt={img.file_name || `Project image ${i}`}
                  className="object-cover transition-all duration-700 group-hover:scale-105 h-full w-full"
                  onLoad={() => handleImageLoad(i)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 transition-all duration-500 rounded-2xl" />
              </div>
            );
          })}
        </div>

        {/* Lightbox Modal */}
        {selectedImage !== null && (
          <div
            className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 md:pt-28 pb-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-20 right-6 z-10 text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
              onClick={() => setSelectedImage(null)}
            >
              <X size={28} strokeWidth={1.5} />
            </button>

            <div className="absolute top-6 left-6 z-10 text-white/80 text-sm font-light tracking-wider">
              {selectedImage + 1} / {projectImages.length}
            </div>

            <div
              ref={lightboxImageRef}
              className="relative w-full h-full flex items-center justify-center p-4 md:p-20"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={getImageUrl(projectImages[selectedImage].path)}
                alt={`Project image ${selectedImage + 1}`}
                className="object-contain"
              />
            </div>

            {selectedImage > 0 && (
              <button
                className="absolute left-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-all p-3 hover:bg-white/10 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateLightbox(-1);
                }}
                aria-label="Previous image"
              >
                <ChevronLeft size={32} strokeWidth={1.5} />
              </button>
            )}
            {selectedImage < projectImages.length - 1 && (
              <button
                className="absolute right-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-all p-3 hover:bg-white/10 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateLightbox(1);
                }}
                aria-label="Next image"
              >
                <ChevronRight size={32} strokeWidth={1.5} />
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
