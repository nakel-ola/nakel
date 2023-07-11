import ripple from "@/utils/ripple";
import { cva } from "class-variance-authority";
import React from "react";
import { twMerge } from "tailwind-merge";

const buttonStyle = cva(
  "h-fit text-white transition-all duration-300 rounded-lg px-2 pb-1.5 pt-1 shrink-0 outline-0 disabled:bg-gray-200 disabled:text-gray-500 font-medium flex items-center justify-center text-center click",
  {
    variants: {
      variant: {
        solid: "bg-burnham-800 hover:bg-burnham-600/80",
        outlined: "border border-primary",
        text: "text-primary",
      },

      size: {
        large: "text-lg py-3 px-5",
        normal: "text-base",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "normal",
    },
  }
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outlined" | "text";
  size?: "normal" | "large";
  splashColor?: string;
}

const Button = (props: ButtonProps) => {
  const {
    className,
    children,
    variant = "solid",
    size = "normal",
    onMouseDown,
    splashColor,
    ...rest
  } = props;

  const rippleColor = variant === "solid" ? "light" : "rgba(0, 157, 105, 0.3)";
  return (
    <button
      onMouseDown={(e: any) => {
        onMouseDown?.(e);
        ripple(e, splashColor ?? rippleColor);
      }}
      className={twMerge(buttonStyle({ variant, size }), className)}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
