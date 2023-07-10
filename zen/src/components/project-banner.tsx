import { NextPage } from "next";
import Image from "next/image";

type Project = {
  name: string;
  description: string;
  url: string;
  github: string;
  image: string;
  tech: string[];
};

type ProjectProps = {
  project: Project;
  minimal?: boolean;
};

const ProjectBanner: NextPage<ProjectProps> = ({ project }) => {
  return (
    <>
      <div className="border p-6 flex items-center">
        <div className="relative h-32 w-32">
          <Image src={project.image} alt={project.name} layout="fill" />
        </div>
        <div className="flex flex-col">
          <h1 className="font-bold xl">{project.name}</h1>
          <p className="lg">{project.description}</p>
        </div>
      </div>
    </>
  );
};
export default ProjectBanner;
