/* eslint-disable @next/next/no-img-element */
import { useHover3d } from "@/hooks/useHover3d";
import { GithubIcon, GmailIcon, InstagramIcon, LinkedinIcon } from "@/icons";
import Link from "next/link";
import React from "react";
import { RippleCard } from "./RippleCard";

interface Item {
  link: string;
  Icon: any;
}

type Props = {
  resumeUrl: string;
};

export const socialItems: Item[] = [
  {
    link: "mailto:nunuolamilekan@gmail.com",
    Icon: GmailIcon,
  },
  {
    link: "https://www.instagram.com/nakel.ola",
    Icon: InstagramIcon,
  },
  {
    link: "https://github.com/nakel-ola",
    Icon: GithubIcon,
  },
  {
    link: "https://www.linkedin.com/in/olamilekan-nunu/",
    Icon: LinkedinIcon,
  },
];

export const HeroSection = (props: Props) => {
  const { resumeUrl } = props;
  const { ref, transform, transition } = useHover3d({ x: 30, y: -40, z: 30 });

  return (
    <div
      ref={ref}
      className="mt-5 px-5 lg:px-10 flex lg:flex-row flex-col-reverse justify-between gap-5  w-full"
    >
      <div className="w-full h-[500px]">
        <div className="h-[calc(100%-100px)] w-full rounded-3xl relative overflow-hidden border-[1px] border-line-color bg-card-color">
          <div className="h-full w-full relative">
            <div
              className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
              aria-hidden="true"
            >
              <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[hsla(159,82%,55%,1)] to-[hsla(206,98%,48%,1)] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
            </div>
          </div>

          <div className="absolute top-0 left-0 h-full w-full px-5 py-10  lg:p-10 flex flex-col">
            <h1 className="text-3xl lg:text-5xl text-white max-w-xl font-medium ">
              Hello, I&rsquo;m{" "}
              <span className="font-medium text-4xl lg:text-6xl text-primary">
                Olamilekan
              </span>
              , A Full Stack Developer
            </h1>

            <p className="text-white mt-10 max-w-2xl">
              I'm a full stack developer with understanding of both frontend and backend web development. I am 
              proficient in a variety of programming languages, frameworks, and tools, allowing for the development and
              deployment of dynamic online applications, websites, and powerful web services. Excellent organizational
              skills, great attention to detail, and an aptitude for creative problem-solving.
            </p>
          </div>
        </div>

        <div className="h-fit lg:h-[80px] w-full border-[1px] border-line-color bg-card-color rounded-3xl mt-[20px] flex items-center px-10 flex-col lg:flex-row gap-5 py-5">
          <RippleCard
            Component={Link}
            href={resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-white hover:bg-primary text-black hover:text-white py-2.5 px-10 rounded-full font-medium hover:scale-105 active:scale-95 w-full lg:w-fit text-center"
          >
            My Resume
          </RippleCard>

          <div className="flex space-x-5 items-center">
            {socialItems.map(({ Icon, link }, index) => (
              <RippleCard
                key={index}
                Component={Link}
                href={link}
                target="_blank"
                rel="noreferrer"
                className="app h-[40px] w-[40px] bg-white flex items-center justify-center rounded-full group hover:bg-primary hover:scale-105 active:scale-95"
              >
                <Icon
                  variant="Bold"
                  className="text-black h-[25px] w-[25px]  group-hover:text-white"
                />
              </RippleCard>
            ))}
          </div>
        </div>
      </div>

      <div
        className="w-full lg:w-[364px] h-[356.26px] lg:h-[500px] shrink-0 bg-primary rounded-3xl overflow-hidden"
        style={{ transform, transition }}
      >
        <img
          src="/1695293516052-removebg.webp"
          alt=""
          className="lg:h-full lg:w-full object-cover translate-y-[-10%] lg:translate-y-0"
        />
      </div>
    </div>
  );
};
