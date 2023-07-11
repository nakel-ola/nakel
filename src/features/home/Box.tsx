import React, { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  className?: string;
};

const Box = (props: PropsWithChildren<Props>) => {
  const { children, className } = props;
  return (
    <div
      className={twMerge(
        "w-fit bg-dark h-full rounded-lg transition-all duration-300 ease-in-out cursor-pointer p-4 polka-bg border-[1.5px] border-burnham-800",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Box;
