import { Metadata } from "next";
import ProjectDetails from "./ProjectDetails";
import { ProjectResponse } from "@/types/singleProjectApiType";
import { fetchProjectDetailsData } from "@/api/projectsService";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; project: string }>;
}): Promise<Metadata> {
  const { locale, project } = await params;
  const projectApiData: ProjectResponse = await fetchProjectDetailsData(locale, project);

  const { seo } = projectApiData.data;

  const metaTags = seo.meta.meta_tags;
  const openGraph = seo.meta.open_graph;
  const twitterCard = seo.meta.twitter_card;
  const hreflang = seo.meta.hreflang_tags;

  return {
    title: metaTags.title,
    description: metaTags.description,
    openGraph: {
      title: openGraph["og:title"],
      description: openGraph["og:description"],
      url: openGraph["og:url"],
      images: [
        {
          url: openGraph["og:image"],
          alt: metaTags.title,
        },
      ],
      type: openGraph["og:type"] as
        | "website"
        | "article"
        | "book"
        | "profile"
        | "music.song"
        | "music.album"
        | "music.playlist"
        | "music.radio_station"
        | "video.movie"
        | "video.episode"
        | "video.tv_show"
        | "video.other",
    },
    twitter: {
      card: twitterCard["twitter:card"] as
        | "summary"
        | "summary_large_image"
        | "app"
        | "player",
      title: twitterCard["twitter:title"],
      description: twitterCard["twitter:description"],
      images: [twitterCard["twitter:image"]],
    },
    metadataBase: new URL(metaTags.canonical),
    robots: metaTags.robots,
    alternates: {
      canonical: metaTags.canonical,
      languages: {
        en: hreflang.en,
        ar: hreflang.ar,
        "x-default": hreflang["x-default"],
      },
    },
  };
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
