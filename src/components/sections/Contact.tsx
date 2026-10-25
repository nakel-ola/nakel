import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { EMAIL } from "@/lib/site";
import emailjs from "@emailjs/browser";
import { FormEvent, useRef, useState } from "react";
import { FiArrowUpRight, FiCheck, FiCopy } from "react-icons/fi";

type Status = "idle" | "sending" | "sent" | "error";

export const Contact = () => {
  const root = useRef<HTMLElement>(null);

  // The full stop is a ball that drops in and settles.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".serve-ball", {
        y: -260,
        duration: 1.4,
        ease: "bounce.out",
        scrollTrigger: { trigger: root.current, start: "top 65%", once: true },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="contact" data-set="Serve" className="relative px-4 pb-24 pt-28 md:px-10 md:pb-32 md:pt-40">
      <h2 className="condensed text-[19vw] md:text-[11vw]">
        Your serve
        <span className="serve-ball ml-[0.06em] inline-block h-[0.17em] w-[0.17em] rounded-full bg-ball align-baseline" />
      </h2>

      <div className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-14 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-20">
        <CopyEmail />
        <ContactForm />
      </div>
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
      <p className="label text-line/40">Email</p>
      <a
        href={`mailto:${EMAIL}`}
        data-cursor
        className="mt-3 block break-all text-2xl font-medium tracking-tight transition-colors hover:text-ball-text md:text-3xl"
      >
        {EMAIL}
      </a>
      <button
        onClick={copy}
        data-cursor
        aria-live="polite"
        className="mt-4 flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-1.5 text-sm transition-colors hover:border-white/40"
      >
        {copied ? <FiCheck className="text-ball-text" /> : <FiCopy />}
        {copied ? "Copied" : "Copy"}
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
      <div>
        <p className="condensed text-5xl md:text-6xl">
          Point to you<span className="text-ball-text">.</span>
        </p>
        <p className="mt-4 text-line/60">Message received. I&rsquo;ll reply soon.</p>
        <button onClick={() => setStatus("idle")} className="mt-6 text-sm text-line/60 underline underline-offset-4">
          Send another
        </button>
      </div>
    );
  }

  const field =
    "w-full border-b border-white/15 bg-transparent py-3 text-lg outline-none transition-colors placeholder:text-line/30 focus:border-ball";

  return (
    <form ref={form} onSubmit={send} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <label className="block">
          <span className="sr-only">Name</span>
          <input name="name" required autoComplete="name" placeholder="Name" className={field} />
        </label>
        <label className="block">
          <span className="sr-only">Email</span>
          <input name="email" type="email" required autoComplete="email" placeholder="Email" className={field} />
        </label>
      </div>
      <label className="block">
        <span className="sr-only">Message</span>
        <textarea name="message" required rows={3} placeholder="What are we building?" className={`${field} resize-none`} />
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          data-cursor
          disabled={status === "sending"}
          className="flex items-center gap-2 rounded-full bg-line px-5 py-2.5 font-medium text-ink transition-colors hover:bg-ball hover:text-line disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send"} <FiArrowUpRight />
        </button>
        {status === "error" ? (
          <p role="alert" className="text-sm text-ball-text">
            Didn&rsquo;t send. Try again or email me directly.
          </p>
        ) : null}
      </div>
    </form>
  );
};
