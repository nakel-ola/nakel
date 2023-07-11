/* eslint-disable @next/next/no-img-element */
import Button from "@/components/Button";
import { AnimatePresence } from "framer-motion";
import { HambergerMenu } from "iconsax-react";
import Link from "next/link";
import React, { Fragment, useState } from "react";
import { IoClose } from "react-icons/io5";
import MenuCard from "./MenuCard";

type Props = {};

// [rgba(20,24,31, 0.84)]
const Header = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Fragment>
      <header className="flex items-center justify-between py-2 h-[60px] sticky top-0 left-0 px-5 lg:px-16 backdrop-blur-sm bg-primary/30 border-b-[1px] border-[#313649] z-50">
        <div className="flex items-center justify-between w-full">
          <Link href="/">
            <img src="logo-white.png" alt="" className="h-8 w-auto" />
          </Link>

          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-white p-2.5 py-1.5 hover:bg-dark/20 rounded-lg"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center">
            <Button className="text-white px-5 ">LogIn</Button>

            <button
              className="w-[35px] h-[35px] flex items-center justify-center ml-2 rounded-lg hover:bg-dark/20 click lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <IoClose className="text-white" size={25} />
              ) : (
                <HambergerMenu className="text-white" />
              )}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && <MenuCard onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </Fragment>
  );
};

export const navigation = [
  {
    name: "Components",
    href: "/components",
  },
  {
    name: "Templates",
    href: "/templates",
  },
  {
    name: "Pricing",
    href: "/pricing",
  },
];
export default Header;
