/* eslint-disable @next/next/no-img-element */
import { cx } from "class-variance-authority";
import React from "react";
import { twJoin } from "tailwind-merge";
import { NeuButton } from "./NeuButton";

type Props = {};

export const AboutMeSection = (props: Props) => {
  return (
    <div className="mt-16 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-primary font-bold text-lg text-center">About me</h1>
        <h2 className="text-2xl desktop:text-4xl font-bold text-black text-center my-3">
          Why{" "}
          <span className="text-primary drop-shadow-[3px_3px_0px_black] translate-x-[3px] translate-y-[3px] rotate-6">
            Hire
          </span>{" "}
          Me
          <br />
          For Your{" "}
          <span className="text-primary drop-shadow-[3px_3px_0px_black] translate-x-[3px] translate-y-[3px] rotate-6">
            Next Project
          </span>
        </h2>
      </div>

      <div className="max-w-4xl flex-col desktop:flex-row mt-10 flex justify-between">
        <div className="w-full grid place-items-center desktop:block">
          <div className="h-[280px] w-[250px] shadow-[3px_3px_0px_black] bg-red border-2 border-black rotate-3 overflow-hidden grid place-items-center">
            <img
              src="/undraw_resume_re_hkth.svg"
              alt=""
              className="h-[80%] w-[80%] object-contain"
            />
          </div>
        </div>
        <div className="max-w-md ml-10 desktop:mt-0 mt-5">
          <p className="">
            I have worked hard over the past few years to expand and advance my
            knownledge of the web in all its facets.I learnts HTML5, Css and
            Javascript throught a Youtube channel call freeCodeCamp. The
            tutorials there helped to lay the basis for my future learing. I was
            able to learn the fundamental of programming utilising the
            javascript programming language. I continued to learn from different
            channel called Clever Programmer.Now I am able to realise project
            from the ground up, design, code and deploy in an organised and
            efficient manner.
          </p>

          {/* progress */}

          {items.map((item, index) => (
            <div key={index} className="mt-4 w-fit">
              <div className="flex justify-between items-center ">
                <p className="font-semibold text-lg">{item.title}</p>

                <p className={cx("text-green font-semibold", item.color)}>
                  {item.percentage}%
                </p>
              </div>
              <div
                className={twJoin(
                  "relative bg-white rounded-lg w-[300px] h-[5px] before:content-[''] before:absolute before:h-full overflow-hidden shadow-[2px_2px_0px_black] border ",
                  item.color
                )}
              ></div>
            </div>
          ))}
          <NeuButton className="mt-5">Hire me</NeuButton>
        </div>
      </div>
    </div>
  );
};

const items = [
  {
    title: "Frontend Development",
    percentage: 92,
    color: "before:bg-wine text-wine before:w-[92%]",
  },
  {
    title: "Mobile Development",
    percentage: 75,
    color: "before:bg-blue text-blue before:w-[75%]",
  },
  {
    title: "Backend Development",
    percentage: 85,
    color: "before:bg-green text-green before:w-[85%]",
  },
];
