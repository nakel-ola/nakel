import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { forwardRef } from "react";

const buttonVariants = cva(
  "px-6 py-2 font-medium  w-fit transition-all duration-300 shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] rounded",
  {
    variants: {
      variant: {
        solid: "bg-primary text-white py-[10px] border-[1.5px] border-black",
        outline: "border-2 border-black",
      },
    },

    defaultVariants: {
      variant: "solid",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  endIcon?: string;
}

export const NeuButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
NeuButton.displayName = "NeuButton";
