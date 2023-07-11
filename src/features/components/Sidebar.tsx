import React from "react";

type Props = {};

const Sidebar = (props: Props) => {
  return (
    <div className="col-span-2 border-r border-[#313649] pt-5 pr-2 sticky top-[60px] h-[calc(100vh-60px)] overflow-y-scroll hidden:">
      {items.map(({ items, name }, index) => (
        <div key={index} className="pb-3">
          <p className="font-bold text-white pb-2">{name}</p>

          {items.map((item, index) => (
            <div
              key={index}
              className="group pl-2 py-2 cursor-pointer hover:bg-white/10 rounded-lg"
            >
              <p className="text-gray-400 group-hover:text-white">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
export default Sidebar;

const items = [
  {
    name: "Inputs",
    items: [
      {
        name: "Autocomplete",
        count: 3,
        href: "",
      },
      {
        name: "Button",
        count: 3,
        href: "",
      },
      {
        name: "Button Group",
        count: 3,
        href: "",
      },
      {
        name: "Checkbox",
        count: 3,
        href: "",
      },
      {
        name: "Rating",
        count: 3,
        href: "",
      },
    ],
  },
  {
    name: "Navigation",
    items: [
      {
        name: "Navbar",
        count: "",
        href: "",
      },
      {
        name: "Pagination",
        count: "",
        href: "",
      },
      {
        name: "Tabs",
        count: "",
        href: "",
      },
    ],
  },
  {
    name: "Data display",
    items: [
      {
        name: "Avatar",
        href: "",
        count: "",
      },
      {
        name: "Badge",
        href: "",
        count: "",
      },
      {
        name: "Chip",
        href: "",
        count: "",
      },
    ],
  },
];
