// import sanityClient from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { createClient } from "next-sanity";

export const config = {
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET ?? "production",
  apiVersion: "2022-08-20",
  useCdn: true,
  token: process.env.SANITY_TOKEN,
};

export const sanityClient = createClient(config);

// export const sanity = sanityClient({
//   projectId: process.env.SANITY_PROJECT_ID,
//   dataset: "production",
//   apiVersion: "2022-08-20",
//   useCdn: true,
//   token: process.env.SANITY_TOKEN,
// });

const builder = imageUrlBuilder(sanityClient);

export const urlFor = (source: string) => builder.image(source);
