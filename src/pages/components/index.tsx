import { ComponentCard, Sidebar } from "@/features/components";
import { Header } from "@/features/home";
import {
  ArrowDown2,
  Keyboard,
  Menu,
  Settings,
  Star,
  Tag,
  TickSquare,
  UserSquare,
} from "iconsax-react";
import React, { Fragment } from "react";
import { BsCursor } from "react-icons/bs";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaObjectGroup } from "react-icons/fa";
import { MdSmartButton } from "react-icons/md";
import { RxButton } from "react-icons/rx";

export default function Components() {
  return (
    <main className="overflow-visible">
      <Header />

      <div className="mt-10 lg:mt-16 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center mb-10">
          <h1 className="text-burnham-800 font-bold text-lg text-center">
            Components
          </h1>
          <h2 className="text-4xl sm:text-6xl font-bold bg-gradient-to-br from-white from-30% to-white/30 bg-clip-text text-transparent text-center my-3">
            Stunning UI gems for <br /> your next project!
          </h2>

          <p className="text-gray-400 text-center text-lg leading-8 max-w-xl mx-2">
            500+ pro-designed, responsive components for Tailwind. Drop &apos;em
            in, tweak &rsquo;em as you please!
          </p>
        </div>
        {components.map((item, index) => (
          <Fragment key={index}>
            <div className="w-[90%] lg:w-[85%]">
              <p className="text-white font-bold text-xl">{item.title}</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-5 my-5 w-[90%] lg:w-[85%]">
              {item.items.map((item, index) => (
                <ComponentCard key={index} {...item} />
              ))}
            </div>
          </Fragment>
        ))}
      </div>
    </main>
  );
}

const components = [
  {
    title: "Inputs",
    items: [
      {
        title: "Autocomplete",
        subtitle: "3 components",
        Icon: ArrowDown2,
        href: "",
      },
      {
        title: "Buttons",
        subtitle: "3 components",
        href: "",
        Icon: RxButton,
      },
      {
        title: "Button Group",
        subtitle: "3 components",
        href: "",
        Icon: FaObjectGroup,
      },
      {
        title: "Checkbox",
        subtitle: "3 components",
        href: "",
        Icon: TickSquare,
      },
      {
        title: "Rating",
        subtitle: "3 components",
        href: "",
        Icon: Star,
      },
    ],
  },
  {
    title: "Navigation",
    items: [
      {
        title: "Navbar",
        subtitle: "3 components",
        href: "",
        Icon: Menu,
      },
      {
        title: "Pagination",
        subtitle: "3 components",
        href: "",
        Icon: Keyboard,
      },
      {
        title: "Tabs",
        subtitle: "3 components",
        href: "",
        Icon: BsCursor,
      },
    ],
  },
  {
    title: "Data display",
    items: [
      {
        title: "Avatar",
        href: "",
        subtitle: "3 components",
        Icon: UserSquare,
      },
      {
        title: "Badge",
        href: "",
        subtitle: "3 components",
        Icon: Tag,
      },
      {
        title: "Chip",
        href: "",
        subtitle: "3 components",
        Icon: IoCloseCircleOutline,
      },
    ],
  },
];

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
