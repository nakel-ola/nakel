import { GridLines } from "@/components/ui/GridLines";
import { gsap, prefersReducedMotion, SplitText, useGSAP } from "@/lib/gsap";
import { EMAIL, socials } from "@/lib/site";
import emailjs from "@emailjs/browser";
import Image from "next/image";
import { FormEvent, useRef, useState } from "react";
import { FiArrowUpRight, FiCheck, FiCopy } from "react-icons/fi";

type Status = "idle" | "sending" | "sent" | "error";

export const Contact = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      SplitText.create(".talk-title", {
        type: "chars",
        mask: "chars",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.chars, {
            yPercent: 110,
            duration: 1.1,
            stagger: 0.03,
            ease: "expo.out",
            scrollTrigger: { trigger: ".talk-title", start: "top 85%", once: true },
          }),
      });
      gsap.from(".talk-card", {
        x: 60,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: ".talk-card", start: "top 90%", once: true },
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="contact"
      className="relative overflow-hidden bg-[radial-gradient(70%_60%_at_30%_30%,#3B7BF7_0%,#2563EB_45%,#1B47C4_100%)] px-4 pb-10 pt-28 text-line md:px-[3.5vw] md:pt-40"
    >
      <GridLines x={[3.5, 63, 96.5]} y={[]} className="hidden md:block" />

      <h2 className="talk-title display relative text-[24vw] leading-[0.82] md:text-[14vw]">
        Let&rsquo;s
        <br />
        talk
      </h2>

      <div className="relative mt-12 grid gap-10 md:mt-16 md:grid-cols-[minmax(0,1fr)_minmax(0,29rem)] md:items-end md:gap-[3.5vw]">
        <CopyEmail />
        <div className="talk-card bg-ink p-3">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <span className="relative h-12 w-12 shrink-0 overflow-hidden bg-brand">
              <Image src="/photos/portrait.webp" alt="" fill sizes="48px" className="object-cover object-top" />
            </span>
            <span className="flex-1">
              <span className="block font-semibold tracking-tight">Olamilekan</span>
              <span className="block text-sm text-line/60">Usually replies within a day</span>
            </span>
            <span className="text-lg text-line/70">✳</span>
          </div>
          <ContactForm />
        </div>
      </div>

      <footer className="relative mt-24 flex flex-col gap-4 border-t border-white/25 pt-6 text-sm md:mt-32 md:flex-row md:items-center md:justify-between">
        <span>©{new Date().getFullYear()} Olamilekan Nunu</span>
        <div className="flex gap-6">
          {socials.map(({ label, href }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" data-cursor className="link-underline">
              {label}
            </a>
          ))}
        </div>
      </footer>
    </section>
  );
};

const CopyEmail = () => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <div>
      <p className="text-sm font-medium uppercase">Email</p>
      <a href={`mailto:${EMAIL}`} data-cursor className="link-underline mt-3 block break-all text-2xl font-semibold tracking-tight md:text-[2.6vw]">
        {EMAIL}
      </a>
      <button
        onClick={copy}
        data-cursor
        aria-live="polite"
        className="mt-5 flex items-center gap-2 border border-white/40 px-4 py-2 text-sm transition-colors hover:bg-white hover:text-brand"
      >
        {copied ? <FiCheck /> : <FiCopy />}
        {copied ? "Copied" : "Copy email"}
      </button>
    </div>
  );
};

const ContactForm = () => {
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");

  const send = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.current || status === "sending") return;
    setStatus("sending");
    try {
      await emailjs.sendForm(
        process.env.EMAILJS_SERVICE_ID!,
        process.env.EMAILJS_TEMPLATE_ID!,
        form.current,
        process.env.EMAILJS_PUBLIC_KEY!
      );
      form.current.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="p-3 pt-6">
        <p className="text-2xl font-semibold tracking-tight">Message sent.</p>
        <p className="mt-2 text-line/60">Thanks. I&rsquo;ll get back to you soon.</p>
        <button onClick={() => setStatus("idle")} className="link-underline mt-5 text-sm text-line/70">
          Send another
        </button>
      </div>
    );
  }

  const field =
    "w-full border-b border-white/15 bg-transparent py-3 outline-none transition-colors placeholder:text-line/40 focus:border-brand-light";

  return (
    <form ref={form} onSubmit={send} className="space-y-1 px-1 pt-2">
      <label className="block">
        <span className="sr-only">Name</span>
        <input name="name" required autoComplete="name" placeholder="Your name" className={field} />
      </label>
      <label className="block">
        <span className="sr-only">Email</span>
        <input name="email" type="email" required autoComplete="email" placeholder="Email" className={field} />
      </label>
      <label className="block">
        <span className="sr-only">Message</span>
        <textarea name="message" required rows={3} placeholder="What are we building?" className={`${field} resize-none`} />
      </label>
      <div className="flex items-center justify-between gap-4 pt-4">
        {status === "error" ? (
          <p role="alert" className="text-sm text-red-300">
            Didn&rsquo;t send. Try again or email me.
          </p>
        ) : (
          <span />
        )}
        <button
          type="submit"
          data-cursor
          disabled={status === "sending"}
          className="flex items-center gap-2 bg-line px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-brand hover:text-line disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send"} <FiArrowUpRight />
        </button>
      </div>
    </form>
  );
};
