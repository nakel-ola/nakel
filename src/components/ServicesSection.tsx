/* eslint-disable @next/next/no-img-element */
import React from "react";

type Props = {};

const items = [
  {
    title: "Frontend Development",
    image: "/undraw_next_js_-8-g5m.svg",
    description:
      "I like to code things from scratch, and enjoy bringing ideas to life",
  },
  {
    title: "Backend Development",
    image: "/undraw_code_typing_re_p8b9.svg",
    description:
      "I am a backend developer with a passion for building beautiful and functioning web server with nodejs,python",
  },
  {
    title: "Mobile Development",
    image: "/undraw_mobile_development_re_wwsn.svg",
    description:
      "I am a Mobile Developer with a passion for building beautiful and functioning mobile application with react native and flutter.",
  },
];

export const ServicesSection = (props: Props) => {
  return (
    <div className="mt-16 desktop:mt-32 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-primary font-bold text-lg text-center">Services</h1>
        <h2 className="text-2xl desktop:text-4xl font-bold text-black text-center my-3">
          I Know That{" "}
          <span className="text-primary drop-shadow-[3px_3px_0px_black] translate-x-[3px] translate-y-[3px] rotate-6">
            Good Apps
          </span>
          <br />
          Means{" "}
          <span className="text-primary drop-shadow-[3px_3px_0px_black] translate-x-[3px] translate-y-[3px] rotate-6">
            Good Business
          </span>
        </h2>
      </div>

      <div className="grid tablet:grid-cols-3 gap-10 max-w-4xl mt-10 mx-5">
        {items.map((item, index) => (
          <div key={index} className="relative">
            <div className="relative flex flex-col h-full  bg-white p-4 rounded-lg ">
              <img src={item.image} alt="" className="h-[100px]" />
              <p className="text-xl font-semibold my-2">{item.title}</p>
              <p className="max-w-lg">{item.description}</p>
            </div>

            <div className="absolute top-2 left-2 rounded -z-10 h-full w-full border-2"></div>
          </div>
        ))}
        <div className=""></div>
      </div>
    </div>
  );
};
