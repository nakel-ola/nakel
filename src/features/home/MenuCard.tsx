import Button from "@/components/Button";
import { motion } from "framer-motion";
import { ArrowRight } from "iconsax-react";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import {
  useLockedBody,
  useOnClickOutside,
  useScreen,
  useWindowSize,
} from "usehooks-ts";
import { navigation } from "./Header";

type Props = {
  onClose(): void;
};

const MenuCard = (props: Props) => {
  const { onClose } = props;

  const ref = useRef<HTMLDivElement>(null);
  const [_, setIsLocked] = useLockedBody(true);

  const screen = useWindowSize();

  useOnClickOutside(ref, () => {
    setIsLocked(false);
    onClose();
  });

  useEffect(() => {
    if (screen && screen?.width > 1024) {
      setIsLocked(false);
      onClose();
    }
  }, [onClose, screen, setIsLocked]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="lg:hidden fixed top-[60px] left-0 w-full h-screen bg-primary/10"
    >
      <motion.div
        initial={{ marginRight: "-80%" }}
        animate={{ marginRight: "0%" }}
        exit={{ marginRight: "-80%" }}
        ref={ref}
        className="w-[75%] backdrop-blur-sm bg-primary/30 h-screen float-right rounded-tl-lg rounded-bl-lg shadow"
      >
        <ul className="py-5 border-b border-[#313649] px-5">
          {navigation.map((nav, index) => (
            <Link key={index} href={nav.href}>
              <li className="hover:bg-white/10 py-3 mb-2 text-white rounded-md pl-3 font-medium">
                {nav.name}
              </li>
            </Link>
          ))}
        </ul>

        <div className="px-5 space-y-3 py-5">
          <Button className="flex items-center justify-center w-full">
            Get all access
            <ArrowRight className="ml-1" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MenuCard;
