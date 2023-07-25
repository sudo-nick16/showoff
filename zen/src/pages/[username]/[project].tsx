import Container, { GlassContainer } from "@/components/container";
import PostFormWrapper from "@/components/post-form";
import Posts from "@/components/posts";
import ProjectFormWrapper from "@/components/project-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import constants from "@/constants";
import {
  RootState,
  createPost,
  editProject,
  useAppDispatch,
} from "@/store/store";
import { Post, Project } from "@/types";
import {
  GitHubLogoIcon,
  GlobeIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import axios from "axios";
import { InferGetServerSidePropsType, NextPage, NextPageContext } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";

const ProjectPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ project: _project, posts: _posts }) => {
  const userState = useSelector<RootState, RootState["auth"]>(
    (store) => store.auth
  );
  const [posts, setPosts] = useState(_posts);
  const [project, setProject] = useState(_project);

  const me = userState.user?.id === project.user_id;

  const appDispatch = useAppDispatch();
  console.log(project, posts);
  return (
    <Container md>
      <GlassContainer className="mt-10 flex flex-col items-start justify-start sm:flex-row gap-x-8">
        <div className="relative w-32 h-32 rounded-2xl overflow-hidden">
          <Image
            src={project.img || "https://via.placeholder.com/150"}
            alt="sudo-nick"
            layout="fill"
          />
        </div>
        <div className="flex flex-col items-start min-h-[8rem] py-1">
          <div className="flex">
            <h2 className="text-xl font-bold">{project.title}</h2>
            <h2 className="text-xl ml-3 font-bold">@{project.username}</h2>
          </div>
          <p className="mt-1 mb-2 w-80 break-words line-clamp-3">
            {project.tagline}
          </p>
          <div className="flex flex-wrap mt-auto gap-3">
            <Link target="_blank" href={project.github_url! || ""}>
              <GitHubLogoIcon
                className="cursor-pointer"
                width={20}
                height={20}
              />
            </Link>
            <Link target="_blank" href={project.hosted_url! || ""}>
              <GlobeIcon width={20} height={20} />
            </Link>
          </div>
        </div>
        {me && (
          <ProjectFormWrapper
            callback={(data) => {
              setProject(data.project);
            }}
          >
            <Button
              className="ml-auto self-center"
              onClick={() => appDispatch(editProject(project))}
            >
              Edit Project
            </Button>
          </ProjectFormWrapper>
        )}
      </GlassContainer>
      {!!project.tech.length && (
        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-8">
          <h3 className="w-fit font-semibold text-lg">Techstack :</h3>
          <div className="col-span-3 flex flex-wrap gap-2">
            {project.tech.map((tech, i) => (
              <Badge key={i}>{tech}</Badge>
            ))}
          </div>
        </div>
      )}
      <div className="mt-4">
        <h2 className="font-semibold text-lg">Description</h2>
        <p className="mt-1">{project.description}</p>
      </div>
      {(!!userState.user || posts.length > 0) && (
        <div className="mt-4 mb-8">
          <h2 className="font-semibold text-lg mb-2">Journey</h2>
          <Posts
            setPosts={setPosts}
            callback={(d: any) =>
              setPosts((curr) => {
                const ps = curr.map((p) => {
                  if (p._id === d.post._id) {
                    return d.post;
                  }
                  return p;
                });
                return ps;
              })
            }
            posts={posts}
          />
          <PostFormWrapper callback={(data) => setPosts(data.posts)}>
            <div
              onClick={() => appDispatch(createPost(project._id!))}
              className="w-fit mt-3 mx-auto cursor-pointer"
            >
              <PlusCircledIcon
                width={25}
                height={25}
              />
            </div>
          </PostFormWrapper>
        </div>
      )}
    </Container>
  );
};

export default ProjectPage;

export const getServerSideProps = async (ctx: NextPageContext) => {
  const { username, project } = ctx.query;
  if (!username || !project) {
    return {
      notFound: true,
    };
  }
  try {
    const res = await axios.get(
      constants.ServerURL + `/stellar/users/${username}/projects/${project}`
    );
    if (res.data.error) {
      return {
        notFound: true,
      };
    }
    const res2 = await axios.get(
      constants.ServerURL + `/stellar/projects/${res.data.project._id}/posts`
    );
    console.log(res2);
    if (res2.data.error) {
      return {
        props: {
          project: res.data.project as Project,
          posts: [] as Post[],
        },
      };
    }
    return {
      props: {
        project: res.data.project as Project,
        posts: res2.data.posts as Post[],
      },
    };
  } catch (e) {
    console.log(e);
    return {
      notFound: true,
      fallback: "blocking",
    };
  }
};
