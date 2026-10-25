import CustomCursor from "@/components/bits/CustomCursor";
import { Navbar } from "@/components/Navbar";
import { Preloader } from "@/components/Preloader";
import { IntroProvider } from "@/components/providers/Intro";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Geist, Geist_Mono } from "next/font/google";
import Head from "next/head";

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const description =
  "Olamilekan Nunu (Nakel) is a full-stack developer in Lagos building fast, friendly products for the web and mobile with React, Next.js, Node and Flutter.";

export default function App({ Component, pageProps, router }: AppProps) {
  const fonts = cn(sans.variable, mono.variable);
  const baseUrl = process.env.BASE_URL ?? "";

  // The Sanity studio brings its own chrome.
  if (router.pathname.startsWith("/admin")) {
    return (
      <div className={fonts}>
        <Component {...pageProps} />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Nakel · Olamilekan Nunu, full-stack developer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={description} />
        <meta name="author" content="Olamilekan Nunu" />
        <meta property="og:title" content="Nakel · Olamilekan Nunu" />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${baseUrl}${router.asPath}`} />
        <meta property="og:image" content={`${baseUrl}/photos/portrait.webp`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <SmoothScroll>
        <IntroProvider>
          <div className={cn(fonts, "relative font-sans")}>
            <Preloader />
            <Navbar
              counts={{ work: (pageProps.work ?? pageProps.projects)?.length, skills: pageProps.skills?.length }}
            />
            <main>
              <Component {...pageProps} />
            </main>
            <CustomCursor
              circleSize={36}
              dotSize={6}
              circleColor="#ffffff"
              dotColor="#ffffff"
              circleBorderWidth={1}
              mixBlendMode="difference"
              targetPadding={6}
              targets={["[data-cursor]"]}
              elastic
              zIndex={95}
            />
          </div>
        </IntroProvider>
      </SmoothScroll>
    </>
  );
}
