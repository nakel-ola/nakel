import { GridLines } from "@/components/ui/GridLines";
import { gsap, prefersReducedMotion, SplitText, useGSAP } from "@/lib/gsap";
import type { CaseStudy } from "@/lib/work";
import Link from "next/link";
import { useRef } from "react";
import { FiArrowUpRight } from "react-icons/fi";

type Props = {
  projects: CaseStudy[];
  total: number;
};

export const Work = ({ projects, total }: Props) => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      SplitText.create(".work-title", {
        type: "chars",
        mask: "chars",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.chars, {
            yPercent: 110,
            duration: 1.1,
            stagger: 0.03,
            ease: "expo.out",
            scrollTrigger: { trigger: ".work-title", start: "top 85%", once: true },
          }),
      });

      gsap.utils.toArray<HTMLElement>(".work-card").forEach((card) => {
        gsap.from(card, {
          y: 80,
          opacity: 0,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: card, start: "top 92%", once: true },
        });
      });

      // The middle column drifts against the others as you scroll.
      gsap.matchMedia().add("(min-width: 768px)", () => {
        gsap.fromTo(
          ".work-col-1",
          { y: 120 },
          {
            y: -120,
            ease: "none",
            scrollTrigger: {
              trigger: ".work-grid",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: root },
  );

  const columns = [0, 1, 2].map((c) => projects.filter((_, i) => i % 3 === c));

  return (
    <section
      ref={root}
      id="work"
      className="relative overflow-hidden bg-ink px-4 pb-24 pt-28 text-line md:px-[3.5vw] md:pb-36 md:pt-40"
    >
      <GridLines x={[3.5, 34.33, 65.66, 96.5]} y={[]} className="hidden text-line md:block" />

      <div className="relative flex items-end justify-between gap-6">
        <h2 className="work-title display text-[24vw] md:text-[15vw]">Work</h2>
        <p className="pb-[1.5vw] text-sm text-line/60">({String(total).padStart(2, "0")})</p>
      </div>

      <div className="work-grid relative mt-12 grid gap-4 md:mt-20 md:grid-cols-3 md:gap-[2vw]">
        {columns.map((col, c) => (
          <div key={c} className={`work-col-${c} flex flex-col gap-4 md:gap-[2vw]`}>
            {col.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        ))}
      </div>

      <div className="relative mt-16 flex justify-center md:mt-28">
        <Link
          href="/projects"
          data-cursor
          className="group flex items-center gap-3 border border-line/30 px-6 py-4 text-lg transition-colors hover:border-brand hover:bg-brand"
        >
          See all {total} projects
          <FiArrowUpRight className="transition-transform duration-500 ease-expo group-hover:rotate-45" />
        </Link>
      </div>
    </section>
  );
};

const ProjectCard = ({ project }: { project: CaseStudy }) => {
  const { name, slug, category, cover } = project;
  return (
    <Link
      href={`/work/${slug}`}
      data-cursor
      className="work-card group block w-full bg-white p-2 text-left text-ink transition-transform duration-700 ease-expo hover:-translate-y-2"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-paper">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={`Screenshot of ${name}`}
            loading="lazy"
            className="h-full w-full object-cover object-center transition-transform duration-[1.2s] ease-expo group-hover:scale-[1.06]"
          />
        ) : null}
        <span className="absolute right-2 top-2 flex h-10 w-10 scale-0 items-center justify-center bg-brand text-line transition-transform duration-500 ease-expo group-hover:scale-100">
          <FiArrowUpRight size={18} />
        </span>
      </div>
      <div className="flex items-center justify-between gap-2 px-1 pb-1 pt-3 text-sm">
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="transition-transform duration-700 ease-expo group-hover:rotate-180">
            ✳
          </span>
          <span className="truncate font-medium uppercase">{name}</span>
        </span>
        <span className="shrink-0 text-ink/55">/{category}</span>
      </div>
    </Link>
  );
};
