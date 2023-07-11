import { createClient, groq } from "next-sanity";
import { defaultConfig } from "../../sanity.config";

export const sanityClient = createClient({
  ...defaultConfig,
  useCdn: true,
  token: process.env.SANITY_TOKEN,
});
