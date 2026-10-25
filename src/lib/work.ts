import { shot } from "./image";
import { logoFor } from "./logos";
import { projectSlug } from "./slug";

/** One distinct piece of a product (mobile app, API, admin…) and what was built in it. */
export type CasePart = {
  kind: string;
  title: string;
  summary: string;
  points: string[];
  stack: string[];
};

export type CaseLink = { label: string; href: string };

/** Something a person can do in the product, shown with the screen it happens on. */
export type CaseFeature = { title: string; text: string; image: string };

/** Everything a case-study page and a work card need, whatever the project's source. */
export type CaseStudy = {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  role?: string;
  period?: string;
  stack: { name: string; image?: string }[];
  cover?: string;
  /** Width / height of the cover, so cards can reserve space. */
  coverAspect?: number;
  /** Covers that are phone screenshots sit on a backdrop instead of filling the frame. */
  coverFit?: "cover" | "contain";
  screens: string[];
  features: CaseFeature[];
  parts: CasePart[];
  links: CaseLink[];
};

/** Turns a Sanity project into a case study. */
export const fromSanity = (p: ProjectResponse): CaseStudy => {
  const [cover, ...screens] = p.images ?? [];
  const links: CaseLink[] = [];
  if (p.link) links.push({ label: "Visit site", href: p.link });
  if (p.github) links.push({ label: "Source", href: p.github });
  return {
    slug: projectSlug(p.name),
    name: p.name,
    category: p.category?.[0] ?? "Project",
    tagline: (p.tech ?? [])
      .slice(0, 4)
      .map((t) => t.name)
      .join(", "),
    description: p.description,
    stack: (p.tech ?? []).map((t) => ({ name: t.name, image: logoFor(t.name) ?? t.image })),
    cover: cover ? shot(cover, 2000) : undefined,
    screens: screens.map((s) => shot(s, 2000)),
    features: [],
    parts: [],
    links,
  };
};

/** Drops `undefined` fields, which Next.js page props can't serialize. */
export const toProps = <T,>(value: T): T => JSON.parse(JSON.stringify(value));
