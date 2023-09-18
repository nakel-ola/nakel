// import { ContactSection } from "@/components/ContactSection";
// import { Navbar } from "@/components/Navbar";
import { ContactSection } from "@/components/ContactSection";
import { Navbar } from "@/components/Navbar";
import truncate from "@/lib/truncate";
import "@/styles/globals.css";
import ProgressBar from "@badrap/bar-of-progress";
import type { AppProps } from "next/app";
import { Roboto_Mono, Signika_Negative, Rubik } from "next/font/google";
import Head from "next/head";
import { Router } from "next/router";
import { Fragment } from "react";
import { twJoin } from "tailwind-merge";

const font = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-signika-negative",
});

const progress = new ProgressBar({
  size: 2,
  color: "#2563eb",
  className: "bar-of-progress",
  delay: 100,
});

// this fixes safari jumping to the bottom of the page
// when closing the search modal using the `esc` key
if (typeof window !== "undefined") {
  progress.start();
  progress.finish();
}

Router.events.on("routeChangeStart", () => progress.start());
Router.events.on("routeChangeComplete", () => progress.finish());
Router.events.on("routeChangeError", () => progress.finish());

export const metadata = {
  title: "Nakel",
  description:
    "Welcome to Olamilekan's portfolio website, a showcase of my creative work and accomplishments. Explore my diverse collection of projects, including web design, graphic design, and photography. Get inspired by my passion for innovation and attention to detail. Discover how I combine aesthetics with functionality to deliver impactful and user-friendly experiences. Join me on this visual journey and witness the power of design. Contact me to collaborate on your next exciting project. Let's create something extraordinary together!",
  keywords:
    "Frontend Development, Web Design,Responsive Web Development,User Experience (UX),User Interface (UI),HTML5,CSS3,JavaScript,jQuery,React.js,Bootstrap,Mobile-First Design,Cross-Browser Compatibility,Accessibility,Performance Optimization,Code Efficiency,Website Maintenance,Portfolio Showcase, Frontend Frameworks,CSS Frameworks,Progressive Web Apps (PWA),Responsive Design,Mobile Optimization,Cross-Platform Development,JavaScript Libraries,Web Animation,UI/UX Design Principles,Wireframing,Prototyping,A/B Testing,Performance Monitoring,Version Control (Git),Frontend Tools and Technologies,Frontend Testing,Web Development Trends,Browser Compatibility Testing,Debugging,Frontend Security",
};

export default function App({ Component, pageProps, ...rest }: AppProps) {
  return (
    <Fragment>
      <Head>
        <meta name="title" content={`Nakel | ${process.env.BASE_URL}`} />
        <link rel="icon" href="/n-logo.png" />

        <meta
          key="og:url"
          property="og:url"
          content={`${process.env.BASE_URL}${rest.router.pathname}`}
        />
        <meta key="og:type" property="og:type" content="article" />
        <meta
          key="og:description"
          property="og:description"
          content={truncate(metadata.description, 100)}
        />
        <meta
          key="og:image"
          property="og:image"
          content={`${process.env.BASE_URL}/n-logo.png`}
        />

        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content="nakel.ola" />
        <meta name="publisher" content="nakel.ola" />

        <meta
          name="description"
          content={truncate(metadata.description, 100)}
        ></meta>

        <link rel="canonical" href={process.env.BASE_URL} />
        <meta name="robots" content="INDEX,FOLLOW"></meta>
        <meta property="og:title" content="Nakel" />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:URL" content={process.env.BASE_URL} />
        <meta property="og:type" content="website" />
      </Head>
      <div className={twJoin(font.className, "mx-auto w-full max-w-7xl")}>
        <Navbar />
        <Component {...pageProps} />
        <ContactSection />
      </div>
    </Fragment>
  );
}
