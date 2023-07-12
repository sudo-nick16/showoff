import Container from "@/components/container";
import ProjectCard from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserFormWrapper from "@/components/user-form";
import { RootState, showUserForm, useAppDispatch } from "@/store/store";
import { Project } from "@/types";
import { GitHubLogoIcon, GlobeIcon, Pencil1Icon } from "@radix-ui/react-icons";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const appDispatch = useAppDispatch();
  const authState = useSelector<RootState, RootState["auth"]>(
    (store) => store.auth
  );
  const router = useRouter();
  const { username } = router.query;

  const projects: Project[] = [
    {
      title: "smark",
      slug: "smark",
      description:
        "a bookmarking tool asrt asrt af arst arst arst arst arts rastra tsrats arst rast arst rast asrtra strast arst arstar tsrast rst  rtar st",
      img: "https://lh3.googleusercontent.com/bVx9i0d1fMqiqJhc8UNVfF20jKkeKzDKJLowJzXw3aOCWHJMAJg6ruGrVN0t7knUV3xVthRwScNjsLEz87UGdoYEuw=w128-h128-e365-rj-sc0x00ffffff",
      tech: ["react", "nextjs", "typescript", "tailwindcss"],
      github_url: "https://github.com/sudo-nick16/smark",
      hosted_url: "https://smark.vercel.app",
    },
    {
      title: "smark",
      slug: "smark",
      description: "a bookmarking tool",
      img: "https://lh3.googleusercontent.com/bVx9i0d1fMqiqJhc8UNVfF20jKkeKzDKJLowJzXw3aOCWHJMAJg6ruGrVN0t7knUV3xVthRwScNjsLEz87UGdoYEuw=w128-h128-e365-rj-sc0x00ffffff",
      tech: ["react", "nextjs", "typescript", "tailwindcss"],
      github_url: "https://github.com/sudo-nick16/smark",
      hosted_url: "https://smark.vercel.app",
    },
  ];
  return (
    <Container className="py-8 flex flex-col justify-center items-center">
      <div className="mt-8 mx-auto w-fit flex flex-col items-center sm:flex-row gap-y-4 gap-x-10">
        <div className="relative w-40 h-40 rounded-xl">
          <Image
            src={"https://avatars.githubusercontent.com/u/73229823?v=4"}
            alt="sudo-nick"
            layout="fill"
          />
        </div>
        <div className="flex flex-col items-center sm:items-start py-3">
          <div className="flex flex-wrap justify-center items-end">
            <h2 className="text-2xl w-fit font-bold">Sudo nick</h2>
            <h2 className="text-xl ml-3 font-bold">@sudonick</h2>
          </div>
          <h2 className="mt-3 text-xl break-words line-clamp-2">
            Systems Engineer
          </h2>
          <div className="flex flex-wrap mt-4 gap-3">
            <GitHubLogoIcon className="cursor-pointer" width={25} height={25} />
            <GlobeIcon width={25} height={25} />
          </div>
        </div>
        {authState.user?.username === username && (
          <UserFormWrapper>
            <Button
              onClick={() =>
                appDispatch(
                  showUserForm({
                    username: authState.user!.username,
                    name: authState.user!.name,
                    headline: authState.user!.headline,
                    description: authState.user!.description,
                  })
                )
              }
            >
              Edit Profile
            </Button>
          </UserFormWrapper>
        )}
      </div>
      <Tabs
        defaultValue="projects"
        className="mt-10 text-center w-full mx-auto"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
        </TabsList>
        <TabsContent value="projects" className="w-full">
          <div className="flex flex-wrap gap-6 justify-center">
            {projects.map((p, i) => (
              <ProjectCard key={i} project={p} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="posts">
          <div className="grid grid-cols-3 grid-flow-row"></div>
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default Profile;
