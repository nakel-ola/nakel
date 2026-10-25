import { gsap, useGSAP } from "@/lib/gsap";
import { SHOT_ASPECT, shot } from "@/lib/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FiArrowRight, FiArrowUpRight, FiPlus } from "react-icons/fi";

type Props = {
  projects: ProjectResponse[];
  total: number;
  onSelect: (project: ProjectResponse) => void;
};

/** Each highlight is a one-screen product landing page; on desktop they stack over each other. */
export const Work = ({ projects, total, onSelect }: Props) => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const panels = gsap.utils.toArray<HTMLElement>(".lp-panel");
        panels.forEach((panel, i) => {
          const next = panels[i + 1];
          // The product shot rises into place as its page arrives.
          gsap.fromTo(
            panel.querySelector(".lp-shot"),
            { y: 80, rotateX: 10, scale: 0.94 },
            {
              y: 0,
              rotateX: 0,
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: panel, start: "top bottom", end: "top top", scrub: true },
            }
          );
          if (!next) return;
          // Hold this page while the next one slides over it, then sink it back.
          gsap.to(panel.querySelector(".lp-inner"), {
            scale: 0.92,
            opacity: 0.35,
            ease: "none",
            scrollTrigger: {
              trigger: next,
              start: "top bottom",
              end: "top top",
              scrub: true,
              pin: panel,
              pinSpacing: false,
            },
          });
        });
      });

      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".lp-panel").forEach((panel) => {
          gsap.from(panel.querySelectorAll(".lp-in"), {
            y: 50,
            opacity: 0,
            stagger: 0.08,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: panel, start: "top 85%", once: true },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [projects.length] }
  );

  return (
    <section ref={root} id="work" data-set="Highlights" className="relative bg-ink">
      <div className="flex items-end justify-between px-4 pb-10 pt-28 md:px-10 md:pt-40">
        <h2 className="condensed text-[17vw] md:text-[9vw]">Highlights</h2>
        <p className="label pb-2 text-line/40">
          {projects.length}/{total}
        </p>
      </div>

      {projects.map((project, i) => (
        <ProductPage key={project._id} project={project} index={i} onSelect={() => onSelect(project)} />
      ))}

      <div className="relative z-10 bg-ink px-4 py-20 md:px-10 md:py-28">
        <Link
          href="/projects"
          data-cursor
          className="group flex items-end justify-between gap-6 border-t border-white/10 pt-8"
        >
          <span>
            <span className="label text-line/40">Archive</span>
            <span className="condensed mt-3 block text-5xl md:text-[6vw]">All {total} projects</span>
          </span>
          <FiArrowRight className="mb-3 shrink-0 text-4xl transition-transform duration-500 ease-expo group-hover:translate-x-2 md:text-6xl" />
        </Link>
      </div>
    </section>
  );
};

/** First sentence as the headline, the rest as supporting copy. */
const splitCopy = (text = "") => {
  const m = text.trim().match(/^([^]+?[.!?])\s+([^]+)$/);
  return m ? { lead: m[1], rest: m[2] } : { lead: text.trim(), rest: "" };
};

const host = (url?: string) => {
  try {
    return url ? new URL(url).hostname.replace(/^www\./, "") : "";
  } catch {
    return "";
  }
};

type PageProps = {
  project: ProjectResponse;
  index: number;
  onSelect: () => void;
};

const ProductPage = ({ project, index, onSelect }: PageProps) => {
  const { name, category = [], description, tech = [], images = [], link, github } = project;
  const { lead, rest } = splitCopy(description);
  const flip = index % 2 === 1;

  return (
    <article
      className="lp-panel relative overflow-hidden border-t border-white/10 bg-ink md:h-[100svh]"
      aria-label={name}
    >
      <div
        className={cn(
          "lp-inner flex h-full origin-center flex-col gap-10 px-4 pb-16 pt-12 md:items-center md:gap-14 md:px-10 md:pb-10 md:pt-24",
          flip ? "md:flex-row-reverse" : "md:flex-row"
        )}
      >
        {/* Product hero copy */}
        <div className="md:w-[34%] md:shrink-0">
          <p className="lp-in label flex items-center gap-2 text-line/45">
            <span className="h-1.5 w-1.5 rounded-full bg-ball" />
            Replay {String(index + 1).padStart(2, "0")} · {category[0] ?? "Project"}
          </p>
          <h3 className="lp-in condensed mt-3 text-[16vw] md:text-[clamp(3rem,5.6vw,6.5rem)]">{name}</h3>
          <p className="lp-in mt-5 text-xl leading-snug text-line/85 md:text-[clamp(1.1rem,1.5vw,1.5rem)]">{lead}</p>
          {rest ? <p className="lp-in mt-3 line-clamp-3 text-sm leading-relaxed text-line/45">{rest}</p> : null}

          <div className="lp-in mt-7 flex flex-wrap items-center gap-2">
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
            <button
              type="button"
              onClick={onSelect}
              data-cursor
              className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-line/60 transition-colors hover:text-line"
            >
              <FiPlus /> Details
            </button>
          </div>

          {tech.length ? (
            <div className="lp-in mt-8 border-t border-white/10 pt-4">
              <p className="label text-line/35">Built with</p>
              <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                {tech.slice(0, 6).map((t) => (
                  <li key={t.name} className="flex items-center gap-1.5 text-xs text-line/55">
                    {t.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.image} alt="" className="h-4 w-4 object-contain" loading="lazy" />
                    ) : null}
                    {t.name}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {/* Product shot */}
        <div className="lp-in min-w-0 flex-1 [perspective:1600px]">
          <BrowserShot name={name} images={images} url={host(link)} onOpen={onSelect} />
        </div>
      </div>
    </article>
  );
};

const CYCLE_MS = 3500;

/**
 * Some exports are phone mockups on the pale backdrop; cropped to a desktop window they show
 * as empty grey sides. Sample a thumbnail's edges and keep only the full-width screens.
 */
const useDesktopScreens = (images: string[]) => {
  const [keep, setKeep] = useState(images);

  useEffect(() => {
    let cancelled = false;
    const checks = images.map(
      (src) =>
        new Promise<boolean>((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            try {
              const c = document.createElement("canvas");
              c.width = img.width;
              c.height = img.height;
              const ctx = c.getContext("2d")!;
              ctx.drawImage(img, 0, 0);
              const edge = (x: number) => {
                const d = ctx.getImageData(x, 0, 2, c.height).data;
                let sum = 0;
                for (let i = 0; i < d.length; i += 4) sum += d[i] + d[i + 1] + d[i + 2];
                return sum / (d.length / 4) / 3;
              };
              resolve(!(edge(1) > 190 && edge(c.width - 3) > 190));
            } catch {
              resolve(true);
            }
          };
          img.onerror = () => resolve(true);
          img.src = shot(src, 60);
        })
    );
    Promise.all(checks).then((ok) => {
      if (cancelled) return;
      const desktop = images.filter((_, i) => ok[i]);
      setKeep(desktop.length ? desktop : images);
    });
    return () => {
      cancelled = true;
    };
  }, [images]);

  return keep;
};

/** The app in a browser window, cycling through its screens like a product tour. */
const BrowserShot = ({
  name,
  images,
  url,
  onOpen,
}: {
  name: string;
  images: string[];
  url: string;
  onOpen: () => void;
}) => {
  const frame = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const screens = useDesktopScreens(images).slice(0, 5);
  const current = Math.min(active, screens.length - 1);

  useEffect(() => {
    const el = frame.current;
    if (!el || screens.length < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    const io = new IntersectionObserver(([e]) => {
      clearInterval(timer);
      if (e.isIntersecting) timer = window.setInterval(() => setActive((a) => (a + 1) % screens.length), CYCLE_MS);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      clearInterval(timer);
    };
  }, [screens.length, paused]);

  return (
    <div
      ref={frame}
      className="lp-shot w-full overflow-hidden rounded-xl border border-white/10 bg-table shadow-[0_40px_120px_-30px_rgba(37,99,235,0.45)] md:rounded-2xl"
    >
      {/* Window chrome */}
      <div className="flex items-center gap-3 border-b border-white/10 px-3 py-2.5 md:px-4">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </span>
        <span className="mx-auto max-w-[60%] truncate rounded-md bg-white/[0.06] px-3 py-1 font-mono text-[11px] text-line/50 md:px-6">
          {url || name.toLowerCase().replace(/\s+/g, "-")}
        </span>
        {screens.length > 1 ? (
          <span className="flex gap-1" role="tablist" aria-label={`${name} screens`}>
            {screens.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === current}
                aria-label={`Screen ${i + 1}`}
                onClick={() => {
                  setActive(i);
                  setPaused(true);
                }}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  i === current ? "w-5 bg-ball" : "w-1.5 bg-white/25 hover:bg-white/50"
                )}
              />
            ))}
          </span>
        ) : (
          <span className="w-8" />
        )}
      </div>

      <button
        type="button"
        onClick={onOpen}
        data-cursor
        aria-label={`Open ${name} details`}
        className="relative block w-full overflow-hidden"
        style={{ aspectRatio: SHOT_ASPECT }}
      >
        {screens.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={shot(src, 1600)}
            alt={i === current ? `Screenshot of ${name}` : ""}
            loading="lazy"
            draggable={false}
            className={cn(
              "absolute inset-0 h-full w-full object-cover object-top transition-[opacity,transform] duration-700 ease-expo",
              i === current ? "scale-100 opacity-100" : "scale-[1.02] opacity-0"
            )}
          />
        ))}
      </button>
    </div>
  );
};
