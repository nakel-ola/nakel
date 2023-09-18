/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment } from "react";
import MenuCard from "./MenuCard";
import { RippleCard } from "./RippleCard";

type Props = {};

export const Navbar = (props: Props) => {
  const router = useRouter();

  return (
    <Fragment>
      <nav className="px-5 lg:px-10 py-4 flex items-center justify-between sticky top-0 z-50 bg-dark">
        <Link href="/" className="flex items-center">
          <div className="h-[15px] w-[15px] rounded-full bg-primary"></div>

          <p className="text-white pl-2 text-3xl font-bold">Nakel</p>
        </Link>

        <div className="lg:flex items-center hidden">
          <ul className="hidden lg:flex items-center space-x-8 ">
            {navigations.map((navigation, index) => (
              <li key={index} className="group cursor-pointer">
                <Link
                  href={navigation.href}
                  className="group-hover:text-white text-neutral-500 text-base transition-all duration-300"
                >
                  {navigation.name}
                </Link>
              </li>
            ))}
          </ul>

          <RippleCard
            Component="button"
            className="ml-8 bg-white py-2 px-5 rounded-full font-medium hover:scale-105 active:scale-95"
          >
            Get in touch
          </RippleCard>
        </div>

        <MenuCard />
      </nav>
    </Fragment>
  );
};

export const navigations = [
  // {
  //   name: "Home",
  //   href: "/",
  // },
  {
    name: "About",
    href: "#about_me",
  },
  {
    name: "Skills",
    href: "#skills",
  },
  {
    name: "Services",
    href: "#services",
  },
  {
    name: "Projects",
    href: "#projects",
  },
];
