import { cx } from "class-variance-authority";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  onChange?(value: boolean): void;
  checked?: boolean;
  classes?: {
    root?: string;
    inner?: string;
  };
};

const Radio = (props: Props) => {
  const { onChange, checked = false, classes } = props;
  return (
    <div
      className={twMerge(
        "cursor-pointer h-[25px] w-[25px] rounded-full flex items-center justify-center shrink-0",
        checked ? "bg-primary" : "border-[1.5px] border-gray-400",
        classes?.root
      )}
      onClick={() => onChange?.(!open)}
    >
      <div
        className={twMerge(
          "h-[12px] w-[12px] rounded-full bg-white shadow",
          checked ? "" : "hidden",
          classes?.inner
        )}
      ></div>
    </div>
  );
};

export default Radio;
