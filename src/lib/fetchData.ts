import { ResponseData } from "../pages/api";

export const fetchData = async () => {
  try {
    // ${process.env.BASE_URL}
    const res = await fetch(`${process.env.BASE_URL}/api`);

    const data: ResponseData = await res.json();

    return data;
  } catch (err: any) {
    console.log(err);
    throw new Error(err.message);
  }
};
