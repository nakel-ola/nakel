import { logoFor } from "@/lib/logos";
import type { CaseStudy } from "@/lib/work";

const icon = (name: string) => ({ name, image: logoFor(name) });

/**
 * Flagship projects written up in full. They live here rather than in Sanity because
 * the CMS schema has no fields for parts, role or period yet.
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: "oxtave",
    name: "Oxtave",
    category: "Desktop & Mobile",
    tagline: "A digital audio workstation, built from scratch",
    description:
      "A full DAW plus companion apps for live sound, stage playback and sketching ideas on a phone, for producers, live engineers and gigging bands. One Rust audio core shared across every app.",
    role: "Solo, end to end",
    period: "Oct 2026",
    stack: ["Rust", "Tauri 2", "React 19", "TypeScript", "Axum", "Postgres", "ONNX Runtime", "Stripe", "Cloudflare R2"].map(icon),
    cover: "/work/oxtave/console-layers.webp",
    screens: [],
    features: [
      { title: "Shape every channel", text: "EQ, dynamics and sends for any channel, straight from the remote.", image: "/work/oxtave/console-edit.webp" },
      { title: "Mix by touch", text: "Big, responsive faders built for a tablet at front of house.", image: "/work/oxtave/console-touch.webp" },
      { title: "Your own monitor mix", text: "Every musician sets their own levels from their phone.", image: "/work/oxtave/console-mymix.webp" },
      { title: "Pocket mode", text: "The whole desk, scaled down for one hand.", image: "/work/oxtave/console-pocket.webp" },
    ],
    parts: [
      {
        kind: "Desktop",
        title: "The DAW",
        summary: "Real-time Rust engine behind a React interface.",
        points: [
          "Lock-free audio engine with out-of-process plugin hosting and ARA",
          "On-device stem separation with Hybrid Transformer Demucs on ONNX",
          "AI mix assistant, score view and sandboxed controller scripts",
        ],
        stack: ["Rust", "Tauri 2", "React", "ONNX", "QuickJS"],
      },
      {
        kind: "Mobile",
        title: "Console",
        summary: "A remote for real mixing desks, on phone, tablet and desktop.",
        points: [
          "Behringer X32/M32 over OSC and WING's binary protocol",
          "Allen & Heath and Yamaha drivers, each with a simulated desk",
          "Wireless mic battery and RF readout for Shure and Sennheiser",
        ],
        stack: ["Rust", "Tauri 2", "OSC"],
      },
      {
        kind: "Stage",
        title: "Live & Sketch",
        summary: "Show playback for bands, and an idea recorder that round-trips into the DAW.",
        points: [
          "Sample-exact stem playback, click, spoken cues and setlists",
          "Timecode, Art-Net lighting and Stream Deck control",
          "Tempo, key and section detection to prep songs",
        ],
        stack: ["Rust", "Tauri 2", "LTC/MTC"],
      },
      {
        kind: "Cloud",
        title: "API & admin",
        summary: "Accounts, billing, AI and team storage behind every app.",
        points: [
          "Magic-link and device-flow sign-in, signed licences",
          "Stripe billing with metered AI credits and rate limits",
          "Admin dashboard embedded in the server binary",
        ],
        stack: ["Axum", "SQLx", "Postgres", "Stripe", "R2"],
      },
    ],
    links: [{ label: "Visit site", href: "https://www.getoxtave.com" }],
  },
  {
    slug: "sarosa",
    name: "Sarosa",
    category: "macOS App",
    tagline: "A keyboard-first launcher with coding agents and AI bots",
    description:
      "A free launcher for macOS power users: search apps, recall your clipboard, talk to AI, run every coding agent in one window and keep a team of bots working for you. It also runs Raycast extensions.",
    role: "Solo, end to end",
    period: "Oct 2026",
    stack: ["Rust", "Swift", "Tauri 2", "React 19", "NestJS", "SQLite", "Cloudflare Workers", "MCP"].map(icon),
    cover: "/work/sarosa/launcher.webp",
    screens: [],
    features: [
      { title: "Every coding agent in one window", text: "Run Claude Code, Codex and Cursor side by side and review their diffs.", image: "/work/sarosa/agents-split.webp" },
      { title: "Bots that keep working", text: "Give them memory and skills, and they run routines on a schedule.", image: "/work/sarosa/bots-chat.webp" },
      { title: "Clipboard history", text: "Search everything you have copied, with the app it came from.", image: "/work/sarosa/clipboard.webp" },
      { title: "Raycast extensions", text: "Install from the store and they just run.", image: "/work/sarosa/store.webp" },
      { title: "Dictation", text: "Speak and it types into any app, transcribed on your Mac.", image: "/work/sarosa/dictation.webp" },
    ],
    parts: [
      {
        kind: "Desktop",
        title: "The shell",
        summary: "Native macOS layer in Rust and Swift.",
        points: [
          "Global hotkey, window management and a built-in terminal",
          "A panel joined to the MacBook notch showing live agent activity",
          "On-device dictation through a Swift helper",
        ],
        stack: ["Rust", "Swift", "Tauri 2"],
      },
      {
        kind: "Runtime",
        title: "Extensions & agents",
        summary: "A NestJS backend speaking JSON-RPC over stdio.",
        points: [
          "Runs Raycast extensions through a custom React reconciler",
          "Claude Code, Codex and Cursor sessions with approvals, rewind and fork",
          "Bots with memory, skills, MCP servers and scheduled routines",
        ],
        stack: ["NestJS", "react-reconciler", "MCP", "SQLite"],
      },
      {
        kind: "Cloud",
        title: "Relay",
        summary: "Teams and remote access on Cloudflare.",
        points: [
          "A Durable Object per user keeps a socket to their Mac and queues while offline",
          "Magic-link accounts, teams and team bots on D1",
          "Slack integration",
        ],
        stack: ["Workers", "Durable Objects", "D1"],
      },
    ],
    links: [
      { label: "Visit site", href: "https://sarosa.nakel.app" },
      { label: "Download", href: "https://github.com/nakel-ola/sarosa-releases/releases/latest/download/Sarosa.dmg" },
    ],
  },
  {
    slug: "lacuna",
    name: "Lacuna",
    category: "macOS App",
    tagline: "A fast, private disk space analyzer",
    description:
      "Free and open source. Lacuna shows what is filling your Mac and cleans it up safely, with every deletion reviewed first. It scanned 6.2M files in 32 seconds with totals that match du.",
    role: "Solo, end to end",
    period: "Oct 2026",
    stack: ["Rust", "Tauri 2", "React 19", "Zustand", "BLAKE3"].map(icon),
    cover: "/work/lacuna/app-dark.webp",
    screens: [],
    features: [
      { title: "See what fills your Mac", text: "Space by folder and by file type, scanned in seconds.", image: "/work/lacuna/app-light.webp" },
      { title: "Clean up safely", text: "Pick what goes, review it, then move it to the Trash.", image: "/work/lacuna/app-dark.webp" },
      { title: "Every disk, one view", text: "Switch between your Mac and any external drive.", image: "/work/lacuna/screenshot.webp" },
    ],
    parts: [
      {
        kind: "Core",
        title: "The scanner",
        summary: "Rust, built for speed and safety.",
        points: [
          "16-thread scanner on getattrlistbulk into an arena tree",
          "Duplicate finder that narrows by size and inode before BLAKE3 hashing",
          "Every move to Trash is re-checked on the Rust side",
        ],
        stack: ["Rust", "BLAKE3", "memmap2"],
      },
      {
        kind: "App",
        title: "Cleanup & insight",
        summary: "Tells you what is safe to remove, and why space is missing.",
        points: [
          "Rules for regenerable data: Xcode, caches, node_modules, Docker",
          "Explains hidden space from APFS snapshots and purgeable data",
          "Menu bar monitor and a CLI with JSON/CSV export",
        ],
        stack: ["Tauri 2", "React", "Zustand"],
      },
    ],
    links: [
      { label: "Visit site", href: "https://lacuna.nakel.app" },
      { label: "Source", href: "https://github.com/nakel-ola/lacuna" },
    ],
  },
  {
    slug: "jollopot",
    name: "Jollopot",
    category: "Mobile App",
    tagline: "Nigerian recipes, step by step",
    description:
      "A cooking app for Nigerian kitchens at home and abroad: recipes, a pantry, meal plans, shopping lists and the cost of every plate. 101 recipes and 243 ingredients priced in four countries.",
    role: "Solo, end to end",
    period: "Oct 2026",
    stack: ["Expo", "React Native", "TypeScript", "Supabase", "Postgres", "Vite", "Cloudflare R2", "Paystack"].map(icon),
    cover: "/work/jollopot/cover.webp",
    screens: [],
    features: [
      { title: "Can't decide? Stir the pot", text: "Swipe through dishes until one sounds right.", image: "/work/jollopot/02-stir-the-pot.webp" },
      { title: "Cook it step by step", text: "101 Nigerian classics with timers and steps read aloud.", image: "/work/jollopot/03-step-by-step.webp" },
      { title: "Your week, sorted", text: "Breakfast, lunch and dinner planned for the whole house.", image: "/work/jollopot/04-week-sorted.webp" },
      { title: "Waste less", text: "The pantry knows what is running low before you do.", image: "/work/jollopot/05-waste-less.webp" },
      { title: "Shop smart", text: "A market list with every plate priced in naira.", image: "/work/jollopot/06-shop-smart.webp" },
    ],
    parts: [
      {
        kind: "Mobile",
        title: "The app",
        summary: "Expo app for iOS and Android.",
        points: [
          "Offline-first sync with a queued outbox and tombstoned deletes",
          "Cook mode with step timers, read-aloud and iOS Live Activities",
          "Swipe deck to decide what to cook, pantry run-out prediction",
        ],
        stack: ["Expo", "React Native", "Zustand"],
      },
      {
        kind: "Backend",
        title: "Supabase & payments",
        summary: "Household sync, pricing and checkout.",
        points: [
          "Paystack for naira, Flutterwave for diaspora currencies",
          "Hourly pg_cron job that refreshes Lagos market prices",
          "Row-level security covered by tests on PGlite",
        ],
        stack: ["Supabase", "Postgres", "Deno"],
      },
      {
        kind: "Web",
        title: "Site & cookbook",
        summary: "Pre-rendered landing page and recipe catalog.",
        points: [
          "Every page pre-rendered with SEO tags, JSON-LD and a sitemap",
          "Weekly price scraper on GitHub Actions feeding R2",
          "Waitlist and public feedback board",
        ],
        stack: ["Vite", "React 19", "Playwright"],
      },
    ],
    links: [{ label: "Visit site", href: "https://www.jollopot.com" }],
  },
];

/** Case studies first, then everything from Sanity that isn't already covered. */
export const mergeWork = (fromCms: CaseStudy[]) => {
  const taken = new Set(caseStudies.map((c) => c.slug));
  return [...caseStudies, ...fromCms.filter((c) => !taken.has(c.slug))];
};
