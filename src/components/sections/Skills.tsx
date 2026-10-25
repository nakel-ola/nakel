import { gsap, prefersReducedMotion, SplitText, useGSAP } from "@/lib/gsap";
import { logoFor } from "@/lib/logos";
import { useRef } from "react";

// Logos drawn in white need a dark tile to be visible.
const LIGHT_LOGOS = /^next/i;

type Props = {
  skills: SkillResponse[];
};

export const Skills = ({ skills }: Props) => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      SplitText.create(".skills-title", {
        type: "chars",
        mask: "chars",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.chars, {
            yPercent: 110,
            duration: 1.1,
            stagger: 0.03,
            ease: "expo.out",
            scrollTrigger: { trigger: ".skills-title", start: "top 85%", once: true },
          }),
      });
      gsap.from(".skill-cell", {
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        ease: "expo.out",
        stagger: { each: 0.03, grid: "auto", from: "start" },
        scrollTrigger: { trigger: ".skills-grid", start: "top 85%", once: true },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="skills" className="relative bg-paper px-4 pb-24 pt-28 text-ink md:px-[3.5vw] md:pb-36 md:pt-40">
      <div className="flex items-end justify-between gap-6">
        <h2 className="skills-title display text-[22vw] md:text-[15vw]">Skills</h2>
        <p className="pb-[1.5vw] text-sm text-ink/55">({String(skills.length).padStart(2, "0")})</p>
      </div>

      <ul className="skills-grid mt-12 grid grid-cols-2 border-l border-t border-ink/15 sm:grid-cols-3 md:mt-20 md:grid-cols-5">
        {skills.map((s) => (
          <li key={s.name} className="skill-cell border-b border-r border-ink/15">
            <div className="group relative flex aspect-[4/3] flex-col justify-between overflow-hidden p-4 md:p-5">
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-brand transition-transform duration-500 ease-expo group-hover:scale-y-100" />
              <span
                className={`relative flex h-10 w-10 items-center justify-center transition-transform duration-700 ease-expo group-hover:rotate-[360deg] md:h-12 md:w-12 ${
                  !logoFor(s.name) && LIGHT_LOGOS.test(s.name) ? "bg-ink" : "bg-white"
                }`}
              >
                {logoFor(s.name) ?? s.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoFor(s.name) ?? s.image} alt="" className="h-6 w-6 object-contain md:h-7 md:w-7" />
                ) : null}
              </span>
              <span className="relative text-base font-semibold tracking-tight transition-colors duration-300 group-hover:text-line md:text-lg">
                {s.name}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
