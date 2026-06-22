import { StaticImageData } from "next/image";

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: StaticImageData;
}

export interface Category {
  id: string;
  slug: string;
  title: string;
  image: StaticImageData;
  projects: Project[];
}