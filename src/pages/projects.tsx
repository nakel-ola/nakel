import { ProjectModal } from "@/components/ProjectModal";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { sized } from "@/lib/image";
import { projectsQuery, sanityClient } from "@/lib/sanity";
import { cn } from "@/lib/utils";
import { GetStaticProps } from "next";
import Head from "next/head";
import { useCallback, useMemo, useRef, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";

type Props = {
  projects: ProjectResponse[];
};

export default function Projects({ projects }: Props) {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState("All");
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const close = useCallback(() => setSelected(null), []);

  const filters = useMemo(
    () => ["All", ...Array.from(new Set(projects.flatMap((p) => p.category ?? [])))],
    [projects]
  );
  const visible = projects
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => filter === "All" || p.category?.includes(filter));

  // The preview card trails the cursor and leans into its motion.
  useGSAP(
    () => {
      const el = preview.current;
      gsap.set(el, { xPercent: -50, yPercent: -50, scale: 0 });
      if (!el || !matchMedia("(pointer: fine)").matches) return;
      const dur = prefersReducedMotion() ? 0 : 0.5;
      const xTo = gsap.quickTo(el, "x", { duration: dur, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: dur, ease: "power3.out" });
      const rTo = gsap.quickTo(el, "rotation", { duration: 0.8, ease: "power3.out" });
      let lastX = 0;

      const move = (e: PointerEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
        rTo(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.6));
        lastX = e.clientX;
      };
      window.addEventListener("pointermove", move);
      return () => window.removeEventListener("pointermove", move);
    },
    { scope: root }
  );

  useGSAP(
    () => {
      gsap.to(preview.current, {
        scale: hovered === null ? 0 : 1,
        duration: prefersReducedMotion() ? 0 : 0.5,
        ease: hovered === null ? "power3.out" : "back.out(1.8)",
      });
    },
    { dependencies: [hovered] }
  );

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".proj-row", { y: 40, opacity: 0, stagger: 0.04, duration: 0.7, ease: "expo.out" });
    },
    { scope: root, dependencies: [filter] }
  );

  const active = hovered === null ? null : projects[hovered];

  return (
    <section ref={root} data-set="Archive" className="relative min-h-screen px-4 pb-32 pt-32 md:px-10 md:pt-40">
      <Head>
        <title>All projects · Nakel</title>
      </Head>

      <div className="flex items-end justify-between">
        <h1 className="condensed text-[17vw] md:text-[9vw]">Archive</h1>
        <p className="label pb-2 text-line/40">{projects.length} projects</p>
      </div>

      <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Filter projects">
        {filters.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            data-cursor
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              filter === f ? "border-line bg-line text-ink" : "border-white/15 hover:border-white/40"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="mt-12 border-t border-white/10" onPointerLeave={() => setHovered(null)}>
        {visible.map(({ p, i }) => (
          <li key={p._id} className="proj-row border-b border-white/10">
            <button
              onClick={() => setSelected(i)}
              onPointerEnter={() => setHovered(i)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-6 text-left md:grid-cols-[4rem_1fr_14rem_3rem] md:py-8"
            >
              <span className="font-mono text-xs text-line/35">{String(i + 1).padStart(2, "0")}</span>
              <span className="condensed text-3xl transition-[transform,color] duration-500 ease-expo group-hover:translate-x-3 group-hover:text-ball-text md:text-6xl">
                {p.name}
              </span>
              <span className="hidden font-mono text-[11px] text-line/40 md:block">
                {(p.tech ?? []).slice(0, 3).map((t) => t.name).join(" / ")}
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-colors duration-300 group-hover:border-ball group-hover:bg-ball group-hover:text-line">
                <FiArrowUpRight />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div
        ref={preview}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-40 hidden w-[22rem] md:block"
      >
        <div
          className="overflow-hidden rounded-xl border border-white/10 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]"
        >
          {active?.images?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={sized(active.images[0], 800)}
              alt=""
              className="aspect-[4/3] w-full object-cover"
            />
          ) : null}
        </div>
      </div>

      <ProjectModal
        project={selected === null ? null : projects[selected]}
        onClose={close}
      />
    </section>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const data = await sanityClient.fetch<Props>(projectsQuery);
  return { props: data, revalidate: 60 };
};
