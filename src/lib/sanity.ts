import { createClient, groq } from "next-sanity";

export const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET ?? "production",
  apiVersion: "2022-08-20",
  useCdn: true,
  token: process.env.SANITY_TOKEN,
});

export const homeQuery = groq`
  {
    "about": *[_type == "about"][0] {
      ...,
      "image": image.asset->url,
      "resume": resume.asset->url,
    },
    "skills": *[_type == "skills"] | order(createdAt asc) {
      ...,
      "image": image.asset->url,
    },
    "projects": *[_type == "projects"] | order(pos asc) {
      ...,
      "images": images[].asset->url,
      tech[]->{
        ...,
        "image": image.asset->url,
      }
    }
  }
`;

export const projectsQuery = groq`
  {
    "projects": *[_type == "projects"] | order(pos asc) {
      ...,
      "images": images[].asset->url,
      tech[]->{
        ...,
        "image": image.asset->url,
      }
    }
  }
`;
