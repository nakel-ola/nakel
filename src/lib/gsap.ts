import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/dist/Draggable";
import { Flip } from "gsap/dist/Flip";
import { InertiaPlugin } from "gsap/dist/InertiaPlugin";
import { Physics2DPlugin } from "gsap/dist/Physics2DPlugin";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { SplitText } from "gsap/dist/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, Draggable, InertiaPlugin, Physics2DPlugin, Flip);
}

export { Draggable, Flip, gsap, InertiaPlugin, ScrollTrigger, SplitText, useGSAP };

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
