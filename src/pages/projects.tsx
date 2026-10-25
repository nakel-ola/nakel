import { Footer } from "@/components/Footer";
import { GridLines } from "@/components/ui/GridLines";
import { mergeWork } from "@/data/caseStudies";
import { Flip, gsap, prefersReducedMotion, SplitText, useGSAP } from "@/lib/gsap";
import { projectsQuery, sanityClient } from "@/lib/sanity";
import { cn } from "@/lib/utils";
import { CaseStudy, fromSanity, toProps } from "@/lib/work";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { FiArrowUpRight, FiGrid, FiList } from "react-icons/fi";

type Props = {
  projects: CaseStudy[];
};

type View = "grid" | "list";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Projects({ projects }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState<View>("grid");

  const filters = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((p) => counts.set(p.category, (counts.get(p.category) ?? 0) + 1));
    return [["All", projects.length] as const, ...Array.from(counts.entries())];
  }, [projects]);

  const shown = (p: CaseStudy) => filter === "All" || p.category === filter;

  // Record where everything is, then let React change the layout.
  const change = (next: { filter?: string; view?: View }) => {
    if (!prefersReducedMotion()) flipState.current = Flip.getState(".arc-item, .arc-thumb, .arc-name");
    if (next.filter !== undefined) setFilter(next.filter);
    if (next.view !== undefined) setView(next.view);
  };

  // ...and glide from the old layout to the new one.
  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state) return;
    flipState.current = null;
    Flip.from(state, {
      duration: 0.8,
      ease: "expo.inOut",
      absolute: ".arc-item",
      nested: true,
      prune: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.6, ease: "expo.out" }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.85, duration: 0.4 }),
    });
  }, [filter, view]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      SplitText.create(".arc-title", {
        type: "chars",
        mask: "chars",
        autoSplit: true,
        onSplit: (self) => gsap.from(self.chars, { yPercent: 110, duration: 1.1, stagger: 0.04, ease: "expo.out", delay: 0.1 }),
      });
      gsap.from(".arc-in", { y: 24, opacity: 0, duration: 1, stagger: 0.06, ease: "expo.out", delay: 0.35 });
      gsap.from(".arc-item", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.05,
        ease: "expo.out",
        scrollTrigger: { trigger: ".arc-list", start: "top 90%", once: true },
      });
    },
    { scope: root }
  );

  return (
    <div ref={root}>
      <Head>
        <title>Work · Nakel</title>
      </Head>

      <header className="relative flex min-h-[72svh] flex-col justify-end overflow-hidden bg-[radial-gradient(70%_60%_at_60%_30%,#3B7BF7_0%,#2563EB_45%,#1B47C4_100%)] px-4 pb-6 pt-28 text-line md:px-[3.5vw] md:pb-[3vw]">
        <GridLines x={[3.5, 30, 63, 96.5]} y={[]} className="hidden md:block" />

        <p className="arc-in relative max-w-xs text-[13px] font-medium uppercase leading-snug md:absolute md:left-[3.5vw] md:top-[38%] md:text-[15px]">
          <span className="inline-block w-8 md:w-11" />
          Everything I&rsquo;ve shipped, from desktop apps to the web
        </p>

        <div className="relative mt-10 flex items-end justify-between gap-6">
          <h1 className="arc-title display text-[25vw] md:text-[19vw]">Work</h1>
          <p className="arc-in pb-[2vw] text-sm">({pad(projects.length)})</p>
        </div>

        <div className="relative mt-6 flex flex-col gap-4 border-t border-white/25 pt-5 md:flex-row md:items-center md:justify-between">
          <div className="arc-in flex flex-wrap gap-2" role="tablist" aria-label="Filter by type">
            {filters.map(([name, count]) => (
              <button
                key={name}
                role="tab"
                aria-selected={filter === name}
                data-cursor
                onClick={() => filter !== name && change({ filter: name })}
                className={cn(
                  "border px-3.5 py-2 text-sm transition-colors",
                  filter === name ? "border-line bg-line text-ink" : "border-white/35 hover:border-white"
                )}
              >
                {name}
                <sup className="ml-1 text-[10px] opacity-60">{pad(count)}</sup>
              </button>
            ))}
          </div>
          <div className="arc-in flex gap-1" aria-label="Layout">
            {(
              [
                ["grid", FiGrid],
                ["list", FiList],
              ] as const
            ).map(([v, Icon]) => (
              <button
                key={v}
                aria-pressed={view === v}
                aria-label={`${v} view`}
                data-cursor
                onClick={() => view !== v && change({ view: v })}
                className={cn(
                  "flex h-10 w-10 items-center justify-center border transition-colors",
                  view === v ? "border-line bg-line text-ink" : "border-white/35 hover:border-white"
                )}
              >
                <Icon />
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="bg-paper px-4 py-12 text-ink md:px-[3.5vw] md:py-[4vw]">
        <ul
          className={cn(
            "arc-list",
            view === "grid" ? "grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2 md:gap-[1.6vw] lg:grid-cols-3" : "border-t border-ink"
          )}
        >
          {projects.map((p, i) => (
            <li
              key={p.slug}
              data-flip-id={p.slug}
              className={cn("arc-item", view === "list" && "border-b border-ink/15")}
              style={{ display: shown(p) ? undefined : "none" }}
            >
              <Link
                href={`/work/${p.slug}`}
                className={cn(
                  "group flex",
                  view === "grid"
                    ? "h-full flex-col border border-ink/10 bg-white p-2 transition-transform duration-700 ease-expo hover:-translate-y-1.5"
                    : "items-center gap-4 py-4 md:gap-[2vw]"
                )}
              >
                <span
                  data-flip-id={`${p.slug}-thumb`}
                  className={cn(
                    "arc-thumb relative block shrink-0 overflow-hidden bg-paper",
                    view === "grid" ? "aspect-[16/10] w-full" : "aspect-[16/10] w-24 md:w-40"
                  )}
                >
                  {p.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.cover}
                      alt=""
                      loading={i < 6 ? "eager" : "lazy"}
                      className="h-full w-full object-cover object-center transition-transform duration-[1.2s] ease-expo group-hover:scale-[1.06]"
                    />
                  ) : null}
                  {view === "grid" ? (
                    <span className="absolute left-2 top-2 bg-ink px-2 py-1 text-[11px] tabular-nums text-line">{pad(i + 1)}</span>
                  ) : null}
                </span>

                {view === "grid" ? (
                  <span className="flex items-center justify-between gap-2 px-1 pb-1 pt-3 text-sm">
                    <span data-flip-id={`${p.slug}-name`} className="arc-name flex min-w-0 items-center gap-1.5 font-medium uppercase">
                      <span className="transition-transform duration-700 ease-expo group-hover:rotate-180">✳</span>
                      <span className="truncate">{p.name}</span>
                    </span>
                    <span className="shrink-0 text-ink/55">/{p.category}</span>
                  </span>
                ) : (
                  <>
                    <span data-flip-id={`${p.slug}-name`} className="arc-name min-w-0 flex-1">
                      <span className="display block truncate text-3xl transition-colors duration-300 group-hover:text-brand md:text-[3.6vw]">
                        {p.name}
                      </span>
                      <span className="mt-1 block text-sm text-ink/55 md:hidden">{p.category}</span>
                    </span>
                    <span className="hidden w-40 text-sm text-ink/55 md:block">{p.category}</span>
                    <span className="hidden w-56 text-sm text-ink/55 lg:block">
                      {p.stack
                        .slice(0, 3)
                        .map((t) => t.name)
                        .join(" / ")}
                    </span>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-ink/20 transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-line">
                      <FiArrowUpRight />
                    </span>
                  </>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Footer />
    </div>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { projects } = await sanityClient.fetch<{ projects: ProjectResponse[] }>(projectsQuery);
  return { props: toProps({ projects: mergeWork(projects.map(fromSanity)) }), revalidate: 60 };
};
