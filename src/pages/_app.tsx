import Footer from "@/components/Footer";
import Header from "@/components/Header";
import "@/styles/globals.css";
import truncate from "@/utils/truncate";
import ProgressBar from "@badrap/bar-of-progress";
import type { AppProps } from "next/app";
import { Poppins, Rubik } from "next/font/google";
import Head from "next/head";
import { Router } from "next/router";
import { twJoin } from "tailwind-merge";

export const data = {
  title: "",
  description:
    "Welcome to NakelTech Design! Unleash the Power of Creativity. We are your go-to destination for exceptional website design and development services. Our expert team is dedicated to bringing your visions to life, crafting stunning websites that captivate and engage your target audience. With a meticulous eye for detail and a passion for innovation, we tailor our designs to reflect your unique brand identity. From eye-catching visuals to seamless user experiences, we infuse every project with creativity and technical excellence. Partner with NakelTech Design to embark on a digital journey that will elevate your online presence. Let's create a digital masterpiece together!",
  keywords:
    "Website design,Web development,Custom website development,Responsive web design,User-friendly websites,Professional web design,Creative web development,Mobile-friendly websites,E-commerce website design,SEO-friendly websites,UI/UX design,Front-end development,Back-end development,Website maintenance,Web design agency",
};
const rubik = Rubik({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["cyrillic"],
});
const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["devanagari"],
});

const progress = new ProgressBar({
  size: 2,
  color: "#003326",
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

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <>
      <Head>
        <meta name="title" content={`Nakel`} />
        <title>Nakel</title>
        <link rel="icon" href="/logo.png" />

        <meta
          key="og:url"
          property="og:url"
          content={`${process.env.BASE_URL}${router.pathname}`}
        />
        <meta key="og:type" property="og:type" content="article" />
        <meta
          key="og:description"
          property="og:description"
          content={truncate(data.description, 100)}
        />
        <meta
          key="og:image"
          property="og:image"
          content={`${process.env.BASE_URL}/logo.png`}
        />

        <meta name="keywords" content={data.keywords} />
        <meta name="author" content="nakel.ola" />
        <meta name="publisher" content="nakel.ola" />

        {/* <meta
          name="google-site-verification"
          content="X1qZXCEXXIPwW26Xcg5eW0WZv5e2kqfRZXLFImttqWg"
        /> */}

        <meta
          name="description"
          content={truncate(data.description, 100)}
        ></meta>

        <link rel="canonical" href={process.env.BASE_URL} />
        <meta name="robots" content="INDEX,FOLLOW"></meta>
        <meta property="og:title" content="Nakel Design" />
        <meta property="og:description" content={data.description} />
        <meta property="og:URL" content={process.env.BASE_URL} />
        <meta property="og:type" content="website" />
      </Head>
      <main className={twJoin(rubik.className, "mx-auto w-full max-w-7xl")}>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </main>
    </>
  );
}
