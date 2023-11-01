/* eslint-disable @next/next/no-img-element */
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon, GithubIcon } from "@/icons";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import { Zoom } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { useLockedBody, useOnClickOutside } from "usehooks-ts";
import { RippleCard } from "./RippleCard";

type Props = {
  selected: ProjectResponse | null;
  setSelected: (selected: ProjectResponse | null) => void;
};
export const Modal = (props: Props) => {
  const { selected, setSelected } = props;

  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => setSelected(null));
  useLockedBody(!!selected);

  if (!selected) return <></>;

  const { _id, name, description, link, github, category, tech } = selected;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 cursor-pointer overflow-y-scroll flex flex-col items-center overflow-hidden">
      <div
        ref={ref}
        className="w-[90%] lg:w-[60%] my-8 bg-card-color border border-line-color overflow-y-scroll  rounded-xl"
      >
        <ImageSlider
          id={`card-${_id}`}
          images={selected.images}
          onClose={() => setSelected(null)}
        />

        <div className="w-fit mt-2 mb-auto mx-3 p-2">
          <p className="text-5xl font-extrabold py-2 text-white">{name}</p>
          <p className="text-neutral-500  pb-4">{description}</p>

          <div className="py-2 flex gap-5 flex-col lg:flex-row">
            {link ? (
              <Link
                href={link}
                target="_blank"
                rel="noreferrer"
                className="bg-red-500 w-fit px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 text-white font-medium"
              >
                Live Preview
              </Link>
            ) : null}

            {github ? (
              <RippleCard
                Component={Link}
                href={github}
                target="_blank"
                rel="noreferrer"
                className="bg-white hover:bg-primary w-fit px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 text-primary hover:text-white flex font-medium group"
              >
                <GithubIcon className="text-primary group-hover:text-white" />

                <span className="ml-2">Github link</span>
              </RippleCard>
            ) : null}
          </div>

          <div className="my-4">
            <p className="text-xl font-bold text-white">Tech Stack</p>

            <div className="flex flex-wrap pt-2 gap-2">
              {tech.map(({ color, name, image }, index) => (
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

type ImageSliderProps = {
  images: string[];
  id: string;
  onClose: () => void;
};

const ImageSlider = (props: ImageSliderProps) => {
  const { images, id, onClose } = props;

  const [active, setActive] = useState(0);

  return (
    <div className="border-b pb-5 border-line-color relative">
      <motion.div
        layoutId={id}
        className="relative w-full max-h-[300px] lg:max-h-[400px] "
      >
        <Zoom
          scale={0.4}
          autoplay={false}
          transitionDuration={300}
          infinite={false}
          defaultIndex={active}
          onChange={(_, to) => setActive(to)}
          prevArrow={
            active !== 0 ? (
              <button className="bg-white p-2 rounded-full font-medium hover:scale-105 active:scale-95 shadow-md shrink-0 ml-2 w-fit">
                <ArrowLeftIcon className="text-black" />
              </button>
            ) : (
              <button></button>
            )
          }
          nextArrow={
            active !== images.length - 1 ? (
              <button className="bg-white p-2 rounded-full font-medium hover:scale-105 active:scale-95 shadow-md shrink-0 mr-2 w-fit">
                <ArrowRightIcon className="text-black" />
              </button>
            ) : (
              <button></button>
            )
          }
        >
          {images.map((image, index) => (
            <div key={index} className="lg:h-[400px]">
              <img
                src={image}
                alt=""
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </Zoom>
      </motion.div>

      <button
        onClick={onClose}
        className="bg-white/20 p-2 rounded-full font-medium hover:scale-105 active:scale-95  shrink-0 ml-2 w-fit absolute top-2 right-2 z-10 lg:hidden"
      >
        <CloseIcon />
      </button>

      <div className="flex justify-center items-center mt-12 lg:mt-4">
        {images.length > 1 &&
          images.map((_, index: number) => (
            <div
              key={index}
              className={cn(
                "rounded-full mx-1 h-2 w-2",
                index === active ? " bg-white" : "bg-hover/40 "
              )}
            />
          ))}
      </div>
    </div>
  );
};
