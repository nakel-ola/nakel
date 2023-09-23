import { Modal } from "@/components/Modal";
import { ProjectsSection } from "@/components/ProjectsSection";
import { sanityClient } from "@/lib/sanity";
import { GetServerSideProps } from "next";
import { groq } from "next-sanity";
import { useState } from "react";

type Props = {
  projects: ProjectResponse[];
};
export default function Projects(props: Props) {
  const { projects } = props;
  const [selected, setSelected] = useState<ProjectResponse | null>(null);

  return (
    <main>
      <ProjectsSection
        projects={projects.sort((a, b) => a.pos - b.pos)}
        showAll
        selected={selected}
        setSelected={setSelected}
      />

      <Modal selected={selected} setSelected={setSelected} />
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const data = await sanityClient.fetch(query);
    return { props: data };
  } catch (err: any) {
    console.log(err);
    throw new Error(err.message);
  }
};

const query = groq`
  {
    "projects": *[_type == "projects"] | order(createdAt asc) {
      ...,
      "images": images[].asset->url,
      tech[]->{
        ...,
        "image": image.asset->url,
      }
    }
  }
`;
