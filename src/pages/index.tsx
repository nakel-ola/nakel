import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Skills } from "@/components/sections/Skills";
import { Work } from "@/components/sections/Work";
import { mergeWork } from "@/data/caseStudies";
import { homeQuery, sanityClient } from "@/lib/sanity";
import { CaseStudy, fromSanity, toProps } from "@/lib/work";
import { GetStaticProps } from "next";

type HomeProps = {
  about: AboutResponse;
  skills: SkillResponse[];
  work: CaseStudy[];
};

const FEATURED = 9;

export default function Home({ about, skills, work }: HomeProps) {
  const featured = work.slice(0, FEATURED);

  return (
    <>
      <Hero projects={work} />
      <About about={about} projectCount={work.length} />
      <Work projects={featured} total={work.length} />
      <Skills skills={skills} />
      <Contact />
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const { about, skills, projects } = await sanityClient.fetch<{
    about: AboutResponse;
    skills: SkillResponse[];
    projects: ProjectResponse[];
  }>(homeQuery);
  return {
    props: toProps({ about, skills, work: mergeWork(projects.map(fromSanity)) }),
    revalidate: 60,
  };
};
