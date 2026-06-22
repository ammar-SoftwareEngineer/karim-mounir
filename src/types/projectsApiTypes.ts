export interface CategoriesResponse {
  data: {
    categories: Category[];
    seo: SEO;
  };
}

/* ================= CATEGORY ================= */
export interface Category {
  id: number;
  name: string;
  order: number | null;
  short_desc: string | null;
  long_desc: string | null;
  image: string;
  alt_image: string | null;
  icon: string;
  alt_icon: string | null;
  slug: string;
  slugs: Slugs;
  meta_title: string | null;
  meta_description: string | null;
  index: number;
  projects: Project[];
}

/* ================= PROJECT ================= */
export interface Project {
  id: number;
  name: string;
  order: number;
  short_desc: string | null;
  long_desc: string | null;
  image: string;
  alt_image: string | null;
  icon: string;
  alt_icon: string | null;
  slug: string;
  slugs: Slugs;
  meta_title: string | null;
  meta_description: string | null;
  index: number;
}

/* ================= SLUGS ================= */
export interface Slugs {
  en: string;
  ar: string;
}

/* ================= SEO (REUSE) ================= */
export interface SEO {
  meta: Meta;
  schema: SchemaItem[];
}

export interface Meta {
  meta_tags: MetaTags;
  open_graph: OpenGraph;
  twitter_card: TwitterCard;
  hreflang_tags: HreflangTags;
}

export interface MetaTags {
  content_type: string;
  title: string;
  author: string;
  description: string;
  canonical: string;
  robots: string;
}

export interface OpenGraph {
  "og:title": string;
  "og:description": string;
  "og:url": string;
  "og:image": string;
  "og:type": string;
}

export interface TwitterCard {
  "twitter:card": string;
  "twitter:title": string;
  "twitter:description": string;
  "twitter:image": string;
}

export interface HreflangTags {
  en: string;
  ar: string;
  "x-default": string;
}

export interface SchemaItem {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
}