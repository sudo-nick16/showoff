import { Project } from "@/types";
import { GitHubLogoIcon, GlobeIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import ProjectFormWrapper from "./project-form";
import { RootState, setEditMode, useAppDispatch } from "@/store/store";
import { useSelector } from "react-redux";

type ProjectProps = {
  project: Project;
  minimal?: boolean;
};

const ProjectCard: NextPage<ProjectProps> = ({ project }) => {
  const authState = useSelector<RootState, RootState["auth"]>(
    (state) => state.auth
  );
  const appDispatch = useAppDispatch();
  return (
    <>
      <div className="border relative p-4 flex gap-x-4 items-start rounded-2xl w-[22rem]">
        <ProjectFormWrapper>
          {authState.user?.username === project.username && (
            <Pencil2Icon
              onClick={() => appDispatch(setEditMode(project))}
              className="absolute right-2 top-2 h-5 w-5"
            />
          )}
        </ProjectFormWrapper>
        <div className="relative h-28 w-28 min-h-[7rem] min-w-[7rem] rounded-xl overflow-hidden">
          <Image src={project.img} alt={project.title} layout="fill" />
        </div>
        <div className="flex flex-col justify-start items-start">
          <Link href={`/${project.username}/${project.slug}`}>
            <h1 className="font-bold text-xl">{project.title}</h1>
          </Link>
          <p className="mt-1 h-12 break-words text-start line-clamp-2 w-full">
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
