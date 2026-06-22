export interface ServicesResponse {
  data: {
    services: Service[];
    services_page_section: ServicesPageSectionItem[];
    seo: SEO;
  };
}

/* ================= SERVICE ================= */
export interface Service {
  id: number;
  name: string;
  order: number;
  short_desc: string;
  long_desc: string;
  image: string;
  alt_image: string | null;
  icon: string;
  alt_icon: string | null;
  slug: string;
  slugs: Slugs;
  meta_title: string;
  meta_description: string | null;
  index: number;
}

/* ================= SERVICES PAGE SECTION ================= */

export interface ServicesPageSectionItem {
  id: number;
  key: string;
  title: string;
  second_title: string | null;
  short_desc: string | null;
  long_desc: string | null;
  image: string | null;
  alt_image: string | null;
  icon: string | null;
  alt_icon: string | null;
}

/* ================= SLUGS ================= */
export interface Slugs {
  en: string;
  ar: string;
}

/* ================= SEO ================= */
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

/* ================= META TAGS ================= */
export interface MetaTags {
  content_type: string;
  title: string;
  author: string;
  description: string;
  canonical: string;
  robots: string;
}

/* ================= OPEN GRAPH ================= */
export interface OpenGraph {
  "og:title": string;
  "og:description": string;
  "og:url": string;
  "og:image": string;
  "og:type": string;
}

/* ================= TWITTER ================= */
export interface TwitterCard {
  "twitter:card": string;
  "twitter:title": string;
  "twitter:description": string;
  "twitter:image": string;
}

/* ================= HREFLANG ================= */
export interface HreflangTags {
  en: string;
  ar: string;
  "x-default": string;
}

/* ================= SCHEMA ================= */
export interface SchemaItem {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
}