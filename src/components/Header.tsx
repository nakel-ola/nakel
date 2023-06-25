/* eslint-disable @next/next/no-img-element */
import Button from "@/components/Button";
import { AnimatePresence } from "framer-motion";
import { ArrowRight, HambergerMenu } from "iconsax-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";
import { twJoin } from "tailwind-merge";
import { paths } from "./Footer";
import Menu from "./Menu";
import Logo from "./Logo";

type Props = {};

const Header = (props: Props) => {
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const show = () => !paths.includes(router.pathname);
  return show() ? (
    <Fragment>
      <header className="px-5 lg:px-8 py-5 flex items-center justify-between z-50 relative">
        <div className="flex items-center">
          <Link href="/">
            <Logo />
          </Link>
          {/* <div className="hidden sm:ml-6 sm:block">
            <div className="flex space-x-4">
              {navigations.map((nav, index) => (
                <Link
                  key={index}
                  href={nav.path}
                  className={twJoin(
                    "rounded-md px-3 py-2 text-sm font-medium hover:bg-primary/10",
                    router.pathname.startsWith(nav.path)
                      ? "text-primary"
                      : "text-gray-800"
                  )}
                  aria-current="page"
                >
                  {nav.name}
                </Link>
              ))}
            </div>
          </div> */}
        </div>

        <button
          className="lg:hidden h-8 w-8 flex items-center justify-center"
          onClick={() => setIsMenuOpen(true)}
        >
          <HambergerMenu size={32} />
        </button>

        <div className="hidden lg:flex items-center space-x-4">
          <Button onClick={() => router.push("/login")} variant="text">
            Sign in
          </Button>

          <Button
            onClick={() => router.push("/all-access")}
            className="flex items-center"
          >
            Get all access
            <ArrowRight className="ml-1" />
          </Button>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && <Menu onClose={() => setIsMenuOpen(false)} />}
      </AnimatePresence>
    </Fragment>
  ) : (
    false
  );
};

export default Header;

export const navigations = [
  // {
  //   name: "Templates",
  //   path: "/",
  // },
  // {
  //   name: "Projects",
  //   path: "/projects",
  // },
  // {
  //   name: "Api's",
  //   path: "/apis",
  // },
  // {
  //   name: "Components",
  //   path: "/components",
  // },
];
