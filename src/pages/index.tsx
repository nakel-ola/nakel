import { AboutMeSection } from "@/components/AboutMeSection";
import { HeroSection } from "@/components/HeroSection";
import { Modal } from "@/components/Modal";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ServicesSection } from "@/components/ServicesSection";
import { SkillsSection } from "@/components/SkillsSection";
import { fetchData } from "@/lib/fetchData";
import { GetServerSideProps } from "next";
import React, { Fragment, useState } from "react";

type HomePropType = {
  about: AboutResponse;
  skills: SkillResponse[];
  services: ServiceResponse[];
  projects: ProjectResponse[];
};

export default function Home(props: HomePropType) {
  const { about, skills, projects = [], services } = props;

  const [selected, setSelected] = useState<ProjectResponse | null>(null);
  return (
    <Fragment>
      <HeroSection />
      <ProjectsSection
        projects={projects.sort((a, b) => a.pos - b.pos)}
        selected={selected}
        setSelected={setSelected}
      />
      <AboutMeSection about={about} />
      <SkillsSection skills={skills} />
      {/*
      <ServicesSection />
      */}

      <Modal selected={selected} setSelected={setSelected} />
    </Fragment>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = await fetchData();

  return { props: data };
};
