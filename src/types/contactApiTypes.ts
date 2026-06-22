export interface ContactResponse {
  data: {
    contact_section: ContactSection;
    contact_data: ContactData;
    social_media: SocialMedia;
    seo: SEO;
  };
}

/* ================= CONTACT SECTION ================= */
export interface ContactSection {
  title: string;
  second_title: string;
  short_desc: string;
  long_desc: string | null;
  image: string;
  alt_image: string | null;
}

/* ================= CONTACT DATA ================= */
export interface ContactData {
  email: string;
  phone: ContactPhone[];
  address: ContactAddress[];
}

/* ================= CONTACT PHONE ================= */
export interface ContactPhone {
  id: number;
  name: string;
  code: string;
  phone: string;
  email: string;
}

/* ================= CONTACT ADDRESS ================= */
export interface ContactAddress {
  id: number;
  type: string;
  title: string;
  address: string;
  map_url: string;
  map_link: string | null;
}

/* ================= SOCIAL MEDIA ================= */
export interface SocialMedia {
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  pinterest: string;
  snapchat: string;
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