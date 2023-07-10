import { Project } from "@/types";
import { GitHubLogoIcon, GlobeIcon } from "@radix-ui/react-icons";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";

type ProjectProps = {
  project: Project;
  minimal?: boolean;
};

const ProjectCard: NextPage<ProjectProps> = ({ project }) => {
  const username = "sudonick";
  return (
    <>
      <div className="border p-4 flex gap-x-4 items-start rounded-2xl w-[22rem]">
        <div className="relative h-28 w-28 min-h-[7rem] min-w-[7rem] rounded-xl overflow-hidden">
          <Image src={project.image} alt={project.name} layout="fill" />
        </div>
        <div className="flex flex-col justify-start items-start">
          <Link href={`/${username}/${project.slug}`}>
            <h1 className="font-bold text-xl">{project.name}</h1>
          </Link>
          <p className="mt-1 break-words text-start line-clamp-2 w-full">
            {project.description}
          </p>
          <div className="flex flex-wrap mt-2 gap-3">
            <GitHubLogoIcon className="cursor-pointer" width={20} height={20} />
            <GlobeIcon width={20} height={20} />
          </div>
        </div>
      </div>
    </>
  );
};
export default ProjectCard;
