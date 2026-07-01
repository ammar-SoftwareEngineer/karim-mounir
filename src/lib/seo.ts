import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://karimmounir.com";
const DEFAULT_OG_IMAGE = "/logo.jpg";
const DEFAULT_DESCRIPTION = "Karim Mounir For Interior Design";

type OpenGraphType = NonNullable<Metadata["openGraph"]>["type"];
type TwitterCardType = NonNullable<Metadata["twitter"]>["card"];

export interface PageSeo {
  meta: {
    meta_tags: {
      title: string;
      description: string;
      canonical: string;
      robots: string;
    };
    open_graph: {
      "og:title": string;
      "og:description": string;
      "og:url": string;
      "og:image": string;
      "og:type": string;
    };
    twitter_card: {
      "twitter:card": string;
      "twitter:title": string;
      "twitter:description": string;
      "twitter:image": string;
    };
    hreflang_tags: {
      en: string;
      ar: string;
      "x-default": string;
    };
  };
}

function resolveImage(image?: string | null) {
  const trimmed = image?.trim();
  return trimmed ? trimmed : DEFAULT_OG_IMAGE;
}

export function buildPageMetadata(
  seo: PageSeo | null | undefined,
  fallback: { title: string; description?: string },
): Metadata {
  const fallbackDescription = fallback.description ?? DEFAULT_DESCRIPTION;

  if (!seo?.meta) {
    return {
      title: fallback.title,
      description: fallbackDescription,
      metadataBase: new URL(SITE_URL),
      openGraph: {
        title: fallback.title,
        description: fallbackDescription,
        url: SITE_URL,
        siteName: "Karim Mounir",
        type: "website",
        images: [{ url: DEFAULT_OG_IMAGE, alt: "Karim Mounir" }],
      },
      twitter: {
        card: "summary_large_image",
        title: fallback.title,
        description: fallbackDescription,
        images: [DEFAULT_OG_IMAGE],
      },
    };
  }

  const { meta_tags, open_graph, twitter_card, hreflang_tags } = seo.meta;
  const ogImage = resolveImage(open_graph["og:image"]);
  const twitterImage = resolveImage(
    twitter_card["twitter:image"] || open_graph["og:image"],
  );

  return {
    title: meta_tags.title,
    description: meta_tags.description,
    metadataBase: new URL(meta_tags.canonical || SITE_URL),
    openGraph: {
      title: open_graph["og:title"] || meta_tags.title,
      description: open_graph["og:description"] || meta_tags.description,
      url: open_graph["og:url"],
      siteName: "Karim Mounir",
      images: [{ url: ogImage, alt: meta_tags.title }],
      type: (open_graph["og:type"] || "website") as OpenGraphType,
    },
    twitter: {
      card: (twitter_card["twitter:card"] ||
        "summary_large_image") as TwitterCardType,
      title: twitter_card["twitter:title"] || meta_tags.title,
      description:
        twitter_card["twitter:description"] || meta_tags.description,
      images: [twitterImage],
    },
    robots: meta_tags.robots,
    alternates: {
      canonical: meta_tags.canonical,
      languages: {
        en: hreflang_tags.en,
        ar: hreflang_tags.ar,
        "x-default": hreflang_tags["x-default"],
      },
    },
  };
}
