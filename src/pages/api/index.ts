// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { groq } from "next-sanity";
// import {
//   AboutResponse,
//   ProjectResponse,
//   ServiceResponse,
//   SkillResponse,
// } from "../../../typing";
import { sanityClient } from "@/lib/sanity";

const query = groq`
    {
        "about": *[_type == "about"][0] {
          ...,
          "image": image.asset->url,
        },
        "skills": *[_type == "skills"] | order(createdAt asc) {
          ...,
          "image": image.asset->url,
        },
        "services": *[_type == "services"] {
          ...,
          "image": image.asset->url,
        },
        "projects": *[_type == "projects"] | order(createdAt asc) {
            ...,
            "images": images[].asset->url,
            tech[]->{
            ...,
            "image": image.asset->url,
            }
        }
    }
`;

export type ResponseData = {
  about: AboutResponse;
  skills: SkillResponse[];
  services: ServiceResponse[];
  projects: ProjectResponse[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const data: ResponseData = await sanityClient.fetch(query);

    res.status(200).json(data);
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
}
