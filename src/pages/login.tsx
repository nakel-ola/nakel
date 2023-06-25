/* eslint-disable @next/next/no-img-element */
import Button from "@/components/Button";
import CustomInput from "@/components/CustomInput";
import Logo from "@/components/Logo";
import PageGradient from "@/components/PageGradient";
import { Eye, EyeSlash } from "iconsax-react";
import Link from "next/link";
import * as React from "react";

export interface IAppProps {}

export default function Login(props: IAppProps) {
  const [form, setForm] = React.useState({
    email: "",
    password: "",
  });

  const [toggle, setToggle] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <PageGradient className="flex items-center flex-col justify-center mt-20">
      <Logo />

      <form onSubmit={handleSubmit} className="space-y-5 w-[30%] mt-14">
        <CustomInput
          label="Email address"
          onChange={handleChange}
          name="email"
          type="email"
          value={form.email}
          required
          classes={{ inputRoot: "bg-white" }}
        />
        <CustomInput
          label="Password"
          onChange={handleChange}
          name="password"
          type={toggle ? "text" : "password"}
          value={form.password}
          required
          classes={{ inputRoot: "bg-white" }}
          suffix={
            <button
              type="button"
              className="w-[40px] flex items-center justify-center border-0 outline-0"
              onClick={() => setToggle(!toggle)}
            >
              {!toggle ? <Eye /> : <EyeSlash />}
            </button>
          }
        />

        <Button className="w-full">Sign in to account</Button>
      </form>
      <Link href="/forget-password" className="my-8">
        {" "}
        Forget password
      </Link>

      <div className="flex items-center">
        <p className="">Don&apos;t have an account?</p>
      </div>
    </PageGradient>
  );
}
