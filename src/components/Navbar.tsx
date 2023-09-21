/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import MenuCard from "./MenuCard";
import { RippleCard } from "./RippleCard";

type Props = {};

export const Navbar = (props: Props) => {
  const router = useRouter();

  if (router.pathname === "/admin/[[...index]]") return <Fragment></Fragment>;

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
                <ScrollLink
                  to={navigation.name.toLowerCase()}
                  spy={true}
                  smooth={true}
                  offset={20}
                  duration={500}
                  className="group-hover:text-white text-neutral-500 text-base transition-all duration-300"
                  activeClass="text-primary group-hover:text-primary"
                >
                  {navigation.name}
                </ScrollLink>
              </li>
            ))}
          </ul>

          <RippleCard
            to="contact"
            spy={true}
            smooth={true}
            offset={-80}
            duration={500}
            Component={ScrollLink}
            className="ml-8 bg-white hover:bg-primary text-black hover:text-white  py-2 px-5 rounded-full font-medium hover:scale-105 active:scale-95"
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
  {
    name: "Projects",
    href: "#projects",
  },
  {
    name: "About",
    href: "#about",
  },
  {
    name: "Skills",
    href: "#skills",
  },
];
