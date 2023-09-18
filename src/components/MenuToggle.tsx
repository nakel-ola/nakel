import { motion } from "framer-motion";
import * as React from "react";
import { RippleCard } from "./RippleCard";

const Path = (props: any) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="#ffffff"
    strokeLinecap="round"
    {...props}
  />
);

interface MenuToggleProps {
  onClick: () => void;
}

export const MenuToggle = ({ onClick }: MenuToggleProps) => (
  <button
    className="h-[40px] w-[40px] rounded-full absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] flex items-center justify-center"
    onClick={onClick}
  >
    <svg width="23" height="23" viewBox="0 0 23 23">
      <Path
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" },
        }}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" },
        }}
      />
    </svg>
  </button>
);
