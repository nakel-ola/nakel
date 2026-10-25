import { Footer } from "@/components/Footer";
import { GridLines } from "@/components/ui/GridLines";
import { mergeWork } from "@/data/caseStudies";
import { gsap, prefersReducedMotion, SplitText, useGSAP } from "@/lib/gsap";
import { projectsQuery, sanityClient } from "@/lib/sanity";
import { cn } from "@/lib/utils";
import { CaseStudy, fromSanity, toProps } from "@/lib/work";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRef } from "react";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";

type Props = {
  study: CaseStudy;
  index: number;
  total: number;
  next: Pick<CaseStudy, "slug" | "name" | "category" | "cover">;
};

const pad = (n: number) => String(n).padStart(2, "0");

// Long names get a smaller size so they still fit the corner.
const nameSize = (name: string) =>
  name.length > 22
    ? "text-[11vw] md:text-[4.4vw]"
    : name.length > 12
      ? "text-[13vw] md:text-[8vw]"
      : "text-[19vw] md:text-[12vw]";

export default function CaseStudyPage({ study, index, total, next }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const {
    name,
    category,
    tagline,
    description,
    role,
    period,
    stack,
    cover,
    screens,
    features,
    parts,
    links,
  } = study;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      SplitText.create(".cs-name", {
        type: "words,chars",
        mask: "chars",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.chars, {
            yPercent: 110,
            duration: 1.1,
            stagger: 0.025,
            ease: "expo.out",
            delay: 0.2,
          }),
      });
      gsap.from(".cs-in", { y: 30, opacity: 0, duration: 1, stagger: 0.08, ease: "expo.out", delay: 0.3 });
      gsap.from(".cs-cover", { x: 80, opacity: 0, duration: 1.4, ease: "expo.out", delay: 0.35 });
      gsap.fromTo(
        ".cs-cover-img",
        { scale: 1 },
        {
          scale: 1.08,
          ease: "none",
          scrollTrigger: { trigger: ".cs-head", start: "top top", end: "bottom top", scrub: true },
        },
      );

      gsap.utils.toArray<HTMLElement>(".cs-rise").forEach((el) => {
        gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      // Screens scroll sideways on wide screens.
      gsap.matchMedia().add("(min-width: 768px)", () => {
        const track = root.current?.querySelector<HTMLElement>(".cs-track");
        if (!track) return;
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: track.parentElement,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    { scope: root, dependencies: [study.slug], revertOnUpdate: true },
  );

  const facts = [
    role && { k: "Role", v: role },
    period && { k: "Period", v: period },
    { k: "Type", v: category },
    { k: "Stack", v: `${stack.length} tools` },
  ].filter(Boolean) as { k: string; v: string }[];

  return (
    // Keyed by project so client-side navigation rebuilds the DOM the text animations split up.
    <div ref={root} key={study.slug}>
      <Head>
        <title>{`${name} · Nakel`}</title>
        <meta name="description" content={description} />
      </Head>

      {/* Header: the hero's blue field, with this project in the corners. */}
      <header className="cs-head relative flex min-h-[100svh] flex-col overflow-hidden bg-[radial-gradient(70%_60%_at_60%_35%,#3B7BF7_0%,#2563EB_45%,#1B47C4_100%)] px-4 pb-6 pt-24 text-line md:px-[3.5vw] md:pb-[3vw] md:pt-28">
        <GridLines x={[3.5, 30, 96.5]} y={[]} className="hidden md:block" />

        <div className="cs-in relative flex items-center justify-between text-sm">
          <Link href="/projects" data-cursor className="link-underline">
            Work
          </Link>
          <span className="tabular-nums">
            {pad(index + 1)} / {pad(total)}
          </span>
        </div>

        <div className="relative mt-8 grid flex-1 gap-8 md:mt-[4vw] md:grid-cols-[minmax(0,26vw)_minmax(0,1fr)] md:gap-[4vw]">
          <p className="cs-in max-w-xs text-[13px] font-medium uppercase leading-snug md:pt-[2vw] md:text-[15px]">
            <span className="inline-block w-8 md:w-11" />
            {tagline}
          </p>
          {cover ? (
            <div className="cs-cover self-start bg-white p-2 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)] md:ml-auto md:w-[min(100%,52vw)]">
              {/* Natural proportions: covers come in every shape, none should be cropped. */}
              <div className="overflow-hidden bg-paper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cover}
                  alt={`${name} cover`}
                  className="cs-cover-img block max-h-[46vh] w-full object-contain"
                />
              </div>
              <div className="flex items-center justify-between px-1 pb-0.5 pt-2.5 text-[13px] text-ink">
                <span className="flex items-center gap-1.5 uppercase">
                  <span>✳</span> {name}
                </span>
                <span className="text-ink/60">/{category}</span>
              </div>
            </div>
          ) : null}
        </div>

        <div className="relative mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h1 className={cn("cs-name display max-w-[16ch] break-words", nameSize(name))}>{name}</h1>
          <div className="cs-in w-full shrink-0 bg-ink p-4 md:w-[min(29vw,26rem)]">
            <dl className="space-y-2 text-sm">
              {facts.slice(0, 2).map(({ k, v }) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-line/55">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            {links.length ? (
              <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                {links.map(({ label, href }, i) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 text-sm transition-colors",
                      i === 0
                        ? "bg-line text-ink hover:bg-brand hover:text-line"
                        : "border border-white/20 hover:border-white",
                    )}
                  >
                    {label} <FiArrowUpRight />
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {/* Overview */}
      <section className="relative overflow-hidden bg-paper px-4 py-24 text-ink md:px-[3.5vw] md:py-36">
        <GridLines x={[3.5, 30, 96.5]} y={[]} className="hidden text-ink md:block" />
        <div className="relative grid gap-8 md:grid-cols-[minmax(0,26vw)_minmax(0,1fr)] md:gap-[4vw]">
          <p className="text-sm font-medium uppercase">Overview</p>
          <div>
            <p className="cs-rise text-2xl font-medium leading-[1.2] tracking-tight md:text-[2.8vw]">
              {description}
            </p>

            <dl className="cs-rise mt-14 grid grid-cols-2 border-t border-ink/15 md:mt-20 md:grid-cols-4">
              {facts.map(({ k, v }) => (
                <div key={k} className="border-b border-ink/15 py-5 pr-4 md:border-b-0">
                  <dt className="text-sm text-ink/50">{k}</dt>
                  <dd className="mt-1.5 text-lg font-semibold tracking-tight md:text-xl">{v}</dd>
                </div>
              ))}
            </dl>

            {stack.length ? (
              <ul className="cs-rise mt-14 grid grid-cols-3 border-l border-t border-ink/15 sm:grid-cols-4 md:mt-20 md:grid-cols-6">
                {stack.map((t) => (
                  <li
                    key={t.name}
                    className="flex aspect-square flex-col justify-between border-b border-r border-ink/15 p-3"
                  >
                    <span className="flex h-8 w-8 items-center justify-center bg-white">
                      {t.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={t.image} alt="" className="h-5 w-5 object-contain" />
                      ) : (
                        <span className="text-xs font-bold text-brand">{t.name.slice(0, 2)}</span>
                      )}
                    </span>
                    <span className="text-xs font-semibold leading-tight tracking-tight md:text-sm">
                      {t.name}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </section>

      {/* Features: what people can do, on the screen where they do it. */}
      {features.length ? (
        <section className="overflow-hidden bg-ink text-line md:flex md:h-[100svh] md:items-center">
          <div className="cs-track flex flex-col gap-10 px-4 py-20 md:w-max md:flex-row md:items-center md:gap-[2.4vw] md:px-[3.5vw] md:py-0">
            <div className="shrink-0 md:w-[24vw]">
              <h2 className="display text-[19vw] md:text-[7.4vw]">Features</h2>
              <p className="mt-4 max-w-[18rem] text-line/60">What it does for the people using it.</p>
            </div>
            {features.map((f, i) => (
              <figure key={f.title} className="flex shrink-0 flex-col md:h-[76vh] md:w-auto">
                <div className="flex flex-1 items-center justify-center overflow-hidden bg-white p-2 md:min-h-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={f.image}
                    alt={f.title}
                    loading="lazy"
                    className="max-h-[64vh] w-full object-contain md:h-full md:w-auto"
                  />
                </div>
                <figcaption className="mt-4 flex gap-4 md:max-w-[min(100%,30rem)]">
                  <span className="pt-1 text-sm tabular-nums text-line/45">({pad(i + 1)})</span>
                  <span>
                    <span className="block text-xl font-semibold tracking-tight md:text-2xl">{f.title}</span>
                    <span className="mt-1 block text-line/60">{f.text}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {/* Screens */}
      {!features.length && screens.length ? (
        <section className="overflow-hidden bg-ink text-line md:flex md:h-[100svh] md:items-center">
          <div className="cs-track flex flex-col gap-4 px-4 pb-20 md:w-max md:flex-row md:items-center md:gap-[2vw] md:px-[3.5vw] md:pb-0">
            <div className="shrink-0 pt-10 md:w-[22vw] md:pt-0">
              <h2 className="display text-[19vw] md:text-[8vw]">Screens</h2>
              <p className="mt-3 text-sm text-line/55">({pad(screens.length)})</p>
            </div>
            {screens.map((src, i) => (
              <figure key={src} className="shrink-0 bg-white p-2 md:h-[72vh]">
                <div className="flex h-full items-center justify-center bg-paper">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${name} screen ${i + 1}`}
                    loading="lazy"
                    className="max-h-[70vh] w-full object-contain md:h-full md:w-auto"
                  />
                </div>
                <figcaption className="flex justify-between px-1 pt-2 text-[13px] text-ink">
                  <span>✳ {name}</span>
                  <span className="text-ink/55">({pad(i + 1)})</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {/* What I built */}
      {parts.length ? (
        <section className="bg-ink px-4 py-24 text-line md:px-[3.5vw] md:py-36">
          <div className="flex items-end justify-between gap-6">
            <h2 className="display text-[19vw] md:text-[11vw]">Built</h2>
            <p className="pb-[1.5vw] text-sm text-line/55">({pad(parts.length)} parts)</p>
          </div>
          <div
            className={cn(
              "mt-12 grid gap-4 md:mt-16 md:gap-[2vw]",
              parts.length > 2 ? "md:grid-cols-2" : "md:grid-cols-2",
            )}
          >
            {parts.map((part, i) => (
              <article key={part.title} className="cs-rise flex flex-col bg-white p-5 text-ink md:p-7">
                <div className="flex items-center justify-between text-sm">
                  <span className="bg-brand px-2.5 py-1 text-xs uppercase text-line">{part.kind}</span>
                  <span className="tabular-nums text-ink/45">({pad(i + 1)})</span>
                </div>
                <h3 className="mt-8 text-3xl font-bold tracking-tight md:text-4xl">{part.title}</h3>
                <p className="mt-2 text-ink/60">{part.summary}</p>
                <ul className="mt-6 space-y-2.5 border-t border-ink/10 pt-5">
                  {part.points.map((pt) => (
                    <li key={pt} className="flex gap-3 text-[15px] leading-snug">
                      <span className="mt-[0.5em] h-1 w-1 shrink-0 bg-brand" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <p className="mt-auto pt-6 text-xs uppercase tracking-wide text-ink/45">
                  {part.stack.join(" · ")}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {/* Next */}
      <Link
        href={`/work/${next.slug}`}
        data-cursor
        className="group relative block overflow-hidden bg-paper px-4 py-16 text-ink md:px-[3.5vw] md:py-24"
      >
        <p className="text-sm font-medium uppercase">Next project</p>
        <div className="mt-6 flex items-end justify-between gap-6">
          <span
            className={cn(
              "display transition-colors duration-500 group-hover:text-brand",
              nameSize(next.name),
            )}
          >
            {next.name}
          </span>
          <span className="mb-[1vw] flex h-14 w-14 shrink-0 items-center justify-center bg-ink text-line transition-colors duration-300 group-hover:bg-brand md:h-20 md:w-20">
            <FiArrowRight className="h-6 w-6 transition-transform duration-500 ease-expo group-hover:translate-x-1 md:h-8 md:w-8" />
          </span>
        </div>
      </Link>

      <Footer />
    </div>
  );
}

const loadWork = async () => {
  const { projects } = await sanityClient.fetch<{ projects: ProjectResponse[] }>(projectsQuery);
  return mergeWork(projects.map(fromSanity));
};

export const getStaticPaths: GetStaticPaths = async () => {
  const work = await loadWork();
  return { paths: work.map((w) => ({ params: { slug: w.slug } })), fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const work = await loadWork();
  const index = work.findIndex((w) => w.slug === params?.slug);
  if (index < 0) return { notFound: true, revalidate: 60 };
  const n = work[(index + 1) % work.length];
  return {
    props: toProps({
      study: work[index],
      index,
      total: work.length,
      next: { slug: n.slug, name: n.name, category: n.category, cover: n.cover },
    }),
    revalidate: 60,
  };
};
