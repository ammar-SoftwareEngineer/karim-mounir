export interface ProjectResponse {
  data: {
    project: Project;
    seo: SEO;
  };
}

/* ================= PROJECT ================= */

export interface Project {
  id: number;
  name: string;
  order: number;
  short_desc: string;
  long_desc: string;
  location: string;
  image: string;
  alt_image: string;
  icon: string;
  alt_icon: string;
  slug: string;
  slugs: Slugs;
  meta_title: string;
  meta_description: string | null;
  index: number;
  images: ProjectImage[];
  category: Category;
}

export interface Slugs {
  en: string;
  ar: string;
}

export interface ProjectImage {
  id: number;
  file_name: string;
  file_type: string;
  order: number;
  path: string;
}

/* ================= CATEGORY ================= */

export interface Category {
  id: number;
  name: string;
  order: number;
  short_desc: string | null;
  long_desc: string | null;
  image: string;
  alt_image: string;
  icon: string;
  alt_icon: string;
  slug: string;
  slugs: Slugs;
  meta_title: string | null;
  meta_description: string | null;
  index: number;
}

/* ================= SEO ================= */

export interface SEO {
  meta: Meta;
  schema: Schema[];
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

export interface Schema {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
}