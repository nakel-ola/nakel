import TumbleWall, { TumbleWallHandle } from "@/components/bits/TumbleWall";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  skills: SkillResponse[];
};

export const Skills = ({ skills }: Props) => {
  const wall = useRef<TumbleWallHandle>(null);
  // Dragging would swallow page scroll on touch screens; there a tap makes a tool hop instead.
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    setFinePointer(window.matchMedia("(pointer: fine)").matches);
  }, []);

  const items = useMemo(
    () => skills.map((s) => ({ src: s.image, title: s.name, alt: s.name })),
    [skills]
  );

  return (
    <section id="skills" data-set="Drills" className="relative px-4 py-24 md:px-10 md:py-32">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 className="condensed text-[17vw] md:text-[9vw]">Drills</h2>
          <p className="label mt-3 text-line/40">
            {skills.length} tools · {finePointer ? "grab and throw" : "tap to bounce"}
          </p>
        </div>
        <button
          data-cursor
          onClick={() => wall.current?.shake(1.2)}
          className="mb-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium transition-colors hover:border-ball hover:text-ball-text"
        >
          Multiball
        </button>
      </div>

      {/* The drill runs on its own small table. */}
      <div className="relative mt-10 h-[62svh] min-h-[440px] overflow-hidden rounded-2xl border border-white/10 bg-table md:h-[70svh]">
        <span aria-hidden className="net pointer-events-none absolute inset-y-0 left-1/2 w-2 -translate-x-1/2" />
        <span aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-white/[0.06]" />
        <TumbleWall
          ref={wall}
          items={items}
          count={items.length}
          shape="chip"
          size={140}
          sizeVariance={0.2}
          fill={0.36}
          frameColor="#222327"
          textColor="#EDEDED"
          shadow={0.9}
          bounce={0.5}
          spin={0.5}
          entrance="rain"
          stagger={60}
          draggable={finePointer}
          hoverScale={1.06}
          ariaLabel="Tools I work with"
        />
      </div>

      <ul className="sr-only">
        {skills.map((s) => (
          <li key={s.name}>{s.name}</li>
        ))}
      </ul>
    </section>
  );
};
