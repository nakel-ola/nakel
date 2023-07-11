import { z } from "zod";


const fetchUser = async (token: string): Promise<{}> => {

  // const schema = z.object({
  //   uid: z.string().uuid(),
  //   email: z.string().email(),
  //   firstName: z.string(),
  //   lastName: z.string(),
  //   phoneNumber: z.string(),
  //   role: z.enum(["customer", "admin"]),
  //   verified: z.boolean(),
  //   updatedAt: z.string(),
  //   createdAt: z.string(),
  // });

  // const saveParse = schema.safeParse(res.user);

  // if (!saveParse.success) throw new Error("Something went wrong");

  // return saveParse.data as any;

  return {} as any
};

export default fetchUser;
