import ripple from "@/utils/ripple";
import { cva } from "class-variance-authority";
import React from "react";
import { twMerge } from "tailwind-merge";

const buttonStyle = cva(
  "h-fit  transition-colors duration-150 rounded-lg px-2.5 py-2 shrink-0 outline-0 disabled:bg-gray-200 disabled:text-gray-500 font-medium",
  {
    variants: {
      variant: {
        solid: "bg-primary hover:bg-primary/80 text-white",
        outlined: "border-[1.5px] border-primary text-primary",
        text: "text-primary hover:bg-primary/10",
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

  const rippleColor = variant === "solid" ? "light" : "rgba(0, 51, 38, 0.3)";
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
