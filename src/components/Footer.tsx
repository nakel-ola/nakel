import { LagosClock } from "@/components/ui/LagosClock";
import { socials } from "@/lib/site";
import { FiArrowUp } from "react-icons/fi";
import { useSmoothScroll } from "./providers/SmoothScroll";

export const Footer = () => {
  const { scrollTo } = useSmoothScroll();

  return (
    <footer className="border-t border-white/10 px-4 py-8 md:px-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <ul className="flex gap-5">
          {socials.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                data-cursor
                className="text-sm text-line/60 transition-colors hover:text-ball-text"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between gap-6 font-mono text-xs text-line/40 md:justify-end">
          <span>
            © {new Date().getFullYear()} Olamilekan Nunu · Lagos <LagosClock />
          </span>
          <button
            onClick={() => scrollTo(0)}
            data-cursor
            aria-label="Back to top"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-line transition-colors hover:border-ball hover:text-ball-text"
          >
            <FiArrowUp />
          </button>
        </div>
      </div>
    </footer>
  );
};
