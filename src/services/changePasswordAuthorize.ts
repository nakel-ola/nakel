import { Awaitable, User } from "next-auth";
import { z } from "zod";
import { Req } from "./loginAuthorize";

type Credentials = Record<never, string> | undefined;
type SigninAuthorize = (
  credentials: Credentials,
  req: Req
) => Awaitable<User | null>;

const changePasswordAuthorize: SigninAuthorize = async (credentials) => {
  try {
    const schema = z.object({
      email: z
        .string({
          required_error: "Email address must be provided",
        })
        .email(),
      verificationCode: z.string().length(21),
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

    return {} as any;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export default changePasswordAuthorize;
