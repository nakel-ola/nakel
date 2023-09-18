import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import React, { ReactNode, useRef } from "react";
import { useOnClickOutside } from "usehooks-ts"




interface Props {
  content?: string | ReactNode;
  children: ReactNode;
  placement?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
  visible?: boolean;
  arrow?: boolean;
  onClickOutside?: () => void;
  onClose?: () => void;
  overlay?: boolean;
}

interface HtmlRefElement {
  current: HTMLDivElement;
}

const Tooltip = ({
  content,
  children,
  placement = "top",
  arrow = true,
  visible,
  overlay = false,
  onClickOutside,
  onClose,
}: Props) => {
  const ref = useRef() as HtmlRefElement;

  useOnClickOutside(ref, () => {
    visible && onClickOutside?.();
    onClose?.();
  });

  const isTop =
    placement === "bottom" ||
    placement === "bottom-left" ||
    placement === "bottom-right";
  const isBottom =
    placement === "top" ||
    placement === "top-left" ||
    placement === "top-right";
  const isX = placement === "left" || placement === "right";

  return (
    <div className="relative bg-transparent">
      <div className="relative bg-transparent">{children}</div>

      <AnimatePresence>
        {visible && (
          <motion.div
            ref={ref}
            exit={{ opacity: 0, scaleY: 0.8 }}
            initial={{ opacity: 0, scaleY: 0.8 }}
            animate={{ opacity: 1, scaleY: 1 }}
            className=""
          >
            <motion.div
              className={clsx(
                "absolute z-10 bg-transparent transition-all duration-300",
                placement === "top" &&
                  `${
                    !overlay ? "bottom-[30px]" : "bottom-[0px]"
                  } left-[50%] translate-x-[-50%]`,
                placement === "top-left" &&
                  `${!overlay ? "bottom-[30px]" : "bottom-[0px]"} right-0`,
                placement === "top-right" &&
                  `${!overlay ? "bottom-[30px]" : "bottom-[0px]"} left-0`,
                placement === "bottom" &&
                  `${
                    !overlay ? "top-[35px]" : "top-[0px]"
                  } left-[50%] translate-x-[-50%]`,
                placement === "bottom-left" &&
                  `${!overlay ? "top-[35px]" : "top-[0px]"} right-0`,
                placement === "bottom-right" &&
                  `${!overlay ? "top-[35px]" : "top-[0px]"} left-0`,
                placement === "left" &&
                  `${
                    !overlay ? "right-[35px]" : "right-[0px]"
                  } top-[50%] translate-y-[-50%]`,
                placement === "right" &&
                  `${
                    !overlay ? "left-[35px]" : "left-[0px]"
                  } top-[50%] translate-y-[-50%]`
              )}
            >
              {arrow && isTop && (
                <div className="w-full h-4">
                  <div
                    className={clsx(
                      "w-0 h-0 border-[8px] border-transparent drop-shadow-md",
                      placement === "bottom" &&
                        "border-b-[16px] border-t-0 border-b-white dark:border-b-neutral-800 mx-auto",
                      placement === "bottom-left" &&
                        "border-b-[16px] border-t-0 border-b-white dark:border-b-neutral-800 float-right mr-[10px]",
                      placement === "bottom-right" &&
                        "border-b-[16px] border-t-0 border-b-white dark:border-b-neutral-800 float-left ml-[10px]"
                    )}
                  />
                </div>
              )}

              {isX && (
                <div className="flex items-center">
                  {arrow && placement === "right" && (
                    <div className="w-4 h-full">
                      <div
                        className={clsx(
                          "w-0 h-0 border-[8px] border-transparent drop-shadow-md",
                          placement === "right" &&
                            "border-r-[16px] border-l-0 border-r-white dark:border-r-neutral-800 my-auto"
                        )}
                      />
                    </div>
                  )}
                  <div className="relative bg-transparent">{content}</div>
                  {arrow && placement === "left" && (
                    <div className="w-4 h-full">
                      <div
                        className={clsx(
                          "w-0 h-0 border-[8px] border-transparent drop-shadow-md",
                          placement === "left" &&
                            "border-l-[16px] border-r-0 border-l-white dark:border-l-neutral-800 my-auto"
                        )}
                      />
                    </div>
                  )}
                </div>
              )}

              {!!(isBottom || isTop) && (
                <div className="relative bg-transparent">{content}</div>
              )}

              {arrow && isBottom && (
                <div className="w-full h-4">
                  <div
                    className={clsx(
                      "w-0 h-0 border-[8px] border-transparent drop-shadow-md",
                      placement === "top" &&
                        "border-t-[16px] border-b-0 border-t-white dark:border-t-neutral-800 mx-auto",
                      placement === "top-left" &&
                        "border-t-[16px] border-b-0 border-t-white dark:border-t-neutral-800 float-right mr-[10px]",
                      placement === "top-right" &&
                        "border-t-[16px] border-b-0 border-t-white dark:border-t-neutral-800 float-left ml-[30px]"
                    )}
                  />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
