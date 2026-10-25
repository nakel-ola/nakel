import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { EMAIL, sections, socials } from "@/lib/site";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Side, useMatch } from "./providers/Match";
import { useSmoothScroll } from "./providers/SmoothScroll";
import { LagosClock } from "./ui/LagosClock";

/** Score digit that rolls over when it changes. */
const Digit = ({ value }: { value: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    gsap.fromTo(ref.current, { yPercent: 100 }, { yPercent: 0, duration: 0.45, ease: "expo.out" });
  }, [value]);

  return (
    <span className="relative inline-flex h-full w-8 items-center justify-center overflow-hidden bg-line text-ink md:w-9">
      <span ref={ref} className="tabular-nums">
        {value}
      </span>
    </span>
  );
};

const Row = ({ side, name, serving }: { side: Side; name: string; serving: boolean }) => {
  const { score } = useMatch();
  return (
    <div className="flex h-7 items-stretch md:h-8">
      <span className={cn("w-1.5", side === "nunu" ? "bg-rubber" : "bg-line")} />
      <span className="condensed flex w-20 items-center gap-1.5 pl-2.5 text-[17px] md:w-24 md:text-[19px]">
        {name}
        {serving ? <span className="h-1.5 w-1.5 rounded-full bg-ball" aria-label="leading" /> : null}
      </span>
      <Digit value={score[side]} />
    </div>
  );
};

export const Navbar = () => {
  const router = useRouter();
  const { scrollTo, lock } = useSmoothScroll();
  const { score } = useMatch();
  const [set, setSet] = useState({ n: 1, label: "Warm-up" });
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const menuTl = useRef<gsap.core.Timeline | null>(null);

  // The "set" indicator follows whichever section is on screen.
  useGSAP(
    () => {
      const els = gsap.utils.toArray<HTMLElement>("[data-set]");
      els.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 40%",
          end: "bottom 40%",
          // Measure after the pinned sections have added their scroll distance.
          refreshPriority: -1,
          onToggle: (self) => self.isActive && setSet({ n: i + 1, label: el.dataset.set! }),
        });
      });
    },
    { dependencies: [router.pathname], revertOnUpdate: true }
  );

  useGSAP(
    () => {
      menuTl.current = gsap
        .timeline({ paused: true })
        .set(menu.current, { visibility: "visible" })
        .fromTo(menu.current, { yPercent: -100 }, { yPercent: 0, duration: 0.7, ease: "expo.inOut" })
        .from(".menu-link", { yPercent: 105, stagger: 0.05, duration: 0.6, ease: "expo.out" }, "-=0.25");
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
    if (router.pathname === "/") scrollTo(`#${id}`);
    else router.push(`/#${id}`);
  };

  const leader: Side | null = score.nunu === score.you ? null : score.nunu > score.you ? "nunu" : "you";

  return (
    <>
      {/* Scorebug */}
      <Link
        href="/"
        aria-label={`Home. Score: Nunu ${score.nunu}, you ${score.you}`}
        className="fixed left-3 top-3 z-50 flex shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)] md:left-6 md:top-6"
      >
        <div className="plate divide-y divide-line/10">
          <Row side="nunu" name="Nunu" serving={leader === "nunu"} />
          <Row side="you" name="You" serving={leader === "you"} />
        </div>
        <div className="flex flex-col justify-between bg-table-night px-2.5 py-1.5">
          <span className="label text-[9px] text-line/50">Set {set.n}</span>
          <span className="condensed text-[15px] text-ball-text md:text-[17px]">{set.label}</span>
        </div>
      </Link>

      {/* Live indicator + navigation */}
      <div className="fixed right-3 top-3 z-50 flex items-stretch gap-1.5 md:right-6 md:top-6">
        <div className="plate hidden items-center gap-2 px-3 md:flex">
          <span className="animate-live h-2 w-2 rounded-full bg-rubber" />
          <span className="label text-line">Live</span>
          <span className="label text-line/50">
            Lagos <LagosClock />
          </span>
        </div>
        <nav className="hidden md:flex">
          {sections.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => go(id)}
              data-cursor
              className="plate condensed border-l border-line/10 px-3 text-[19px] transition-colors hover:bg-ball hover:text-line"
            >
              {label}
            </button>
          ))}
        </nav>
        <button
          onClick={() => toggle()}
          aria-expanded={open}
          aria-controls="menu"
          className="plate condensed relative z-[60] px-3 py-1.5 text-[19px] md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <div
        ref={menu}
        id="menu"
        className="surface invisible fixed inset-0 z-[55] flex flex-col justify-between px-4 pb-8 pt-28 md:hidden"
      >
        <ul>
          {sections.map(({ id, label }, i) => (
            <li key={id} className="overflow-hidden border-b border-line/20">
              <button onClick={() => go(id)} className="menu-link flex w-full items-baseline justify-between py-2">
                <span className="condensed text-[19vw]">{label}</span>
                <span className="label text-line/50">Set {i + 2}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="space-y-4">
          <a href={`mailto:${EMAIL}`} className="block text-lg underline underline-offset-4">
            {EMAIL}
          </a>
          <div className="flex gap-2">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="plate flex h-12 w-12 items-center justify-center"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
