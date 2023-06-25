/* eslint-disable @next/next/no-img-element */
import { motion } from "framer-motion";
import { ArrowRight, CloseSquare } from "iconsax-react";
import Link from "next/link";
import React, { useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import Button from "./Button";
import { navigations } from "./Header";
import Logo from "./Logo";

type Props = {
  onClose(): void;
};

const Menu = (props: Props) => {
  const { onClose } = props;

  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, onClose);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="lg:hidden fixed top-0 left-0 w-full h-screen backdrop-blur-sm z-50 bg-primary/30"
    >
      <motion.div
        initial={{ marginRight: "-80%" }}
        animate={{ marginRight: "0%" }}
        exit={{ marginRight: "-80%" }}
        ref={ref}
        className="w-[75%] bg-white h-screen float-right rounded-tl-lg rounded-bl-lg shadow"
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-200">
          <Logo />

          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center"
          >
            <CloseSquare variant="Bold" size={32} />
          </button>
        </div>

        {/* <ul className="py-5 border-b border-gray-200 px-5">
          {navigations.map((nav, index) => (
            <Link key={index} href={nav.path}>
              <li className="hover:bg-slate-100 py-3 mb-2 rounded-md pl-3 font-medium">
                {nav.name}
              </li>
            </Link>
          ))}
        </ul> */}

        <div className="px-5 space-y-3 py-5">
          <Button variant="text" className="w-full text-start">
            Sign in
          </Button>

          <Button className="flex items-center justify-center w-full">
            Get all access
            <ArrowRight className="ml-1" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Menu;
