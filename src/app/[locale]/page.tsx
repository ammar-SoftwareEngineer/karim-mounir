import { fetchHomeData } from "@/api/homeService";
import { HomeResponse, Schema } from "@/types/homeApiTypes";
import About from "../components/about/About";
import Hero from "../components/hero/Hero";
import ProjectsSection from "../components/projects/ProjectsSection";
import Services from "../components/services/Services";
import { Metadata } from "next";
import logo from "../../../public/logo.jpg";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const homeApiData: HomeResponse = await fetchHomeData(locale);

  if (!homeApiData || !homeApiData.seo) {
    return {
      title: "Home",
    };
  }

  const { seo } = homeApiData;

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
          url:"/logo.jpg",
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
