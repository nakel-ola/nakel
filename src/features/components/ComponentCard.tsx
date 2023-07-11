import { Icon } from "iconsax-react";
import React from "react";

interface Props {
  Icon: Icon;
  title: string;
  subtitle: string;
}

const ComponentCard = (props: Props) => {
  const { Icon, subtitle, title } = props;
  return (
    <div className="min-h-[100px] col-span-1 bg-gradient-to-b from-burnham-800 via-burnham-600 to-burnham-600/5 p-0.5 rounded-lg hover:scale-105 active:scale-95 duration-300 ease-out mb-5 hover:to-burnham-600 transition-all">
      <div className=" bg-dark h-full rounded-lg bg-hero-gradient hover:bg-hero-gradient-big transition-all duration-300 ease-in-out cursor-pointer p-4">
        <div className="">
          <Icon className="text-white" size={30} />
        </div>

        <p className="text-lg text-white mt-2 font-semibold">{title}</p>
        <p className="text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
};

export default ComponentCard;
