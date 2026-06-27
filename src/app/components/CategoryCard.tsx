"use client";
import { Category } from "@/types/projectsApiTypes";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";


export default function CategoryCard({ category, href }: { category: Category, href: string }) {
  const t = useTranslations("home");

  const getProjectCountLabel = (count: number) => {
    if (count === 1) return t("project");
    if (count === 11) return t("projectsTopTen");
    return t("projects");
  };

  return (
    <Link
      href={href}
      className="group relative block h-80 md:h-86 overflow-hidden border border-white/30 rounded-2xl transition-all duration-500 hover:scale-[1.02] focus:outline-none"
      aria-label={`Open ${category.name}`}
    >
      {/* Image */}
      <Image
        src={category.image}
        alt={category.alt_image || category.name}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 transition-opacity duration-500 group-hover:opacity-60" />

      {/* View Project Count (Reverted to old style) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-neutral-300 text-sm opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 font-medium">
          {t("view")} {category.projects.length}{" "}
          {getProjectCountLabel(category.projects.length)}
        </p>
      </div>

      {/* Corner accent */}
      <div className="absolute z-10 top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-white opacity-0 transition-opacity duration-500 group-hover:opacity-30" />
      <div className="absolute z-10 bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-white opacity-0 transition-opacity duration-500 group-hover:opacity-30" />

      {/* Category Name Rectangle (Inside the card at bottom) */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md py-3 px-5 border-t border-white/10 flex justify-between items-center transition-all duration-300 group-hover:bg-black/80">
        <h2 className="text-base font-medium text-white tracking-wider text-center w-full">
          {category.name}
        </h2>
      </div>
    </Link>
  );
}
