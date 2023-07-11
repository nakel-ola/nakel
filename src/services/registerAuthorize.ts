import { sanityClient } from "@/sanity/sanity-utils";
import { Awaitable, User } from "next-auth";
import { z } from "zod";
import { Req } from "./loginAuthorize";

type Credentials = Record<never, string> | undefined;
type SignUpAuthorize = (
  credentials: Credentials,
  req: Req
) => Awaitable<User | null>;

const registerAuthorize: SignUpAuthorize = async (credentials) => {
  try {
    const schema = z.object({
      email: z
        .string({
          required_error: "Email address must be provided",
        })
        .email(),
      plan: z.array(
        z.object({
          name: z.string(),
          paymentId: z.string(),
        })
      ),
      password: z
        .string({
          required_error: "Password must be provided",
        })
        .min(8, "Password must be at least 8 characters"),
    });

    const saveParse = schema.safeParse(credentials);

    if (!saveParse.success && saveParse.error) {
      const message = saveParse.error.errors
        .map((err) => err.message)
        .join(", ");
      throw new Error(message);
    }

    const mutations = [
      {
        create: {
          _id: "123",
          _type: "cms.article",
          title: "An article",
        },
      },
    ];

    const result = await fetch(
      `https://${process.env.SANITY_PROJECT_ID}.api.sanity.io/v2023-05-21/data/mutate/${process.env.SANITY_DATASET}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${process.env.SANITY_TOKEN}`,
        },
        body: JSON.stringify({ mutations }),
      }
    );

    const json = await result.json();
    console.log(json);

    return {
      ...json,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};
export default registerAuthorize;
