import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  endIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, endIcon, onFocus, onBlur, ...props }, ref) => {
    const [focus, setFocus] = React.useState(false);
    return (
      <div
        className={cn(
          "flex items-center justify-between bg-transparent rounded-md overflow-hidden border-2 w-full transition-all duration-300 shadow-[3px_3px_0px_black]",
          focus ? "" : "  border-black"
        )}
      >
        <input
          type={type}
          className={cn(
            "flex h-10 rounded-md bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 outline-none border-0  disabled:cursor-not-allowed disabled:opacity-50  dark:placeholder:text-slate-400 transition-all duration-300",

            className
          )}
          ref={ref}
          onFocus={(e) => {
            onFocus?.(e);
            setFocus(true);
          }}
          onBlur={(e) => {
            onBlur?.(e);
            setFocus(false);
          }}
          {...props}
        />

        {endIcon && <span className="px-2">{endIcon}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
