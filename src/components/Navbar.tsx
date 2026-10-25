import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { EMAIL, socials } from "@/lib/site";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useSmoothScroll } from "./providers/SmoothScroll";

type Props = {
  counts?: { work?: number; skills?: number };
};

export const Navbar = ({ counts = {} }: Props) => {
  const router = useRouter();
  const { scrollTo, lock } = useSmoothScroll();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const menuTl = useRef<gsap.core.Timeline | null>(null);

  const links = [
    { id: "top", label: "Home" },
    { id: "about", label: "About" },
    { id: "work", label: "Work", count: counts.work },
    { id: "skills", label: "Skills", count: counts.skills },
    { id: "contact", label: "Contact" },
  ];

  // Transparent over the hero, frosted once the page scrolls.
  useGSAP(() => {
    ScrollTrigger.create({
      start: () => window.innerHeight * 0.85,
      end: "max",
      onToggle: (self) => setSolid(self.isActive),
    });
  });

  useGSAP(
    () => {
      menuTl.current = gsap
        .timeline({ paused: true })
        .set(menu.current, { visibility: "visible" })
        .fromTo(menu.current, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "expo.inOut" })
        .from(".menu-link", { yPercent: 100, stagger: 0.05, duration: 0.7, ease: "expo.out" }, "-=0.3");
    },
    { scope: menu }
  );

  const toggle = (next = !open) => {
    if (next === open) return;
    setOpen(next);
    lock(next);
    if (next) menuTl.current?.play();
    else menuTl.current?.reverse();
  };

  const go = (id: string) => {
    toggle(false);
    if (router.pathname === "/") scrollTo(id === "top" ? 0 : `#${id}`);
    else router.push(id === "top" ? "/" : `/#${id}`);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 text-line transition-[background-color,backdrop-filter] duration-500",
          solid && !open ? "bg-ink/70 backdrop-blur-xl" : "bg-transparent"
        )}
      >
        <div className="flex items-center justify-between px-4 py-5 md:px-[3.5vw] md:py-6">
          <Link href="/" data-cursor className="text-xl font-semibold tracking-tight md:text-2xl">
            Nakel<sup className="ml-0.5 text-[0.55em]">®</sup>
          </Link>

          <nav className="hidden items-center gap-[4.5vw] lg:flex">
            {links.map(({ id, label, count }) => (
              <button key={id} data-cursor onClick={() => go(id)} className="text-[15px]">
                <span className="link-underline">{label}</span>
                {count ? <span className="ml-1 text-[11px] text-line/60">({String(count).padStart(2, "0")})</span> : null}
              </button>
            ))}
          </nav>

          <button
            onClick={() => toggle()}
            aria-expanded={open}
            aria-controls="menu"
            aria-label={open ? "Close menu" : "Open menu"}
            data-cursor
            className="relative z-[60] flex h-10 w-12 flex-col items-end justify-center gap-[7px]"
          >
            <span className={cn("h-[2px] bg-current transition-all duration-500 ease-expo", open ? "w-10 translate-y-[4.5px] rotate-45" : "w-10")} />
            <span className={cn("h-[2px] bg-current transition-all duration-500 ease-expo", open ? "w-10 -translate-y-[4.5px] -rotate-45" : "w-7")} />
          </button>
        </div>
      </header>

      <div
        ref={menu}
        id="menu"
        className="invisible fixed inset-0 z-[45] flex flex-col justify-between bg-brand px-4 pb-8 pt-28 text-line md:px-[3.5vw]"
      >
        <ul>
          {links.map(({ id, label, count }) => (
            <li key={id} className="overflow-hidden border-b border-white/20">
              <button onClick={() => go(id)} className="menu-link flex w-full items-baseline gap-3 py-1 text-left">
                <span className="display text-[15vw] leading-[0.95] md:text-[8vw]">{label}</span>
                {count ? <span className="text-sm text-line/60">({count})</span> : null}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <a href={`mailto:${EMAIL}`} className="link-underline text-lg">
            {EMAIL}
          </a>
          <div className="flex gap-6">
            {socials.map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" className="link-underline text-sm">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
