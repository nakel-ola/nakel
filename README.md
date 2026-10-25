# Nakel portfolio 3.0

Olamilekan Nunu's portfolio, built with Next.js (pages router), Sanity CMS, GSAP and Lenis.

The site is styled like a live table-tennis broadcast: the hero is a playable 3D table (move your pointer to take the paddle, first to 5 against "Nunu"), the pinned scoreboard tracks the score, projects play as replays, and the skills section is a throwable multiball drill.

## Stack

- **Next.js 15 / React 19**, statically generated pages that revalidate every 60s
- **Sanity** for content, with the studio embedded at `/admin`
- **three.js** for the 3D table (loaded on demand)
- **GSAP** (ScrollTrigger) + **Lenis** smooth scrolling
- **Tailwind CSS** with the tokens in `tailwind.config.js`
- Interactive pieces ported from ReactBits Pro live in `src/components/bits`

## Environment

Create `.env.local` with:

```
BASE_URL=
SANITY_PROJECT_ID=
SANITY_DATASET=
SANITY_TOKEN=
EMAILJS_SERVICE_ID=
EMAILJS_TEMPLATE_ID=
EMAILJS_PUBLIC_KEY=
```

`SANITY_TOKEN` is only read on the server. Don't add it to `env` in `next.config.js`, because everything listed there gets inlined into the browser bundle.

## Run

```bash
npm install
npm run dev
```
