/* eslint-disable @next/next/no-img-element */
import React from "react";
import { NeuButton } from "./NeuButton";

type Props = {};

export const ImageCard = (props: Props) => {
  return (
    <div className="relative hidden tablet:block">
      <div className="relative h-[280px] w-[250px] shadow-[3px_3px_0px_black] bg-red border-2 border-black rotate-3 overflow-hidden">
        <img
          src="/20221013_173628-removebg.png"
          alt=""
          className=" -mt-10 ml-3"
        />
      </div>
      <NeuButton className="bg-yellow absolute -left-10 -top-14 p-2 flex items-center group transition-all duration-500 h-[45px] min-w-[45px] max-w-[200px] hover:shadow-[3px_3px_0px_black]">
        <img src="/icons8-javascript.svg" alt="" className="h-7 w-7" />
        <span className="text-lg pl-2 font-semibold transition-all duration-500 ">
          Javascript
        </span>
      </NeuButton>
      <NeuButton className="bg-green absolute -left-16 top-[160px] p-2 flex items-center group transition-all duration-500 h-[45px] min-w-[45px] max-w-[200px] hover:shadow-[3px_3px_0px_black]">
        <img src="/icons8-node-js.svg" alt="" className="h-7 w-7" />
        <span className="text-lg pl-2 font-semibold transition-all duration-500">
          Node JS
        </span>
      </NeuButton>
      <NeuButton className="bg-blue absolute -right-10 -bottom-20 p-2 flex items-center group transition-all duration-500 h-[45px] min-w-[45px] max-w-[200px] hover:shadow-[3px_3px_0px_black]">
        <img src="/icons8-react.svg" alt="" className="h-7 w-7" />
        <span className="text-lg pl-2 font-semibold transition-all duration-500">
          React JS
        </span>
      </NeuButton>
      <NeuButton className="bg-wine absolute -right-[10px] -top-1 p-2 flex items-center group transition-all duration-500 h-[45px] min-w-[0%] max-w-[100%] hover:shadow-[3px_3px_0px_black]">
        <img src="/icons8-nextjs.svg" alt="" className="h-7 w-7" />
        <span className="text-lg pl-2 font-semibold transition-all duration-500">
          Next JS
        </span>
      </NeuButton>
    </div>
  );
};

export const ImageSmallCard = (props: Props) => {
  return (
    <div className="tablet:hidden flex items-center justify-center w-full mb-20">
      <div className="relative ">
        <div className="relative h-[280px] w-[250px] shadow-[3px_3px_0px_black] bg-red border-2 border-black rotate-3 overflow-hidden">
          <img
            src="/20221013_173628-removebg.png"
            alt=""
            className=" -mt-10 ml-3"
          />
        </div>
        <NeuButton className="bg-yellow absolute -left-10 -top-10 p-2 flex items-center group transition-all duration-500 h-[45px] min-w-[45px] max-w-[200px] hover:shadow-[3px_3px_0px_black]">
          <img src="/icons8-javascript.svg" alt="" className="h-7 w-7" />
          <span className="group-hover:block hidden text-lg pl-2 font-semibold transition-all duration-500 ">
            Javascript
          </span>
        </NeuButton>
        <NeuButton className="bg-green absolute -left-16 top-[160px] p-2 flex items-center group transition-all duration-500 h-[45px] min-w-[45px] max-w-[200px] hover:shadow-[3px_3px_0px_black]">
          <img src="/icons8-node-js.svg" alt="" className="h-7 w-7" />
          <span className="group-hover:block hidden text-lg pl-2 font-semibold transition-all duration-500">
            Node JS
          </span>
        </NeuButton>
        <NeuButton className="bg-blue absolute -right-10 -bottom-14 p-2 flex items-center group transition-all duration-500 h-[45px] min-w-[45px] max-w-[200px] hover:shadow-[3px_3px_0px_black]">
          <img src="/icons8-react.svg" alt="" className="h-7 w-7" />
          <span className="group-hover:block hidden text-lg pl-2 font-semibold transition-all duration-500">
            React JS
          </span>
        </NeuButton>
        <NeuButton className="bg-wine absolute -right-[10px] -top-1 p-2 flex items-center group transition-all duration-500 h-[45px] min-w-[0%] max-w-[100%] hover:shadow-[3px_3px_0px_black]">
          <img src="/icons8-nextjs.svg" alt="" className="h-7 w-7" />
          <span className="text-lg pl-2 font-semibold transition-all duration-500">
            Next JS
          </span>
        </NeuButton>
      </div>
    </div>
  );
};
