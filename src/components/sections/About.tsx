import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRef, useState } from "react";
import { FiPlus } from "react-icons/fi";

type Props = {
  about: AboutResponse;
  projectCount: number;
};

export const About = ({ about, projectCount }: Props) => {
  const root = useRef<HTMLElement>(null);
  const degree = about.educations?.[0];
  const current = about.works?.[0];

  const facts = [
    { k: "Based", v: "Lagos, NG" },
    { k: "Playing for", v: current?.company ?? "Freelance" },
    { k: "Studying", v: degree ? `CS, ${degree.institute.replace(/ Open University$/, "")}` : "—" },
    { k: "Shipped", v: `${projectCount} projects` },
  ];

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".pf-in", {
        y: 50,
        opacity: 0,
        stagger: 0.08,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="about"
      data-set="Profile"
      className="relative px-4 py-28 md:px-10 md:py-40"
    >
      <div className="grid grid-cols-[minmax(0,1fr)] gap-12 md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] md:gap-16">
        <div className="pf-in">
          <Portrait />
        </div>

        <div className="flex flex-col justify-between gap-12">
          <div>
            <h2 className="pf-in condensed text-[17vw] md:text-[7vw]">Profile</h2>
            <p className="pf-in mt-6 max-w-md text-xl leading-snug text-line/70 md:text-2xl">
              Self-taught, product-minded, and happiest when an interface feels instant.
            </p>
          </div>

          <dl className="pf-in grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
            {facts.map(({ k, v }) => (
              <div key={k} className="bg-ink p-4 md:p-5">
                <dt className="label text-line/40">{k}</dt>
                <dd className="mt-2 text-lg font-medium tracking-tight">{v}</dd>
              </div>
            ))}
          </dl>

          <Career works={about.works ?? []} />
        </div>
      </div>
    </section>
  );
};

/** One portrait, framed like a live camera feed. */
const Portrait = () => (
  <div className="md:sticky md:top-24">
    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-table">
      <Image
        src="/photos/portrait.webp"
        alt="Portrait of Olamilekan in glasses and a black tee"
        fill
        sizes="(max-width: 768px) 92vw, 50vw"
        className="object-cover object-top"
      />
      <span className="plate absolute left-3 top-3 flex items-center gap-2 rounded-full px-3 py-1.5">
        <span className="animate-live h-1.5 w-1.5 rounded-full bg-ball" />
        <span className="label text-[10px]">Live</span>
      </span>
    </div>
  </div>
);

const Career = ({ works }: { works: Works[] }) => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="pf-in">
      <p className="label mb-3 text-line/40">Career</p>
      <ul className="border-t border-white/10">
        {works.map((work, i) => (
          <CareerRow
            key={`${work.company}-${i}`}
            work={work}
            open={open === i}
            onToggle={() => setOpen(open === i ? null : i)}
          />
        ))}
      </ul>
    </div>
  );
};

const year = (date?: string) => date?.match(/\d{4}/)?.[0] ?? date ?? "";

const CareerRow = ({
  work,
  open,
  onToggle,
}: {
  work: Works;
  open: boolean;
  onToggle: () => void;
}) => {
  const body = useRef<HTMLDivElement>(null);
  const { title, company, startDate, endDate, bullets = [] } = work;
  const end = /present/i.test(endDate) ? "Now" : year(endDate);
  const span = year(startDate) === end ? end : `${year(startDate)}–${end}`;

  useGSAP(
    () => {
      gsap.to(body.current, {
        height: open ? "auto" : 0,
        duration: prefersReducedMotion() ? 0 : 0.5,
        ease: "expo.inOut",
      });
    },
    { dependencies: [open] },
  );

  return (
    <li className="border-b border-white/10">
      <button
        onClick={onToggle}
        aria-expanded={open}
        data-cursor
        className="group flex w-full items-center gap-4 py-4 text-left"
      >
        <span className="flex-1">
          <span className="block text-lg font-medium tracking-tight transition-colors group-hover:text-ball-text">
            {company.replace(/\s*\((Freelance|Contract)\)/i, "")}
          </span>
          <span className="block text-sm capitalize text-line/45">{title.toLowerCase()}</span>
        </span>
        <span className="font-mono text-xs tabular-nums text-line/40">{span}</span>
        <FiPlus
          className={cn(
            "shrink-0 text-line/50 transition-transform duration-300",
            open && "rotate-45 text-ball-text",
          )}
        />
      </button>
      <div ref={body} className="h-0 overflow-hidden">
        <ul className="space-y-2 pb-5 text-sm leading-relaxed text-line/60">
          {bullets.map((b, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ball" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
};
