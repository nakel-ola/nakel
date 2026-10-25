import { ProjectModal } from "@/components/ProjectModal";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Skills } from "@/components/sections/Skills";
import { Work } from "@/components/sections/Work";
import { homeQuery, sanityClient } from "@/lib/sanity";
import { GetStaticProps } from "next";
import { useCallback, useState } from "react";

type HomeProps = {
  about: AboutResponse;
  skills: SkillResponse[];
  projects: ProjectResponse[];
};

const FEATURED = 6;

export default function Home({ about, skills, projects }: HomeProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const featured = projects.slice(0, FEATURED);
  const close = useCallback(() => setSelected(null), []);

  return (
    <>
      <Hero resumeUrl={about.resume} />
      <Work
        projects={featured}
        total={projects.length}
        onSelect={(p) => setSelected(featured.indexOf(p))}
      />
      <About about={about} projectCount={projects.length} />
      <Skills skills={skills} />
      <Contact />

      <ProjectModal
        project={selected === null ? null : featured[selected]}
        onClose={close}
      />
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const data = await sanityClient.fetch<HomeProps>(homeQuery);
  return { props: data, revalidate: 60 };
};
