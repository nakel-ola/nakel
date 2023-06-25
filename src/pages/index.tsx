import PageGradient from "@/components/PageGradient";
import { Content, Features, Hero } from "@/features/home";

export default function Home() {
  return (
    <>
      <PageGradient>
        <Hero />
        <Features />
      </PageGradient>
      <Content />
    </>
  );
}
