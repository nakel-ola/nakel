import { useIntro } from "@/components/providers/Intro";
import { GAME_TO, useMatch } from "@/components/providers/Match";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { FiArrowDown, FiArrowUpRight } from "react-icons/fi";

// three.js only loads in the browser, after the page shell.
const Table3D = dynamic(() => import("@/components/game/Table3D"), { ssr: false });

type Props = {
  resumeUrl?: string;
};

export const Hero = ({ resumeUrl }: Props) => {
  const root = useRef<HTMLElement>(null);
  const { done } = useIntro();
  const { scrollTo } = useSmoothScroll();
  const { score, winner } = useMatch();
  const [playing, setPlaying] = useState(false);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.set(".lt-row", { yPercent: 40, opacity: 0 });
      gsap.set(".hero-fade", { opacity: 0 });
    },
    { scope: root }
  );

  // Lower-third graphics wipe on like a broadcast package.
  useGSAP(
    () => {
      if (!done || prefersReducedMotion()) return;
      gsap
        .timeline({ delay: 0.2 })
        .to(".lt-row", { yPercent: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "expo.out" })
        .to(".hero-fade", { opacity: 1, duration: 0.6, stagger: 0.1 }, "-=0.3");
    },
    { scope: root, dependencies: [done] }
  );

  // Game-over graphic.
  useGSAP(
    () => {
      if (!winner) return;
      gsap.fromTo(
        ".game-over > *",
        { yPercent: 50, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: "expo.out" }
      );
    },
    { scope: root, dependencies: [winner] }
  );

  return (
    <section
      ref={root}
      id="top"
      data-set="Warm-up"
      className="relative h-[100svh] min-h-[620px] touch-pan-y select-none overflow-hidden bg-[radial-gradient(120%_80%_at_50%_0%,#17181C_0%,#09090A_70%)]"
    >

      <Table3D active={done} onControlChange={setPlaying} />
      {/* Lower-third scrim so the copy reads over the court */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-ink via-ink/70 to-transparent" />

      {/* Name */}
      <div className="pointer-events-none absolute bottom-5 left-4 right-4 z-10 md:bottom-9 md:left-10 md:right-auto">
        <h1 className="lt-row condensed text-[15vw] md:text-[min(7.2vw,7.5rem)]">Olamilekan Nunu</h1>
        <p className="lt-row mt-4 max-w-xl text-lg leading-snug text-line/70 md:text-xl">
          I build fast, friendly products for web and mobile with React, Next.js, Node and Flutter.
        </p>
        <div className="lt-row pointer-events-auto mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
          <div className="flex gap-2">
            <button
              data-cursor
              onClick={() => scrollTo("#work")}
              className="flex items-center gap-1.5 rounded-full bg-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-ball hover:text-line"
            >
              Highlights <FiArrowDown />
            </button>
            {resumeUrl ? (
              <a
                data-cursor
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm font-medium transition-colors hover:border-white/40"
              >
                Résumé <FiArrowUpRight />
              </a>
            ) : null}
          </div>
        </div>
      </div>

      {/* How to play */}
      <p
        className={cn(
          "hero-fade label pointer-events-none absolute left-1/2 top-[5.5rem] z-10 -translate-x-1/2 whitespace-nowrap text-line/40 md:left-auto md:right-5 md:top-1/2 md:translate-x-0 md:-translate-y-1/2 md:[writing-mode:vertical-rl]",
          playing && "text-ball-text"
        )}
      >
        {playing ? `First to ${GAME_TO}` : "Built with three.js · move to play"}
      </p>

      {winner ? (
        <div className="game-over pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="label text-ball-text">Game</p>
          <p className="condensed mt-2 text-[16vw] md:text-[8vw]">{winner === "you" ? "You win" : "Nunu wins"}</p>
          <p className="mt-2 font-mono text-sm tabular-nums text-line/50">
            {score.nunu}–{score.you} · rematch in a sec
          </p>
        </div>
      ) : null}

      <p className="sr-only">
        A playable table-tennis rally. Move your pointer over the table to control the near paddle.
      </p>
    </section>
  );
};
