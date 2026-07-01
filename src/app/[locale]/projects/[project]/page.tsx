import { Metadata } from "next";
import ProjectDetails from "./ProjectDetails";
import { ProjectResponse } from "@/types/singleProjectApiType";
import { fetchProjectDetailsData } from "@/api/projectsService";
import { buildPageSeoMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; project: string }>;
}): Promise<Metadata> {
  const { locale, project } = await params;
  const projectApiData: ProjectResponse = await fetchProjectDetailsData(locale, project);

  return buildPageSeoMetadata(projectApiData?.data?.seo, "Project");
}

export default async function page({
  params
}: {
  params: Promise<{ locale: string; project: string }>;
}) {
  const { locale, project } = await params;
  const projectApiData: ProjectResponse = await fetchProjectDetailsData(locale, project);
  return <ProjectDetails projectApiData={projectApiData} />;
}
