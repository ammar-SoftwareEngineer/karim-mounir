export interface HomeResponse {
  banner: Banner;
  about: About;
  about_structs: AboutStruct[];
  services: Service[];
  categories: Category[];
  projects: Project[];
  sections: Section[];
  seo: SEO;
}

/* ================= Banner ================= */
export interface Banner {
  title: string;
  title2: string | null;
  text: string;
  second_text: string;
  image: string;
  alt_image: string | null;
}

/* ================= About ================= */
export interface About {
  title: string;
  title2: string | null;
  short_desc: string;
  text: string;
  image: string;
  alt_image: string | null;
  banner: string;
  alt_banner: string | null;
  banner2: string;
  alt_banner2: string | null;
}

export interface AboutStruct {
  title: string;
  text: string;
  icon: string;
  alt_icon: string | null;
  order: number;
}

/* ================= Services ================= */
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
  meta_title: string | null;
  meta_description: string | null;
  index: number;
}

/* ================= Categories ================= */
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

/* ================= Projects ================= */
export interface Project {
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
  meta_title: string | null;
  meta_description: string | null;
  index: number;
}

/* ================= Sections ================= */

export interface Section {
  id: number;
  key: string;
  title: string;
  second_title: string | null;
  short_desc: string | null;
  long_desc: string | null; // contains HTML string
  image: string | null;
  alt_image: string | null;
  icon: string | null;
  alt_icon: string | null;
}

/* ================= Shared ================= */
export interface Slugs {
  en: string;
  ar: string;
}

/* ================= SEO ================= */
export interface SEO {
  meta: Meta;
  schema: Schema[]; // ✅ updated
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

/* ================= Schema ================= */

export type Schema =
  | WebSiteSchema
  | OrganizationSchema
  | WebPageSchema
  | BreadcrumbListSchema;

interface BaseSchema {
  "@context": "https://schema.org";
  "@type": string;
}

/* ===== WebSite ===== */
export interface WebSiteSchema extends BaseSchema {
  "@type": "WebSite";
  name: string;
  url: string;
}

/* ===== Organization ===== */
export interface OrganizationSchema extends BaseSchema {
  "@type": "Organization";
  name: string;
  url: string;
  logo: string;
  contactPoint: ContactPoint;
}

export interface ContactPoint {
  "@type": "ContactPoint";
  contactType: string;
  telephone: string;
  email: string;
}

/* ===== WebPage ===== */
export interface WebPageSchema extends BaseSchema {
  "@type": "WebPage";
  name: string;
  description: string;
  url: string;
  isPartOf: {
    "@type": "WebSite";
    "@id": string;
  };
}

/* ===== Breadcrumb ===== */
export interface BreadcrumbListSchema extends BaseSchema {
  "@type": "BreadcrumbList";
  itemListElement: ListItem[];
}

export interface ListItem {
  "@type": "ListItem";
  position: number;
  name: string;
  item: string;
}