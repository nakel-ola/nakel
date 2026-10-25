import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { useRef, useState } from "react";
import { useIntro } from "./providers/Intro";
import { useSmoothScroll } from "./providers/SmoothScroll";

/** Broadcast open: the court lines draw themselves, the match card shows, then we cut to the table. */
export const Preloader = () => {
  const { finish } = useIntro();
  const { lock } = useSmoothScroll();
  const root = useRef<HTMLDivElement>(null);
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

      const lines = gsap.utils.toArray<SVGGeometryElement>(".pl-line");
      lines.forEach((l) => {
        const len = l.getTotalLength();
        gsap.set(l, { strokeDasharray: len, strokeDashoffset: len });
      });

      gsap
        .timeline({ onComplete: end })
        .to(lines, { strokeDashoffset: 0, duration: 0.9, stagger: 0.12, ease: "power2.inOut" })
        .from(".pl-card > *", { clipPath: "inset(0 100% 0 0)", duration: 0.55, stagger: 0.1, ease: "expo.inOut" }, "-=0.4")
        .to({}, { duration: 0.5 })
        .to(".pl-card > *", { clipPath: "inset(0 0 0 100%)", duration: 0.45, stagger: 0.06, ease: "expo.in" })
        .add(finish, "-=0.1")
        .to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 0.8, ease: "expo.inOut" }, "-=0.05");

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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
      style={{ clipPath: "inset(0 0 0 0)" }}
    >
      <svg viewBox="0 0 274 152.5" className="absolute w-[min(80vw,900px)] overflow-visible" fill="none">
        <rect className="pl-line" x="0" y="0" width="274" height="152.5" stroke="#F3F2EC" strokeWidth="1.2" />
        <line className="pl-line" x1="0" y1="76.25" x2="274" y2="76.25" stroke="#F3F2EC" strokeOpacity="0.35" strokeWidth="0.6" />
        <line className="pl-line" x1="137" y1="-8" x2="137" y2="160.5" stroke="#2563EB" strokeWidth="1.6" />
      </svg>

      <div className="pl-card relative text-center">
        <p className="slant mx-auto w-fit bg-ball py-1 pl-3 pr-6 text-line">
          <span className="label font-medium">Live from Lagos</span>
        </p>
        <p className="plate condensed px-6 pb-3 pt-4 text-[16vw] md:text-[7.5vw]">
          Nunu <span className="text-ball-text">vs</span> the web
        </p>
      </div>
    </div>
  );
};
