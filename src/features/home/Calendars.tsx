import { cx } from "class-variance-authority";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import React, { useState } from "react";

type Props = {};

const Calendars = (props: Props) => {
  const [active, setActive] = useState("22");
  return (
    <div className="w-[400px] border-2 border-burnham-800 rounded-lg bg-dark h-[80%] glow p-5">
      <div className="flex items-center justify-between">
        <button className="flex items-center h-[30px] w-[30px] justify-center text-white hover:bg-neutral-800 rounded-lg click">
          <ArrowLeft2 />
        </button>

        <p className="text-white text-lg font-semibold">January</p>

        <button className="flex items-center h-[30px] w-[30px] justify-center text-white hover:bg-neutral-800 rounded-lg click">
          <ArrowRight2 />
        </button>
      </div>

      <div className="mt-5">
        <div className="w-full grid grid-cols-7 gap-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
            (value, index) => (
              <div
                key={index}
                className="h-[20px] flex items-center justify-center"
              >
                <p className="text-white text-sm">{value}</p>
              </div>
            )
          )}
        </div>
        <div className="w-full h-[80%] rounded-lg  mt-3 grid grid-cols-7">
          {items.map((item, index) => (
            <div
              key={index}
              onClick={() => setActive(item.name)}
              className={cx(
                "h-[40px] cursor-pointer flex items-center justify-center rounded-md",
                item.fade ? "" : "hover:bg-neutral-800 click",
                item.name === active ? "bg-burnham-800 hover:bg-burnham-800" : ""
              )}
            >
              <p
                className={cx(
                  " text-sm",
                  item.fade ? "text-gray-500" : "text-white"
                )}
              >
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const items = [
  ...Array.from({ length: 31 - 27 + 1 }, (_, index) => ({
    name: `${27 + index}`,
    fade: true,
  })),
  ...Array.from({ length: 31 - 1 + 1 }, (_, index) => ({
    name: `${1 + index}`,
    fade: false,
  })),
  ...Array.from({ length: 6 - 1 + 1 }, (_, index) => ({
    name: `${1 + index}`,
    fade: true,
  })),
];

export default Calendars;
