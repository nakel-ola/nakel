/* eslint-disable @next/next/no-img-element */
import Button from "@/components/Button";
import PageGradient from "@/components/PageGradient";
import React from "react";

type Props = {};

const ImageCard = (props: Props) => {
  return (
    <PageGradient className="px-5 lg:px-16 flex flex-col lg:flex-row mt-10">
      <div className="h-[300px] lg:w-[699.99px] rounded-lg overflow-hidden">
        <img
          src="/images/Carpatin-v3.0-Thumbnail-1.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className=" lg:px-16 pb-5 pt-5">
        <h1 className=" text-4xl ">Minimal - Client and Admin Dashboard</h1>

        <p className="mt-2">
          Minimal is the perfect UI Kit to start your next project. It provides
          a clean and clear codebase.
        </p>

        <div className="space-x-5 mt-5">
          <Button variant="solid">Buy Now</Button>
          <Button variant="outlined">Live Preview</Button>
        </div>
      </div>
    </PageGradient>
  );
};

export default ImageCard;
