import type { NextApiRequest, NextApiResponse } from "next";
import { homeQuery, sanityClient } from "@/lib/sanity";

export type ResponseData = {
  about: AboutResponse;
  skills: SkillResponse[];
  projects: ProjectResponse[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | { error: string }>
) {
  try {
    const data: ResponseData = await sanityClient.fetch(homeQuery);
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
