import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { sized } from "@/lib/image";
import { useEffect, useRef, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FiArrowUpRight, FiX } from "react-icons/fi";
import { useSmoothScroll } from "./providers/SmoothScroll";

type Props = {
  project: ProjectResponse | null;
  onClose: () => void;
};

/** Full breakdown of a project: description, stack, links and every screenshot. */
export const ProjectModal = ({ project, onClose }: Props) => {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const { lock } = useSmoothScroll();
  // Keep the last project mounted while the sheet animates out.
  const [shown, setShown] = useState<ProjectResponse | null>(project);

  useEffect(() => {
    if (project) setShown(project);
  }, [project]);

  useGSAP(
    () => {
      if (!shown) return;
      const fast = prefersReducedMotion();
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.out" } })
        .fromTo(".pm-backdrop", { opacity: 0 }, { opacity: 1, duration: fast ? 0 : 0.4 })
        .fromTo(".pm-sheet", { yPercent: 100 }, { yPercent: 0, duration: fast ? 0 : 0.9 }, 0)
        .from(".pm-item", { y: 40, opacity: 0, stagger: 0.05, duration: fast ? 0 : 0.7 }, fast ? 0 : 0.3);
    },
    { scope: root, dependencies: [shown?._id] }
  );

  useEffect(() => {
    if (!shown) return;
    if (project) {
      lock(true);
      tl.current?.timeScale(1).play();
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
      window.addEventListener("keydown", onKey);
      root.current?.querySelector<HTMLButtonElement>(".pm-close")?.focus();
      return () => {
        window.removeEventListener("keydown", onKey);
        lock(false);
      };
    }
    tl.current?.timeScale(1.8).reverse();
    tl.current?.eventCallback("onReverseComplete", () => setShown(null));
  }, [project, shown, lock, onClose]);

  if (!shown) return null;

  const { name, description, category, tech = [], images = [], link, github } = shown;

  return (
    <div ref={root} className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label={name}>
      <div className="pm-backdrop absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      <div
        className="pm-sheet absolute inset-x-0 bottom-0 top-4 overflow-y-auto overscroll-contain rounded-t-3xl border-t border-white/10 bg-table md:inset-x-8 md:top-8"
        data-lenis-prevent
      >
        <button
          onClick={onClose}
          data-cursor
          className="pm-close plate sticky right-4 top-4 z-10 float-right m-4 flex h-11 w-11 items-center justify-center rounded-full md:m-6"
        >
          <span className="sr-only">Close</span>
          <FiX size={18} />
        </button>

        <div className="px-5 pb-16 pt-10 md:px-12 md:pt-14">
          <p className="pm-item label text-ball-text">{category?.join(" · ")}</p>
          <h2 className="pm-item condensed mt-4 text-[clamp(2.8rem,8vw,7rem)]">{name}</h2>

          <div className="pm-item mt-8 grid gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <p className="max-w-2xl text-lg leading-relaxed text-line/65">{description}</p>
            <div className="flex flex-wrap items-start gap-2 md:justify-end">
              {link ? (
                <a
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor
                  className="flex items-center gap-1.5 rounded-full bg-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-ball hover:text-line"
                >
                  Visit site <FiArrowUpRight />
                </a>
              ) : null}
              {github ? (
                <a
                  href={github}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor
                  className="flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm font-medium transition-colors hover:border-white/40"
                >
                  <FaGithub /> Source
                </a>
              ) : null}
            </div>
          </div>

          <ul className="pm-item mt-8 flex flex-wrap gap-2">
            {tech.map((t) => (
              <li key={t.name} className="plate flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-sm">
                {t.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.image} alt="" className="h-6 w-6 rounded-full bg-white object-contain p-0.5" />
                ) : null}
                {t.name}
              </li>
            ))}
          </ul>

          <div className="mt-12 space-y-4">
            {images.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={sized(src, 1800)}
                alt={`${name} screenshot ${i + 1}`}
                loading={i === 0 ? "eager" : "lazy"}
                className="pm-item w-full rounded-2xl"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
