import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { useRef, useState } from "react";
import { useIntro } from "./providers/Intro";
import { useSmoothScroll } from "./providers/SmoothScroll";

/** Opening: a counter runs to 100 on the brand blue, then the panel wipes up. */
export const Preloader = () => {
  const { finish } = useIntro();
  const { lock } = useSmoothScroll();
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      let ended = false;
      const end = () => {
        if (ended) return;
        ended = true;
        lock(false);
        setGone(true);
      };

      if (prefersReducedMotion()) {
        gsap.to(root.current, { autoAlpha: 0, duration: 0.3, onStart: finish, onComplete: end });
        return;
      }

      lock(true);
      window.scrollTo(0, 0);
      const count = { v: 0 };

      gsap
        .timeline({ onComplete: end })
        .from(".pl-mark", { yPercent: 100, duration: 0.8, ease: "expo.out" })
        .to(
          count,
          {
            v: 100,
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: () => {
              if (counter.current) counter.current.textContent = String(Math.round(count.v)).padStart(3, "0");
            },
          },
          0
        )
        .to(".pl-bar", { scaleX: 1, duration: 1.5, ease: "power2.inOut" }, 0)
        .to(".pl-mark, .pl-count", { yPercent: -100, duration: 0.5, ease: "power3.in" })
        .add(finish, "-=0.1")
        .to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "expo.inOut" });

      return () => {
        if (!ended) {
          ended = true;
          lock(false);
        }
      };
    },
    { scope: root }
  );

  if (gone) return null;

  return (
    <div
      ref={root}
      aria-hidden
      className="fixed inset-0 z-[100] bg-brand text-line"
      style={{ clipPath: "inset(0 0 0 0)" }}
    >
      <div className="absolute left-4 top-5 overflow-hidden md:left-[3.5vw] md:top-6">
        <p className="pl-mark text-2xl font-semibold tracking-tight">
          Nakel<sup className="ml-0.5 text-[0.55em]">®</sup>
        </p>
      </div>
      <div className="absolute bottom-[6%] left-4 right-4 md:left-[3.5vw] md:right-[3.5vw]">
        <div className="overflow-hidden">
          <span ref={counter} className="pl-count display block text-[28vw] tabular-nums md:text-[16vw]">
            000
          </span>
        </div>
        <div className="mt-4 h-px bg-white/25">
          <div className="pl-bar h-full origin-left scale-x-0 bg-white" />
        </div>
      </div>
    </div>
  );
};
