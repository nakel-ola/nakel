/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Logo from "./Logo";

type Props = {};

export const paths = ["/login", "/forget-password"];

const Footer = (props: Props) => {
  const router = useRouter();

  const show = () => !paths.includes(router.pathname);
  return show() ? (
    <div className="flex items-center flex-col justify-center mt-10">
      <Logo />

      <p className="mt-5">© 2023 Nakel Labs Inc. All rights reserved.</p>

      <div className="my-5 space-x-10">
        <Link href="#">Privacy policy</Link>
        <Link href="#">Changelog</Link>
      </div>
    </div>
  ) : (
    false
  );
};

export default Footer;
