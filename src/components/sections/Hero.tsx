import { useIntro } from "@/components/providers/Intro";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { GridLines } from "@/components/ui/GridLines";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import type { CaseStudy } from "@/lib/work";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";

type Props = {
  projects: CaseStudy[];
};

const NAME = "Olamilekan";
const YEAR = new Date().getFullYear();

export const Hero = ({ projects }: Props) => {
  const root = useRef<HTMLElement>(null);
  const { done } = useIntro();
  const { scrollTo } = useSmoothScroll();

  // Hidden until the preloader lifts.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.set(".grid-v", { scaleY: 0 });
      gsap.set(".grid-h", { scaleX: 0 });
      gsap.set(".grid-cross", { scale: 0, rotate: -90 });
      gsap.set(".ghost-ch, .name-ch", { yPercent: 105 });
      gsap.set(".hero-photo", { yPercent: 18, opacity: 0, filter: "blur(16px)" });
      gsap.set(".hero-fade", { y: 24, opacity: 0 });
      gsap.set(".hero-card", { x: 60, opacity: 0 });
    },
    { scope: root },
  );

  useGSAP(
    () => {
      if (!done || prefersReducedMotion()) return;
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .to(".grid-v", { scaleY: 1, duration: 1.4, stagger: 0.08, ease: "expo.inOut" })
        .to(".grid-h", { scaleX: 1, duration: 1.4, stagger: 0.08, ease: "expo.inOut" }, "<0.1")
        .to(".grid-cross", { scale: 1, rotate: 0, duration: 0.8, stagger: 0.02 }, "-=0.8")
        .to(".ghost-ch", { yPercent: 0, duration: 1.2, stagger: 0.05 }, 0.2)
        .to(".hero-photo", { yPercent: 0, opacity: 1, filter: "blur(0px)", duration: 1.6 }, 0.3)
        .to(".name-ch", { yPercent: 0, duration: 1.1, stagger: 0.04 }, 0.7)
        .to(".hero-fade", { y: 0, opacity: 1, duration: 1, stagger: 0.08 }, 0.9)
        .to(".hero-card", { x: 0, opacity: 1, duration: 1.2, stagger: 0.12 }, 1);
    },
    { scope: root, dependencies: [done] },
  );

  // Layers drift against each other with the pointer, and part ways on scroll.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // GSAP owns the wrapper's transform, so it takes over the CSS centering too.
      gsap.set(".hero-photo-wrap", { xPercent: -50, x: 0 });
      const layers = [
        { el: ".hero-photo-wrap", x: 14, y: 8 },
        { el: ".hero-ghost", x: -30, y: -12 },
        { el: ".hero-cards", x: 8, y: 6 },
      ].map(({ el, x, y }) => ({
        x,
        y,
        xTo: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3.out" }),
        yTo: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3.out" }),
      }));
      const move = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        layers.forEach((l) => {
          l.xTo(nx * l.x * 2);
          l.yTo(ny * l.y * 2);
        });
      };
      window.addEventListener("pointermove", move);

      const scroll = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
      // Scroll moves its own layer so it never fights the entrance tween on the image.
      gsap.fromTo(
        ".hero-photo-scroll",
        { yPercent: 0, scale: 1 },
        {
          yPercent: 12,
          scale: 0.94,
          ease: "none",
          transformOrigin: "50% 100%",
          scrollTrigger: scroll,
        },
      );
      gsap.to(".hero-ghost-inner", { xPercent: -14, ease: "none", scrollTrigger: scroll });
      gsap.to(".hero-name", { yPercent: -40, ease: "none", scrollTrigger: scroll });

      return () => window.removeEventListener("pointermove", move);
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      className="relative h-[100svh] min-h-[640px] overflow-hidden bg-[radial-gradient(70%_60%_at_55%_35%,#3B7BF7_0%,#2563EB_45%,#1B47C4_100%)] text-line"
    >
      <GridLines x={[3.5, 30, 63, 96.5]} y={[12, 40, 68, 94]} className="hidden md:block" />
      <GridLines x={[4, 96]} y={[11, 94]} className="md:hidden" />

      {/* Giant faded wordmark behind the portrait. */}
      <div aria-hidden className="hero-ghost absolute inset-x-0 top-[24%] md:top-[13%]">
        <p className="hero-ghost-inner display flex justify-center overflow-hidden whitespace-nowrap text-[30vw] text-white/[0.09] md:text-[25vw]">
          {Array.from("NAKEL").map((ch, i) => (
            <span key={i} className="ghost-ch inline-block">
              {ch}
            </span>
          ))}
        </p>
      </div>

      {/* Portrait */}
      <div className="hero-photo-wrap absolute bottom-0 left-1/2 h-[64%] -translate-x-1/2 md:left-[54%] md:h-[88%]">
        <div className="hero-photo-scroll h-full">
          <Image
            src="/photos/hero-cutout.webp"
            alt="Olamilekan Nunu"
            width={1116}
            height={1250}
            priority
            sizes="(max-width: 768px) 100vw, 60vw"
            className="hero-photo h-full w-auto max-w-none select-none [mask-image:linear-gradient(to_bottom,black_75%,transparent)]"
            draggable={false}
          />
        </div>
      </div>

      {/* Statement */}
      <p className="hero-fade absolute left-4 top-[14%] max-w-[17rem] text-[13px] font-medium uppercase leading-snug md:left-[3.5vw] md:top-[42%] md:max-w-[22rem] md:text-[15px]">
        <span className="inline-block w-8 md:w-11" />I build fast, user-focused products for the web
        and mobile, from the database to the last pixel
      </p>

      {/* Name */}
      <div className="hero-name absolute bottom-[5%] left-4 z-10 md:bottom-[8%] md:left-[3.5vw]">
        <p className="hero-fade mb-2 text-lg font-medium md:mb-4 md:text-2xl">©{YEAR}</p>
        <h1 className="display flex overflow-hidden pb-[0.04em] text-[14.6vw] md:text-[9.4vw]">
          {Array.from(NAME).map((ch, i) => (
            <span key={i} className="name-ch inline-block">
              {ch}
            </span>
          ))}
        </h1>
      </div>

      {/* Floating cards */}
      <div className="hero-cards absolute inset-0 hidden md:block">
        <ProjectTicker projects={projects} />
        <button
          data-cursor
          onClick={() => scrollTo("#contact")}
          className="hero-card group absolute bottom-[8%] right-[3.5vw] flex w-[min(30vw,27rem)] items-stretch gap-4 bg-ink p-3 text-left"
        >
          <span className="relative aspect-square w-[34%] shrink-0 overflow-hidden bg-brand">
            <Image
              src="/photos/portrait.webp"
              alt=""
              fill
              sizes="10vw"
              className="object-cover object-top"
            />
          </span>
          <span className="flex flex-1 flex-col justify-between py-1">
            <span className="flex items-start justify-between text-sm text-line/70">
              Let&rsquo;s talk <span className="text-lg leading-none text-line/80">✳</span>
            </span>
            <span className="flex items-end justify-between gap-3">
              <span>
                <span className="block text-lg font-semibold tracking-tight">Olamilekan</span>
                <span className="block text-sm text-line/70">Full-stack developer</span>
              </span>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-line text-ink transition-colors group-hover:bg-brand group-hover:text-line">
                <FiArrowUpRight size={20} />
              </span>
            </span>
          </span>
        </button>
      </div>
    </section>
  );
};

/** The white card in the hero: cycles through recent projects. */
const ProjectTicker = ({ projects }: Props) => {
  const [i, setI] = useState(0);
  const img = useRef<HTMLDivElement>(null);
  const list = projects.filter((p) => p.cover).slice(0, 5);

  useEffect(() => {
    if (list.length < 2 || prefersReducedMotion()) return;
    const id = setInterval(() => setI((n) => (n + 1) % list.length), 3200);
    return () => clearInterval(id);
  }, [list.length]);

  useEffect(() => {
    if (!img.current || prefersReducedMotion()) return;
    gsap.fromTo(
      img.current,
      { clipPath: "inset(0 0 0 100%)" },
      { clipPath: "inset(0 0 0 0%)", duration: 0.9, ease: "expo.inOut" },
    );
  }, [i]);

  const p = list[i];
  if (!p) return null;

  return (
    <Link
      href={`/work/${p.slug}`}
      data-cursor
      className="hero-card group absolute right-[3.5vw] top-[40%] w-[min(17vw,15rem)] bg-white p-2 text-left text-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,0.5)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-paper">
        {list.map((proj, k) =>
          k === i ? (
            <div key={proj.slug} ref={img} className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={proj.cover}
                alt={`Screenshot of ${proj.name}`}
                className="h-full w-full object-cover object-center transition-transform duration-700 ease-expo group-hover:scale-105"
              />
            </div>
          ) : null,
        )}
      </div>
      <div className="flex items-center justify-between gap-2 px-1 pb-0.5 pt-2.5 text-[13px]">
        <span className="flex min-w-0 items-center gap-1.5">
          <span>✳</span>
          <span className="truncate uppercase">{p.name}</span>
        </span>
        <span className="shrink-0 text-ink/60">/{p.category}</span>
      </div>
    </Link>
  );
};
