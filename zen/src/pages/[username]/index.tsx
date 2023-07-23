import Container, { GlassContainer } from "@/components/container";
import ProjectCard from "@/components/project-card";
import ProjectFormWrapper from "@/components/project-form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserFormWrapper from "@/components/user-form";
import constants from "@/constants";
import {
  RootState,
  createNewProject,
  setUserState,
  showUserForm,
  useAppDispatch,
} from "@/store/store";
import { Project, User } from "@/types";
import { GitHubLogoIcon, GlobeIcon, PlusIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { InferGetServerSidePropsType, NextPage, NextPageContext } from "next";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const Profile: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ projects: _projects, user: _user }) => {
  const userState = useSelector<RootState, RootState["auth"]>(
    (store) => store.auth
  );
  const appDispatch = useAppDispatch();
  const [projects, setProjects] = useState(_projects);
  const [user, setUser] = useState(_user);

  const me = _user.id === userState.user?.id;

  return (
    <Container className="py-8 flex flex-col justify-center items-start max-w-[800px]">
      <div className="mt-4 w-full flex flex-col items-center sm:items-start sm:flex-row gap-y-4 gap-x-10">
        <div className="relative w-40 h-40 rounded-xl">
          <Image src={user.img!} alt="sudo-nick" layout="fill" />
        </div>
        <div className="flex flex-col items-center sm:items-start py-3">
          <div className="flex flex-wrap justify-center items-end">
            <h2 className="text-2xl w-fit font-bold">{user.name}</h2>
            <h2 className="text-xl ml-3 font-bold">@{user.username}</h2>
          </div>
          <p className="mt-2 text-lg break-words line-clamp-2 max-w-[22rem]">
            {user.headline}
          </p>
          <div className="flex flex-wrap mt-4 gap-3">
            <Link
              target="_blank"
              href={`https://github.com/${user.githubId || ""}`}
            >
              <GitHubLogoIcon
                className="cursor-pointer"
                width={25}
                height={25}
              />
            </Link>
            <Link target="_blank" href={user.website! || ""}>
              <GlobeIcon width={25} height={25} />
            </Link>
          </div>
        </div>
        {me && (
          <UserFormWrapper
            callback={(u) => {
              setUser(u);
              appDispatch(setUserState(u));
            }}
          >
            <Button
              className="sm:ml-auto self-center"
              onClick={() =>
                appDispatch(
                  showUserForm({
                    username: userState.user!.username,
                    name: userState.user!.name,
                    headline: userState.user!.headline,
                    description: userState.user!.description,
                    website: userState.user!.website!,
                    githubId: userState.user!.githubId!,
                  })
                )
              }
            >
              Edit Profile
            </Button>
          </UserFormWrapper>
        )}
      </div>
      <div className="mt-8 w-full">
        <h2 className="font-bold text-xl">About</h2>
        <p className="mt-2">{userState.user?.description}</p>
      </div>
      <Tabs defaultValue="projects" className="mt-10 w-full mx-auto">
        <TabsList className="mb-6">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
        </TabsList>
        <TabsContent value="projects" className="w-full">
          <div className="flex flex-wrap gap-6 w-full justify-center">
            {projects.map((p, i) => (
              <ProjectCard
                setProjects={setProjects}
                callback={(data) => {
                  setProjects((curr) => {
                    const ps = curr.map((p) => {
                      if (p._id === data.project._id) {
                        return data.project;
                      }
                      return p;
                    });
                    return ps;
                  });
                }}
                key={i} project={p} className="w-full" />
            ))}
            <ProjectFormWrapper
              callback={(data) => {
                setProjects(data.projects);
              }}
            >
              <div
                onClick={() => appDispatch(createNewProject())}
                className="border border-dashed relative p-4 flex gap-x-4 cursor-pointer items-center justify-center rounded-2xl w-full min-h-[7rem]"
              >
                <PlusIcon className="w-full h-28 opacity-20" />
              </div>
            </ProjectFormWrapper>
          </div>
        </TabsContent>
        <TabsContent value="posts">
          <div className="grid grid-cols-3 grid-flow-row"></div>
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const username = context.query.username;
  const userRes = await axios.get(
    constants.ServerURL + "/apex/users/" + username
  );
  const projectRes = await axios.get(
    constants.ServerURL + "/stellar/users/" + username + "/projects"
  );
  return {
    props: {
      projects: (projectRes.data.projects || []) as Project[],
      user: userRes.data as User,
    },
  };
};

export default Profile;
