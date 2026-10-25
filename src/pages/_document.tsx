import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicons/favicon.ico" />
        <link rel="manifest" href="/favicons/site.webmanifest" />
        <meta name="theme-color" content="#F4F2FF" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
