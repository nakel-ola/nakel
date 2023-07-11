import {
  ComponentsCard,
  Footer,
  Header,
  HeroCard,
  HeroComponents,
  TemplateCard
} from "@/features/home";

export default function Home() {
  return (
    <>
      <main className="overflow-visible">
        <Header />
        <HeroCard />
        <HeroComponents />
        <ComponentsCard />
        <TemplateCard />
        <Footer />
      </main>
    </>
  );
}

