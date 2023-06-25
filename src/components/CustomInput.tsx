import { cx } from "class-variance-authority";
import React, { ChangeEvent, Fragment, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useOnClickOutside } from "usehooks-ts";

export interface Props
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "prefix" | "onChange"
  > {
  label?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  classes?: {
    root?: string;
    label?: string;
    inputRoot?: string;
    input?: string;
    dropdownRoot?: string;
    dropdownItem?: string;
  };
  open?: boolean;
  onClose?: () => void;
  onChange?(value: string | ChangeEvent): void;
  options?: string[];
  error?: boolean;
}

const CustomInput = (props: Props) => {
  const {
    id,
    name,
    label,
    prefix,
    suffix,
    classes,
    className,
    onFocus,
    onBlur,
    onClick,
    open,
    onClose,
    onChange,
    options,
    value,
    error = false,
    ...rest
  } = props;

  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => onClose?.());

  const [focus, setFocus] = useState(false);
  return (
    <div
      ref={ref}
      className={twMerge("relative", classes?.root)}
      onClick={!open ? onClick : () => {}}
    >
      {label && (
        <label
          htmlFor={name || id}
          className={twMerge(
            "block text-sm font-semibold leading-6 text-gray-900",
            classes?.label
          )}
        >
          {label}
        </label>
      )}
      <div
        className={twMerge(
          "mt-2.5 rounded-md ring-1 ring-inset ring-gray-300 flex items-center overflow-hidden",
          focus ? "ring-2 ring-inset ring-primary" : "",
          error ? "ring-2 ring-inset ring-red-600" : "",
          classes?.inputRoot
        )}
      >
        {prefix}
        <input
          id={id}
          name={name}
          onFocus={(e) => {
            setFocus(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocus(false);
            onBlur?.(e);
          }}
          value={value}
          onChange={onChange}
          {...rest}
          className={twMerge(
            "block w-full border-0 px-3.5 py-2 shadow-sm  placeholder:text-gray-400   sm:leading-6 bg-transparent outline-0 text-gray-900",
            className,
            classes?.input
          )}
        />
        {suffix}
      </div>

      {open && (
        <ul
          className={twMerge(
            "absolute z-10 mt-1 max-h-56 w-[95%] overflow-auto rounded-md bg-white py-1 text-base shadow-lg border-[1px] border-gray-200 focus:outline-none sm:text-sm",
            classes?.dropdownRoot
          )}
          role="listbox"
          aria-labelledby="listbox-label"
          aria-activedescendant="listbox-option-3"
        >
          {options?.map((option, index) => (
            <li
              key={index}
              className={twMerge(
                "text-black relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-gray-100 rounded",
                classes?.dropdownItem
              )}
              id="listbox-option-0"
              role="option"
              aria-selected={
                option.toLowerCase() === value?.toString()?.toLowerCase()
              }
              onClick={() => {
                onChange?.(option);
                onClose?.();
              }}
            >
              <div className="flex items-center">
                {/* <!-- Selected: "font-semibold", Not Selected: "font-normal" --> */}
                <span
                  className={cx(
                    " block truncate",
                    option.toLowerCase() === value?.toString()?.toLowerCase()
                      ? "font-semibold"
                      : "font-normal"
                  )}
                >
                  {option}
                </span>
              </div>

              {option.toLowerCase() === value?.toString()?.toLowerCase() && (
                <span className="text-primary absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomInput;
