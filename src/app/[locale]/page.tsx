import { fetchHomeData } from "@/api/homeService";
import { HomeResponse, Schema } from "@/types/homeApiTypes";
import About from "../components/about/About";
import Hero from "../components/hero/Hero";
import ProjectsSection from "../components/projects/ProjectsSection";
import Services from "../components/services/Services";
import { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const homeApiData: HomeResponse = await fetchHomeData(locale);

  return buildPageMetadata(homeApiData?.seo, { title: "Home" });
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const homeApiData: HomeResponse = await fetchHomeData(locale);

  if (!homeApiData || !homeApiData.seo) {
    return <main className="home"></main>;
  }

  const schema = homeApiData.seo.schema;

  const {
    banner,
    about,
    about_structs,
    services,
    categories,
    sections
  } = homeApiData;

  return (
    <main className="home">
      {schema?.map((schemaItem: Schema, index: number) => (
        <script
          key={`schema-${schemaItem["@type"]}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaItem),
          }}
        />
      ))}

      <Hero banner={banner} />
      <About about={about} about_structs={about_structs} />
      <Services services={services} sections={sections}/>
      <ProjectsSection categories={categories} sections={sections} />
    </main>
  );
}
