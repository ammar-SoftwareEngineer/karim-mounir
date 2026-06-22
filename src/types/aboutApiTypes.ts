export interface AboutResponse {
  data: {
    about: About;
    our_values: OurValues;
    seo: SEO;
  };
}

// About
export interface About {
  title: string;
  title2: string | null;
  short_desc: string;
  long_desc: string;
  text: string;
  image: string;
  alt_image: string | null;
  icon: string;
  alt_icon: string | null;
  vision: Vision;
  statistics: Statistics;
  studio_section: StudioSection;
  team_company_section: TeamCompanySection;
  about_section: AboutSection;
  approach_section: ApproachSection;
}

// Vision
export interface Vision {
  title: string;
  text: string;
  image: string;
  alt_image: string | null;
}

// Approach Section
export interface ApproachSection {
  title: string;
  text: string;
  image: string;
  alt_image: string | null;
  subtitle: string;
}

// Statistics
export interface Statistics {
  years_of_experience: number;
  projects_completed: number;
}

// Studio Section
export interface StudioSection {
  title: string;
  text: string;
  text2: string;
}

// Team & Company
export interface TeamCompanySection {
  team_members: number;
  established_year: number;
}

// About Section
export interface AboutSection {
  title: string;
  text: string;
}

// Our Values
export interface OurValues {
  title: string;
  values: ValueItem[];
}

export interface ValueItem {
  id: number;
  title: string;
  order: number;
  short_desc: string | null;
  long_desc: string | null;
  image: string;
  alt_image: string | null;
  icon: string;
  alt_icon: string | null;
}

// SEO (reusing your previous pattern but structured)
export interface SEO {
  meta: SEOMeta;
  schema: SchemaItem[];
}

export interface SEOMeta {
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

// Schema
export interface SchemaItem {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
}
