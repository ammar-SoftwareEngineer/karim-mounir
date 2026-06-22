import p1 from "@/app/images/p1.jpg";
import p2 from "@/app/images/p2.jpg";
import p3 from "@/app/images/p3.jpg";
import p4 from "@/app/images/p4.jpg";

import { Category } from "@/app/types/project.Types";

export const CATEGORIES: Category[] = [
  {
    id: "commercial",
    slug: "commercial",
    title: "Commercial",
    image: p1,
    projects: [
      {
        id: "c1",
        slug: "modern-office-complex",
        title: "Modern Office Complex",
        description:
          "A state-of-the-art office building featuring sustainable design and cutting-edge technology integration.",
        image: p1,
      },
      {
        id: "c2",
        slug: "retail-plaza",
        title: "Retail Plaza",
        description:
          "Contemporary shopping center with innovative architectural elements and premium finishes.",
        image: p2,
      },
      {
        id: "c3",
        slug: "corporate-headquarters",
        title: "Corporate Headquarters",
        description:
          "Flagship headquarters building with panoramic views and world-class amenities.",
        image: p3,
      },
    ],
  },
  {
    id: "recreational",
    slug: "recreational",
    title: "Recreational",
    image: p2,
    projects: [
      {
        id: "r1",
        slug: "luxury-resort",
        title: "Luxury Resort",
        description:
          "Premium resort complex featuring spa facilities, pools, and entertainment venues.",
        image: p2,
      },
      {
        id: "r2",
        slug: "sports-complex",
        title: "Sports Complex",
        description:
          "Multi-purpose athletic facility with Olympic-standard equipment and training areas.",
        image: p1,
      },
    ],
  },
  {
    id: "residential",
    slug: "residential",
    title: "Residential",
    image: p3,
    projects: [
      {
        id: "res1",
        slug: "urban-living-towers",
        title: "Urban Living Towers",
        description:
          "High-rise residential complex with modern amenities and stunning city views.",
        image: p3,
      },
      {
        id: "res2",
        slug: "garden-villas",
        title: "Garden Villas",
        description:
          "Exclusive villa community surrounded by landscaped gardens and natural beauty.",
        image: p4,
      },
      {
        id: "res3",
        slug: "waterfront-residences",
        title: "Waterfront Residences",
        description:
          "Luxurious apartments overlooking the marina with premium interior finishes.",
        image: p1,
      },
    ],
  },
  {
    id: "administration",
    slug: "administration",
    title: "Administration",
    image: p4,
    projects: [
      {
        id: "a1",
        slug: "government-center",
        title: "Government Center",
        description:
          "Modern administrative building with advanced security and communication systems.",
        image: p4,
      },
      {
        id: "a2",
        slug: "municipal-hall",
        title: "Municipal Hall",
        description:
          "Civic building designed for public accessibility and efficient operations.",
        image: p3,
      },
    ],
  },
];

