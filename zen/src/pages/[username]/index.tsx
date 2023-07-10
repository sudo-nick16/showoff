import Container from "@/components/container";
import ProjectCard from "@/components/project-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Project } from "@/types";
import { GitHubLogoIcon, GlobeIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import React from "react";

const Profile = () => {
  const projects: Project[] = [
    {
      name: "smark",
      slug: "smark",
      description: "a bookmarking tool asrt asrt af arst arst arst arst arts rastra tsrats arst rast arst rast asrtra strast arst arstar tsrast rst  rtar st",
      image: "https://lh3.googleusercontent.com/bVx9i0d1fMqiqJhc8UNVfF20jKkeKzDKJLowJzXw3aOCWHJMAJg6ruGrVN0t7knUV3xVthRwScNjsLEz87UGdoYEuw=w128-h128-e365-rj-sc0x00ffffff",
      tech: ["react", "nextjs", "typescript", "tailwindcss"],
      github: "https://github.com/sudo-nick16/smark",
      url: "https://smark.vercel.app",
    },
    {
      name: "smark",
      slug: "smark",
      description: "a bookmarking tool",
      image: "https://lh3.googleusercontent.com/bVx9i0d1fMqiqJhc8UNVfF20jKkeKzDKJLowJzXw3aOCWHJMAJg6ruGrVN0t7knUV3xVthRwScNjsLEz87UGdoYEuw=w128-h128-e365-rj-sc0x00ffffff",
      tech: ["react", "nextjs", "typescript", "tailwindcss"],
      github: "https://github.com/sudo-nick16/smark",
      url: "https://smark.vercel.app",
    },
  ];
  return (
    <Container className="py-8 flex-col justify-center items-center">
      <div className="mt-8 mx-auto w-fit flex flex-col items-center sm:flex-row gap-x-10">
        <div className="relative w-44 h-44 rounded-xl">
          <Image
            src={"https://avatars.githubusercontent.com/u/73229823?v=4"}
            alt="sudo-nick"
            layout="fill"
          />
        </div>
        <div className="flex flex-col items-center sm:items-start py-3">
          <div className="flex">
            <h2 className="text-xl font-bold">Sudo nick</h2>
            <h2 className="text-xl ml-3 font-bold">@sudonick</h2>
          </div>
          <p className="mt-3 w-80 break-words line-clamp-2">
            Lorem ipsum dolor sit amet, officia excepteur ex fugiat
            reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit
            ex esse exercitation amet. Nisi anim cupidatat excepteur officia.
            Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate
            voluptate dolor minim nulla est proident. Nostrud officia pariatur
            ut officia. Sit irure elit esse ea nulla sunt ex occaecat
            reprehenderit commodo officia dolor Lorem duis laboris cupidatat
            officia voluptate. Culpa proident adipisicing id nulla nisi laboris
            ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo
            ex non excepteur duis sunt velit enim. Voluptate laboris sint
            cupidatat ullamco ut ea consectetur et est culpa et culpa duis.
          </p>
          <div className="flex flex-wrap mt-4 gap-3">
            <GitHubLogoIcon className="cursor-pointer" width={20} height={20} />
            <GlobeIcon width={20} height={20} />
          </div>
        </div>
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
            {projects.map((p) => (
              <ProjectCard key={p.name} project={p} />
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
