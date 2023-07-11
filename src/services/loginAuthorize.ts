
import type { Awaitable, RequestInternal, User } from "next-auth";
import { z } from "zod";

export type Req = Pick<
  RequestInternal,
  "body" | "query" | "headers" | "method"
>;
type Credentials = Record<never, string> | undefined;
type SigninAuthorize = (
  credentials: Credentials,
  req: Req
) => Awaitable<User | null>;


const loginAuthorize: SigninAuthorize = async (credentials, req) => {
  try {
    const schema = z.object({
      email: z
        .string({
          required_error: "Email address must be provided",
        })
        .email(),
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

    // const 

    return {} as any;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

export default loginAuthorize;
