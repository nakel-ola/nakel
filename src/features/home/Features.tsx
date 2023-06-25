/* eslint-disable @next/next/no-img-element */
import React from "react";

type Props = {};

const Features = (props: Props) => {
  return <div className="grid lg:grid-cols-3 mt-10 lg:mt-32 gap-5 lg:gap-2 mx-5 lg:mx-10">
    {items.map((item, index) => (
      <div key={index} className="flex items-start">

        <img src={item.icon} alt="" className=" mt-1" />

        <div className="ml-4">
          <h1 className="text-lg font-medium text-primary">{item.title}</h1>
          <p className="text-sm text-gray-600">{item.content}</p>
        </div>
      </div>
    ))}
  </div>;
};

const items = [
  {
    icon: "/logos/phone.svg",
    title: "Crafted with state-of-the-art technologies",
    content:
      "Unleash coding magic! Our templates are like Next.js superstars, giving you a joy-filled codebase that's both productive and a blast to work with. Let's create wonders together! 🎩💻✨",
  },
  {
    icon: "/logos/navigate.svg",
    title: "Seamlessly customizable designs.",
    content:
      "Style with ease! Our designs are powered by handy utility classes, allowing you to simply open the markup in your editor and modify to your heart's content. Total flexibility awaits! 💪✨",
  },
  {
    icon: "/logos/user.svg",
    title: "Crafted by masters",
    content:
      "Expertly coded with Tailwind CSS best practices by the creators and maintainers of the framework. Quality craftsmanship guaranteed. 🏆💻",
  },
];

export default Features;
