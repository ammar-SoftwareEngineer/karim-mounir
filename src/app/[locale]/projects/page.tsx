import { Metadata } from "next";
import ProjectsPage from "./ProjectsPage";
import { CategoriesResponse } from "@/types/projectsApiTypes";
import { fetchProjectsData } from "@/api/projectsService";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const projectsApiData = await fetchProjectsData(locale);

  return buildPageMetadata(
    (projectsApiData?.data as CategoriesResponse["data"] | undefined)?.seo,
    { title: "Projects" },
  );
}

export default async function page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const projectsApiData = await fetchProjectsData(locale);
  const schema = projectsApiData?.data?.seo?.schema;

  return (
    <>
      {schema?.map((schemaItem, index) => (
        <script
          key={`schema-${schemaItem["@type"]}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaItem),
          }}
        />
      ))}
      <ProjectsPage projectsApiData={projectsApiData} />
    </>
  );
}
