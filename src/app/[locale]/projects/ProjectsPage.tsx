"use client";

import { useMemo, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { gsap } from "gsap";

import { CategoriesResponse } from "@/types/projectsApiTypes";
import ProjectModal from "@/app/components/ProjectModal";
import CategoryCard from "@/app/components/CategoryCard";

export default function ProjectsPage({projectsApiData}: {projectsApiData: CategoriesResponse}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const gridRef = useRef<HTMLDivElement | null>(null);

  const categories = projectsApiData?.data?.categories ?? [];
  console.log(categories);
  

  const selectedCategory = useMemo(() => {
    const slug = searchParams.get("category");
    if (!slug) return null;
    return categories.find((c) => c.slug === slug) ?? null;
  }, [searchParams, categories]);

  const handleCloseModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  useEffect(() => {
    if (!gridRef.current) return;

    const cards = gridRef.current.children;

    const ctx = gsap.context(() => {
      gsap.set(cards, {
        opacity: 0,
        y: 100,
        scale: 0.75,
      });

      gsap.to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        delay: 1,
        ease: "power3.out",
        stagger: 0.15,
      });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen relative overflow-x-hidden bg-gradient-to-br from-black via-neutral-900 to-black flex flex-col justify-center items-center pt-26 xl:pt-32 pb-10">
      <div className="container mx-auto px-5 xl:px-8 flex flex-col gap-6">

        <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categories.map((category) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("category", category.slug);
            params.delete("project");
            const href = `${pathname}?${params.toString()}`;

            return (
              <div key={category.id} className="category-card">
                <CategoryCard category={category} href={href} />
              </div>
            );
          })}
        </div>
      </div>

      <ProjectModal category={selectedCategory} onClose={handleCloseModal} />
    </main>
  );
}
