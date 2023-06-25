/* eslint-disable @next/next/no-img-element */
import Button from "@/components/Button";
import React from "react";

type Props = {};

const Hero = (props: Props) => {
  return (
    <div className="relative">
      <div className="relative w-full px-5 lg:px-10 flex lg:items-center lg:justify-center flex-col">
        <h1 className="text-4xl lg:text-5xl lg:max-w-3xl lg:text-center mt-10 font-bold text-primary">
          Get Ready to Rock with React! <br /> Explore our Awesome Templates{" "}
        </h1>

        <p className="lg:max-w-3xl lg:text-center text-sm mt-5 text-gray-600">
          🎨🚀 Kickstart your project with stunning templates. React + Next.js +
          Tailwind CSS. Learn from experts. Let&apos;s create web wonders! 🌟
        </p>

        <div className="flex lg:items-center space-x-4 mt-5">
          <Button className="flex items-center">Browse template</Button>
          <Button variant="outlined" className="flex items-center">
            Get all access
          </Button>
        </div>
      </div>

      <div className="hidden lg:block absolute top-44 left-12">
        <img src="/logos/typescript.svg" alt="" className="h-10 w-10 rounded-md" />
      </div>
      <div className="hidden lg:block  absolute top-96 lg:top-80 left-[50%]">
        <img src="/logos/logo-javascript.svg" alt="" className="h-10 w-10 rounded-md" />
      </div>
      <div className="absolute top-40 lg:top-32 right-12">
        <img src="/logos/next-js.svg" alt="" className="h-10 w-10 rounded-md" />
      </div>
      <div className="absolute top-0 lg:top-5 right-48 lg:right-40">
        <img src="/logos/react-2.svg" alt="" className="h-10 w-10 rounded-md" />
      </div>
      <div className="hidden lg:block absolute top-20 lg:top-32 left-80 lg:left-72">
        <img src="/logos/nodejs-icon.svg" alt="" className="h-10 w-10 rounded-md" />
      </div>
    </div>
  );
};

export default Hero;
