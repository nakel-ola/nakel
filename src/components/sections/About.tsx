import { GridLines } from "@/components/ui/GridLines";
import { gsap, prefersReducedMotion, SplitText, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { FiPlus } from "react-icons/fi";

type Props = {
  about: AboutResponse;
  projectCount: number;
};

const year = (date?: string) => date?.match(/\d{4}/)?.[0] ?? date ?? "";

export const About = ({ about, projectCount }: Props) => {
  const root = useRef<HTMLElement>(null);
  const works = about.works ?? [];
  const degree = about.educations?.[0];
  const firstYear = Math.min(...works.map((w) => Number(year(w.startDate)) || 9999));

  const facts = [
    { k: "Based in", v: "Lagos, Nigeria" },
    { k: "Currently", v: works[0] ? `${works[0].company}` : "Freelance" },
    { k: "Shipping since", v: Number.isFinite(firstYear) && firstYear < 9999 ? String(firstYear) : "2022" },
    { k: "Projects", v: String(projectCount) },
  ];

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      SplitText.create(".about-title", {
        type: "lines,words",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.words, {
            yPercent: 110,
            duration: 1.1,
            stagger: 0.04,
            ease: "expo.out",
            scrollTrigger: { trigger: ".about-title", start: "top 85%", once: true },
          }),
      });
      gsap.from(".about-fact", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: ".about-facts", start: "top 85%", once: true },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="about" className="relative overflow-hidden bg-paper px-4 pb-24 pt-28 text-ink md:px-[3.5vw] md:pb-36 md:pt-40">
      <GridLines x={[3.5, 50, 96.5]} y={[]} className="hidden text-ink md:block" />

      <div className="relative">
        <p className="text-sm font-medium uppercase">About</p>
        <h2 className="about-title display mt-6 max-w-[14ch] text-[13vw] leading-[0.86] md:text-[7.4vw]">
          Self-taught. Product-minded. Still shipping.
        </h2>

        <dl className="about-facts mt-16 grid grid-cols-2 border-t border-ink/15 md:mt-24 md:grid-cols-4">
          {facts.map(({ k, v }) => (
            <div key={k} className="about-fact border-b border-ink/15 py-6 pr-4 md:border-b-0 md:py-8">
              <dt className="text-sm text-ink/50">{k}</dt>
              <dd className="mt-2 text-2xl font-semibold tracking-tight md:text-4xl">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-2 md:gap-[3.5vw]">
          <div>
            <p className="text-sm font-medium uppercase">Experience</p>
            {degree ? (
              <p className="mt-4 max-w-sm text-ink/55">
                Also studying {degree.degree.toLowerCase().replace("bachelor degree in ", "")} at{" "}
                {degree.institute} ({[degree.startDate, degree.endDate].filter(Boolean).join("–")}).
              </p>
            ) : null}
          </div>
          <Career works={works} />
        </div>
      </div>
    </section>
  );
};

const Career = ({ works }: { works: Works[] }) => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <ul className="border-t border-ink">
      {works.map((work, i) => (
        <CareerRow key={`${work.company}-${i}`} work={work} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
      ))}
    </ul>
  );
};

const CareerRow = ({ work, open, onToggle }: { work: Works; open: boolean; onToggle: () => void }) => {
  const body = useRef<HTMLDivElement>(null);
  const { title, company, startDate, endDate, bullets = [] } = work;
  const end = /present/i.test(endDate) ? "Now" : year(endDate);
  const span = year(startDate) === end ? end : `${year(startDate)}–${end}`;

  useGSAP(
    () => {
      gsap.to(body.current, { height: open ? "auto" : 0, duration: prefersReducedMotion() ? 0 : 0.6, ease: "expo.inOut" });
    },
    { dependencies: [open] }
  );

  return (
    <li className="border-b border-ink/15">
      <button onClick={onToggle} aria-expanded={open} data-cursor className="group flex w-full items-center gap-4 py-5 text-left">
        <span className="flex-1">
          <span className="block text-xl font-semibold tracking-tight transition-colors group-hover:text-brand md:text-2xl">
            {company.replace(/\s*\((Freelance|Contract)\)/i, "")}
          </span>
          <span className="block text-sm capitalize text-ink/55">{title.toLowerCase()}</span>
        </span>
        <span className="text-sm tabular-nums text-ink/55">{span}</span>
        <span className={cn("flex h-9 w-9 items-center justify-center border border-ink/20 transition-all duration-500 ease-expo", open && "rotate-45 border-brand bg-brand text-line")}>
          <FiPlus />
        </span>
      </button>
      <div ref={body} className="h-0 overflow-hidden">
        <ul className="space-y-2 pb-6 pr-12 text-ink/70">
          {bullets.map((b, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-[0.6em] h-1 w-1 shrink-0 bg-brand" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
};
