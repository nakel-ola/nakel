/* eslint-disable @next/next/no-img-element */
import clsx from "clsx";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { IoChevronBack, IoChevronForward, IoClose } from "react-icons/io5";
import {
  useIntersectionObserver,
  useLockedBody,
  useOnClickOutside,
} from "usehooks-ts";

interface Props extends ProjectResponse {
  handleHide(): void;
}

const PopUpCard = (props: Props) => {
  const {
    category,
    description,
    handleHide,
    images,
    link,
    name,
    tech,
    github,
  } = props;

  const ref = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState<number>(0);

  const handleBack = () =>
    setActive(active === 0 ? images.length - 1 : active - 1);

  const handleForward = () =>
    setActive(active === images.length - 1 ? 0 : active + 1);

  useOnClickOutside(ref, handleHide);
  useLockedBody(true);

  return (
    <motion.section className="fixed top-0 left-0 w-full z-[9999] h-full bg-black/40 grid place-items-center text-white">
      <motion.div
        ref={ref}
        className="w-[90%] tablet:w-[625px] rounded-xl overflow-y-scroll h-[95%] 2xl:h-fit bg-black overflow-hidden scrollbar-hide "
      >
        <motion.div
          className="relative grid place-items-center bg-transparent scrollbar-hide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="w-full h-full relative mt-4 flex items-center overflow-x-scroll scrollbar-hide">
            {images.map((image: string, index: number) => (
              <ImageCard
                key={index}
                image={image}
                index={index}
                active={active}
                setActive={setActive}
              />
            ))}
          </motion.div>

          <button
            onClick={handleHide}
            className="absolute top-0 right-0 bg-neutral-900 w-fit m-[20px] rounded-full z-20 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <IoClose className="text-white text-[25px] bg-transparent" />
          </button>

          {active !== 0 && (
            <div
              className="absolute top-[50%] left-0 translate-y-[-50%] p-[5px] hover:scale-110 transition-transform duration-300 ease hover:bg-slate-50/5 rounded-full bg-transparent z-20"
              onClick={handleBack}
            >
              <IoChevronBack className="tablet:text-5xl text-3xl text-white drop-shadow-xl bg-transparent" />
            </div>
          )}

          {active !== images.length - 1 && (
            <div
              className="absolute top-[50%] right-2 rounded-full translate-y-[-50%] p-[5px] hover:scale-110 hover:bg-slate-50/5 transition-transform duration-300 ease bg-transparent z-20"
              onClick={handleForward}
            >
              <IoChevronForward className="tablet:text-5xl text-3xl text-white drop-shadow-2xl bg-transparent" />
            </div>
          )}
        </motion.div>

        <motion.div
          className="flex justify-center items-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          exit={{ opacity: 0 }}
        >
          {images.length > 1 &&
            images.map((_, index: number) => (
              <div
                key={index}
                className={clsx(
                  "rounded-full mx-1 h-2 w-2",
                  index === active ? " bg-white" : "bg-hover/40 "
                )}
                onClick={() => setActive(index)}
              />
            ))}
        </motion.div>

        <motion.div
          className="w-fit bg-transparent mt-2 mb-auto mx-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          exit={{ opacity: 0 }}
        >
          <p className="text-2xl font-extrabold py-2 px-1 bg-transparent">
            {name}
          </p>
          <p className="text-neutral-500 bg-transparent pb-4 px-1">
            {description}
          </p>

          <div className="px-2 py-2 bg-transparent">
            {link ? (
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className="bg-primary/20 w-fit px-4 py-2 rounded-lg my-2 cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 text-primary"
              >
                Live Preview
              </a>
            ) : null}

            {github ? (
              <a
                href={github}
                target="_blank"
                rel="noreferrer"
                className="bg-primary/20 w-fit px-4 py-2 rounded-lg my-2 cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 text-primary ml-2"
              >
                Git link
              </a>
            ) : null}
          </div>

          <div className="bg-transparent my-2 px-2 py-2">
            <p className="bg-transparent text-xl font-bold">Categories</p>
            <div className="flex flex-wrap items-center bg-transparent mt-3">
              {category.map((text: string, index: number) => (
                <button
                  key={index}
                  className="rounded-lg py-1 px-2 transition-all duration-300 ease bg-white text-base cursor-pointer hover:scale-105 text-black font-medium active:scale-95 shrink-0"
                >
                  {text}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-transparent my-2 px-2 py-2">
            <p className="bg-transparent text-xl font-bold">Tech Stack</p>
            <div className="flex flex-wrap items-center bg-transparent">
              {tech.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center flex-col m-2 w-24 h-28 cursor-pointer"
                >
                  <div className="h-[60px] w-[60px] rounded-full flex items-center justify-center active:scale-95 transition-all duration-300">
                    <img
                      src={skill.image}
                      alt=""
                      className="h-14 w-14 object-contain bg-transparent"
                    />
                  </div>
                  <p className="text-base bg-transparent">{skill.name}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

interface ImageProps {
  image: string;
  index: number;
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
}

const ImageCard = (props: ImageProps) => {
  const { image, index, active, setActive } = props;
  const ref = useRef<HTMLDivElement>(null);

  const entry = useIntersectionObserver(ref, { threshold: 0.8 });

  const isVisible = !!entry?.isIntersecting;

  useEffect(() => {
    if (index === active) {
      ref?.current?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "center",
      });
    }
  }, [index, active]);

  useEffect(() => {
    if (isVisible) {
      setActive(index);
    }
  }, [isVisible, setActive, index]);

  return (
    <div
      ref={ref}
      className="w-full tablet:w-fit max-h-[300px] tablet:max-h-[400px] tablet:h-[500px] overflow-hidden rounded-lg shrink-0 mx-2 mb-auto"
    >
      <img
        src={image}
        alt=""
        className="w-full h-full object-contain tablet:object-cover rounded-lg"
      />
    </div>
  );
};

export default PopUpCard;
