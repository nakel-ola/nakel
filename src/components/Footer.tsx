import { GridLines } from "@/components/ui/GridLines";
import { EMAIL, socials } from "@/lib/site";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

/** Closer for inner pages: the hero's blue field with a giant link back to contact. */
export const Footer = () => (
  <footer className="relative overflow-hidden bg-[radial-gradient(70%_60%_at_30%_30%,#3B7BF7_0%,#2563EB_45%,#1B47C4_100%)] px-4 pb-8 pt-20 text-line md:px-[3.5vw] md:pt-28">
    <GridLines x={[3.5, 63, 96.5]} y={[]} className="hidden md:block" />

    <Link href="/#contact" data-cursor className="group relative flex items-end justify-between gap-6">
      <span className="display text-[24vw] leading-[0.82] md:text-[14vw]">
        Let&rsquo;s
        <br />
        talk
      </span>
      <span className="mb-[2vw] flex h-14 w-14 shrink-0 items-center justify-center bg-line text-ink transition-colors duration-300 group-hover:bg-ink group-hover:text-line md:h-20 md:w-20">
        <FiArrowUpRight className="h-6 w-6 transition-transform duration-500 ease-expo group-hover:rotate-45 md:h-8 md:w-8" />
      </span>
    </Link>

    <div className="relative mt-16 flex flex-col gap-4 border-t border-white/25 pt-6 text-sm md:mt-24 md:flex-row md:items-center md:justify-between">
      <a href={`mailto:${EMAIL}`} className="link-underline">
        {EMAIL}
      </a>
      <div className="flex gap-6">
        {socials.map(({ label, href }) => (
          <a key={label} href={href} target="_blank" rel="noreferrer" data-cursor className="link-underline">
            {label}
          </a>
        ))}
      </div>
      <span>©{new Date().getFullYear()} Olamilekan Nunu</span>
    </div>
  </footer>
);
