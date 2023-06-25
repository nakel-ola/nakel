/* eslint-disable @next/next/no-img-element */
import Button from "@/components/Button";
import CustomInput from "@/components/CustomInput";
import Logo from "@/components/Logo";
import PageGradient from "@/components/PageGradient";
import React, { FormEvent, useState } from "react";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };
  return (
    <PageGradient className="flex items-center flex-col justify-center mt-20">
      <Logo />

      <div className="flex items-center flex-col mt-14">
        <p className="text-lg font-medium">Reset your password</p>
        <p className="text-gray-800 max-w-md text-center">
          Enter your email and we&apos;ll send you a link to reset your
          password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 w-[30%] mt-14">
        <CustomInput
          label="Email address"
          required
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          name="email"
          type="email"
          value={email}
          classes={{ inputRoot: "bg-white" }}
        />

        <Button className="w-full">Reset password</Button>
      </form>
      <div className="flex items-center justify-center mt-8">
        <p className="">Don&apos;t have an account?</p>
      </div>
    </PageGradient>
  );
}

export default ForgetPassword;
