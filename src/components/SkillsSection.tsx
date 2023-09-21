/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";
import { RippleCard } from "./RippleCard";
import { Element } from "react-scroll";

type Props = {
  skills: SkillResponse[];
};

const MotionDiv = motion("div");

export const SkillsSection = (props: Props) => {
  const { skills } = props;
  return (
    <Element name="skills" className="py-16 px-5 lg:px-10">
      <div className="py-10 w-full">
        <h2 className="text-3xl lg:text-5xl font-bold text-white text-center my-3">
          My{" "}
          <span className="text-primary drop-shadow-[3px_3px_0px_black] translate-x-[3px] translate-y-[3px] rotate-6">
            Skills
          </span>
        </h2>
      </div>

      <motion.div
        transition={{ staggerChildren: 0.07, delayChildren: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-4 [&>*:not(:nth-child(4n+4))]:lg:border-r-[1px] [&>*:not(:nth-child(2n+2))]:border-r-[1px]"
      >
        {skills.map(({ image, name, color, percentage }, index) => (
          <RippleCard
            key={index}
            Component={MotionDiv}
            className={cn(
              "group h-[200px]  border-b-[1px] border-line-color flex flex-col items-center justify-center hover:bg-card-color relative cursor-pointer",
              index + 1 === skills.length ? "border-b-0" : "",
              index + 1 === skills.length - 1 ? "border-b-0" : ""
            )}
          >
            <div className="relative"></div>
            <div className="absolute h-full w-full top-0 left-0 flex flex-col items-center justify-center">
              <img src={image} alt="" className="h-[50px] w-[50px]" />

              <p className="text-white">{name}</p>
            </div>

            <motion.div
              className={cn(
                `absolute bottom-5 w-[0%] h-[8px] rounded-full px-5 group-hover:opacity-100 opacity-0 duration-500`
              )}
              style={{
                backgroundColor: color,
                width: `${Number(percentage) - 10}%`,
              }}
            ></motion.div>
          </RippleCard>
        ))}
      </motion.div>
    </Element>
  );
};
