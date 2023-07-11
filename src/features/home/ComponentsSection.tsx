import Button from "@/components/Button";
import { ArrowDown2, Icon } from "iconsax-react";
import { useRouter } from "next/router";
import React from "react";

const items = [
  {
    Icon: ArrowDown2,
    title: "Accordions",
    subtitle: "3 components",
  },
  {
    Icon: ArrowDown2,
    title: "Buttons",
    subtitle: "4 components",
  },
  {
    Icon: ArrowDown2,
    title: "Cards",
    subtitle: "4 components",
  },
  {
    Icon: ArrowDown2,
    title: "Carousels",
    subtitle: "1 components",
  },
  {
    Icon: ArrowDown2,
    title: "Countdown",
    subtitle: "1 components",
  },
  {
    Icon: ArrowDown2,
    title: "Dropdown Menu",
    subtitle: "1 components",
  },
  {
    Icon: ArrowDown2,
    title: "Modals",
    subtitle: "3 components",
  },
  {
    Icon: ArrowDown2,
    title: "Navigation",
    subtitle: "3 components",
  },
  {
    Icon: ArrowDown2,
    title: "Notification",
    subtitle: "3 components",
  },
  {
    Icon: ArrowDown2,
    title: "Progress",
    subtitle: "3 components",
    hover: false,
  },
  {
    Icon: ArrowDown2,
    title: "Other",
    subtitle: "3 components",
    hover: false,
  },
  {
    Icon: ArrowDown2,
    title: "Tab",
    subtitle: "3 components",
    hover: false,
  },
];

type Props = {};

const ComponentsSection = (props: Props) => {
  const router = useRouter();
  return (
    <div className="mt-10 lg:mt-16 flex flex-col items-center justify-center ">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-burnham-800 font-bold text-lg text-center">
          Components
        </h1>
        <h2 className="text-4xl sm:text-6xl font-bold text-white text-center my-3">
          Stunning UI gems for <br /> your next project!
        </h2>

        <p className="text-gray-400 text-center text-lg leading-8 max-w-xl mx-2">
          500+ pro-designed, responsive components for Tailwind. Drop &apos;em
          in, tweak &rsquo;em as you please!
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-5 my-10 w-[90%] lg:w-[85%]">
        {items.map((item, index) => (
          <Card key={index} {...item} />
        ))}
      </div>

      <div className="h-[200px] -mt-48 bg-gradient-to-b from-dark/10 via-dark/50 to-dark w-[90%] lg:w-[85%] grid place-items-center">
        <Button
          onClick={() => router.push("/components")}
          className="px-3 pb-2 pt-1.5"
        >
          See more...
        </Button>
      </div>
    </div>
  );
};

interface CardProps {
  Icon: Icon;
  title: string;
  subtitle: string;
}

export const Card = (props: CardProps) => {
  const { Icon, subtitle, title } = props;
  return (
    <div className="min-h-[100px] col-span-1 bg-gradient-to-b from-burnham-800 via-burnham-600 to-burnham-600/5 p-0.5 rounded-lg hover:scale-105 active:scale-95 duration-300 ease-out mb-5 hover:to-burnham-600 transition-all">
      <div className=" bg-dark h-full rounded-lg bg-hero-gradient hover:bg-hero-gradient-big transition-all duration-300 ease-in-out cursor-pointer p-4">
        <div className="">
          <Icon className="text-white text-lg" />
        </div>

        <p className="text-lg text-white mt-2 font-semibold">{title}</p>
        <p className="text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
};

export default ComponentsSection;
