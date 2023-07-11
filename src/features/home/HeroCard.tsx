/* eslint-disable @next/next/no-img-element */
import Button from "@/components/Button";
import React from "react";

import { ArrowRight } from "iconsax-react";
import { useRouter } from "next/router";

type Props = {};

const HeroCard = (props: Props) => {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center pt-24 flex-col ">
      <div className="relative rounded-full px-3 py-1 mb-2 text-sm leading-6 text-white ring-1 ring-white/10 bg-dark/10 hover:bg-dark/20 hover:ring-white/20 backdrop-blur-sm">
        Adding our amazing templates very soon.{" "}
        {/* <a href="#" className="font-semibold text-burnham-600">
          <span className="absolute inset-0" aria-hidden="true"></span>Read more{" "}
          <span aria-hidden="true">&rarr;</span>
        </a> */}
      </div>

      <h1 className="text-center bg-gradient-to-br from-white from-30% to-white/30 bg-clip-text text-transparent text-4xl font-bold tracking-tight sm:text-7xl">
        Build your next idea <br />
        even faster.
      </h1>

      <p className="text-gray-400 text-center text-lg leading-8 mt-2">
        🎨🚀 Supercharge your project with dazzling templates. React + Next.js +
        Tailwind CSS. <br /> Learn from the pros. Let&apos;s create web magic!
        🌟
      </p>

      <div className="flex items-center mt-6">
        <Button
          onClick={() => router.push("/components")}
          className="px-3 pb-2 pt-1.5"
        >
          Browse Components
          <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default HeroCard;
