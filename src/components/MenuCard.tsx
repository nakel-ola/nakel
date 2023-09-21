/* eslint-disable @next/next/no-img-element */
import { motion, useCycle } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { Link as ScrollLink } from "react-scroll";
import { useLockedBody, useWindowSize } from "usehooks-ts";
import { socialItems } from "./HeroSection";
import { MenuToggle } from "./MenuToggle";
import { navigations } from "./Navbar";
import { RippleCard } from "./RippleCard";

const MenuCard = () => {
  const [isOpen, toggleOpen] = useCycle(false, true);

  const screen = useWindowSize();
  // const [_, setIsLocked] = useLockedBody(true);

  useEffect(() => {
    if (screen && screen?.width > 1024) {
      // setIsLocked(false);

      if (isOpen) toggleOpen();
    }
  }, [screen, toggleOpen, isOpen]);

  return (
    <motion.div
      initial={false}
      animate={isOpen ? "open" : "closed"}
      // custom={height}
      className="flex items-center justify-center relative lg:hidden"
    >
      <div className="relative"></div>
      <motion.div
        className="fixed bg-card-color"
        variants={{
          open: {
            height: "100vh",
            width: "100%",
            top: 0,
            right: "0px",
          },
          closed: {
            height: "35px",
            width: "35px",
            top: "15px",
            right: "3px",
            borderRadius: "20px",
          },
        }}
      >
        <Navigation onClick={() => toggleOpen()} />
      </motion.div>
      <MenuToggle onClick={() => toggleOpen()} />
    </motion.div>
  );
};

export default MenuCard;

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

export const Navigation = ({ onClick }: { onClick(): void }) => (
  <motion.ul
    variants={variants}
    className="p-[25px] pt-[60px] space-y-10 flex flex-col items-center justify-center"
  >
    {navigations.map((navigation, index) => (
      <motion.li
        key={index}
        variants={menuItemVariants}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="group flex items-center justify-center text-white cursor-pointer"
      >
        <ScrollLink
          to={navigation.name.toLowerCase()}
          spy={true}
          smooth={true}
          offset={20}
          duration={500}
          onClick={onClick}
          className="group-hover:text-white text-neutral-500 text-4xl transition-all duration-300"
        >
          {navigation.name}
        </ScrollLink>
      </motion.li>
    ))}

    <ScrollLink
      to="contact"
      spy={true}
      smooth={true}
      offset={-80}
      duration={500}
    >
      <RippleCard
        Component={MotionButton}
        onClick={onClick}
        variants={{
          open: {
            ...menuItemVariants.open,
            display: "block",
          },
          closed: {
            ...menuItemVariants.closed,
            display: "none",
          },
        }}
        className=" bg-white hover:bg-primary text-black hover:text-white  py-2 px-5 rounded-full font-medium hover:scale-105 active:scale-95"
      >
        Get in touch
      </RippleCard>
    </ScrollLink>

    <motion.li
      key={5}
      variants={{
        open: {
          y: 0,
          opacity: 1,
          display: "flex",
          transition: {
            y: { stiffness: 1000, velocity: -100 },
            staggerChildren: 0.07,
            delayChildren: 0.2,
          },
        },
        closed: {
          y: 50,
          opacity: 0,
          display: "none",
          transition: {
            y: { stiffness: 1000 },
            staggerChildren: 0.05,
            staggerDirection: -1,
          },
        },
      }}
      className="flex items-center space-x-10"
    >
      {socialItems.map(({ Icon, link }, index) => (
        <RippleCard
          key={index + 5}
          Component={MotionLink}
          variants={menuItemVariants}
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
    </motion.li>
  </motion.ul>
);

const MotionButton = motion("button");
const MotionLink = motion(Link);

const menuItemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};
