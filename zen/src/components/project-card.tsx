import { Project } from "@/types";
import { GitHubLogoIcon, GlobeIcon, Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import ProjectFormWrapper from "./project-form";
import { RootState, editProject, useAppDispatch } from "@/store/store";
import { useSelector } from "react-redux";
import useAxios from "@/hooks/useAxios";

type ProjectProps = {
  project: Project;
  minimal?: boolean;
  className?: string;
  callback?: (d: any) => void
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
};

const ProjectCard: NextPage<ProjectProps> = ({ project, className, callback, setProjects }) => {
  const authState = useSelector<RootState, RootState["auth"]>(
    (state) => state.auth
  );
  const api = useAxios();
  const appDispatch = useAppDispatch();
  const image = project!.img.startsWith("https://")
    ? project!.img
    : "https://" + project!.img;

  const deleteProjectHandler = async () => {
    const res = await api.delete(`/stellar/projects/${project!._id}`);
    if (!res?.data.error) {
      setProjects((prev) => prev.filter((p) => p._id !== project!._id));
    }
  }
  return (
    <>
      <div
        className={`border border-l-muted border-t-muted border-b-transparent border-r-transparent overflow-hidden
        after:content-[""] after:absolute after:top-0 after:left-0 after:bg-muted after:w-full after:h-2 after:rounded-full after:blur-md
        before:content-[""] before:absolute before:top-0 before:left-0 before:bg-muted before:w-2 before:h-1/2 before:rounded-full before:blur-md
        backdrop-blur-2xl bg-[#1F29371E] relative p-4 flex gap-x-4 items-start rounded-2xl w-[22rem] ${className}`}
      >
        {authState.user?.username === project!.username && (
          <div className="absolute right-2 top-2 flex gap-2 items-center">
            <ProjectFormWrapper callback={(d) => {
              callback && callback(d)
            }}>
              <Pencil2Icon
                onClick={() => appDispatch(editProject(project!))}
                className=" h-4 w-4 cursor-pointer"
              />
            </ProjectFormWrapper>
            <TrashIcon onClick={deleteProjectHandler} className="h-4 w-4 cursor-pointer" />
          </div>
        )}
        <div className="relative my-auto h-20 sm:h-28 w-20 sm:w-28 sm:min-h-[7rem] sm:min-w-[7rem] min-h-[5rem] min-w-[5rem] rounded-xl overflow-hidden">
          <Image src={image} alt={project!.title} layout="fill" />
        </div>
        <div className="flex flex-col py-1 justify-start items-start h-full">
          <Link href={`/${project!.username}/${project!.slug}`}>
            <h1 className="font-semibold text-start text-base leading-tight line-clamp-2">
              {project!.title}
            </h1>
          </Link>
          <p className="mt-2 mb-2 text-primary break-words text-start text-sm line-clamp-3 leading-tight w-full">
            {project!.tagline}
          </p>
          <div className="flex flex-wrap mt-auto gap-3">
            <Link target="_blank" href={project.github_url}>
              <GitHubLogoIcon
                className="cursor-pointer"
                width={20}
                height={20}
              />
            </Link>
            <Link target="_blank" href={project.hosted_url}>
              <GlobeIcon width={20} height={20} className="cursor-pointer" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default ProjectCard;
