import type { Metadata } from "next";

export const SITE_NAME = "Karim Mounir";
export const DEFAULT_DESCRIPTION = "Karim Mounir For Interior Design";
export const API_HOST = "https://api.karimmounir.com";
export const SHARE_IMAGE_PATH = "/logo.jpg";
export const FAVICON_PATH = "/logo.jpg";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://karimmounir.com";


const DEFAULT_SHARE_IMAGE = `${SITE_URL}${SHARE_IMAGE_PATH}`;

type OpenGraphType =
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
  | "video.other";

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

export function getSiteUrl() {
  return SITE_URL;
}

export function normalizeApiUrl(url?: string | null) {
  if (!url) return SITE_URL;
  return url.replace(API_HOST, SITE_URL);
}

export function getShareImageUrl(image?: string | null) {
  const trimmed = image?.trim();

  if (!trimmed || trimmed.includes("noimage")) {
    return DEFAULT_SHARE_IMAGE;
  }

  if (trimmed.startsWith("http")) {
    return normalizeApiUrl(trimmed);
  }

  return `${SITE_URL}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
}

function buildFallbackMetadata(title: string, description?: string): Metadata {
  const pageDescription = description ?? DEFAULT_DESCRIPTION;
  const shareImage = getShareImageUrl();

  return {
    title,
    description: pageDescription,
    metadataBase: new URL(SITE_URL),
    openGraph: {
      title,
      description: pageDescription,
      url: SITE_URL,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: shareImage, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: pageDescription,
      images: [shareImage],
    },
  };
}

export function buildPageSeoMetadata(
  seo: PageSeo | null | undefined,
  fallbackTitle: string,
  fallbackDescription?: string,
): Metadata {
  if (!seo?.meta) {
    return buildFallbackMetadata(fallbackTitle, fallbackDescription);
  }

  const { meta_tags, open_graph, twitter_card, hreflang_tags } = seo.meta;
  const shareImage = getShareImageUrl(open_graph["og:image"]);
  const twitterImage = getShareImageUrl(twitter_card["twitter:image"]);

  return {
    title: meta_tags.title,
    description: meta_tags.description,
    metadataBase: new URL(SITE_URL),
    openGraph: {
      title: open_graph["og:title"] || meta_tags.title,
      description: open_graph["og:description"] || meta_tags.description,
      url: normalizeApiUrl(open_graph["og:url"]),
      siteName: SITE_NAME,
      images: [{ url: shareImage, alt: meta_tags.title }],
      type: (open_graph["og:type"] || "website") as OpenGraphType,
    },
    twitter: {
      card: "summary_large_image",
      title: twitter_card["twitter:title"] || meta_tags.title,
      description:
        twitter_card["twitter:description"] || meta_tags.description,
      images: [twitterImage],
    },
    robots: meta_tags.robots,
    alternates: {
      canonical: normalizeApiUrl(meta_tags.canonical),
      languages: {
        en: normalizeApiUrl(hreflang_tags.en),
        ar: normalizeApiUrl(hreflang_tags.ar),
        "x-default": normalizeApiUrl(hreflang_tags["x-default"]),
      },
    },
  };
}

export const rootSiteMetadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    images: [{ url: getShareImageUrl(), alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: [getShareImageUrl()],
  },
  icons: {
    icon: [{ url: FAVICON_PATH, type: "image/jpeg" }],
    shortcut: FAVICON_PATH,
    apple: FAVICON_PATH,
  },
};
