/* eslint-disable @next/next/no-img-element */

import truncate from "@/lib/truncate";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import React from "react";
import { RippleCard } from "./RippleCard";

type Props = {
  projects: ProjectResponse[];
  showAll?: boolean;
  selected: ProjectResponse | null;
  setSelected: (selected: ProjectResponse | null) => void;
};

export const ProjectsSection = (props: Props) => {
  const { projects, showAll = false, setSelected } = props;

  const router = useRouter();

  const sortedProjects = projects.sort((a, b) => a.pos - b.pos);

  const items = showAll ? sortedProjects : sortedProjects.slice(0, 6);

  // console.log(items);
  return (
    <div className={cn("px-5 lg:px-10", showAll ? "pt-0" : "pt-16 ")}>
      <div className="py-10 w-full">
        <h2 className="text-3xl lg:text-5xl font-bold text-white text-center my-3">
          My Creative{" "}
          <span className="text-primary drop-shadow-[3px_3px_0px_black] translate-x-[3px] translate-y-[3px] rotate-6">
            Projects
          </span>
        </h2>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 lg:gap-8">
        {items.map((item, index) => (
          <Card key={index} {...item} setSelected={setSelected} />
        ))}
      </div>

      {!showAll && (
        <div className="flex items-center justify-center mt-10">
          <RippleCard
            Component="button"
            className="bg-white py-2 px-5 rounded-full font-medium hover:scale-105 active:scale-95"
            onClick={() => router.push("/projects")}
          >
            View more
          </RippleCard>
        </div>
      )}
    </div>
  );
};

type CardProps = ProjectResponse & {
  setSelected: (selected: ProjectResponse | null) => void;
};

const Card = (props: CardProps) => {
  const { description, images, name, tech, _id, setSelected } = props;

  return (
    <div
      className="bg-card-color border-[1px] border-line-color rounded-3xl overflow-hidden min-h-[300px] cursor-pointer"
      onClick={() => setSelected(props)}
    >
      <div className="overflow-hidden w-full h-[280px] relative">
        <motion.img
          initial={false}
          src={images[0]}
          layoutId={`card-${_id}`}
          alt=""
          className="h-full w-full object-cover relative"
        />

        <div className="absolute h-[100px] bottom-0 w-full bg-gradient-to-b from-black/0 via-card-color/60 to-card-color"></div>
      </div>

      <div className="w-full z-10 p-5">
        <p className="text-lg lg:text-2xl font-semibold text-primary">{name}</p>

        <p className="mt-1 text-white">{truncate(description, 50)}</p>

        <div className="flex flex-wrap pt-5 gap-2">
          {tech.slice(0, 5).map(({ color, name, image }, index) => (
            <div
              key={index}
              className="flex items-center px-1 pr-2 border-[1px] rounded-full hover:bg-[#343639] cursor-pointer"
              style={{ borderColor: color }}
            >
              <div className="h-[20px] w-[20px] rounded-full overflow-hidden">
                <img src={image} alt="" className="" />
              </div>

              <p className="text-white pl-1">{name}</p>
            </div>
          ))}

          <div className="flex items-center px-1 pr-2 border-[1px] rounded-full hover:bg-[#343639] cursor-pointer border-green">
            <div className="h-[18px] w-[18px] rounded-full bg-green"></div>

            <p className="text-white pl-1">More...</p>
          </div>
        </div>
      </div>
    </div>
  );
};
