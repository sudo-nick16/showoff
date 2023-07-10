import Container from "@/components/container";
import { GitHubLogoIcon, GlobeIcon } from "@radix-ui/react-icons";
import Image from "next/image";

type ProjectPageProps = {};
const ProjectPage = () => {
  return (
    <Container className="">
      <div className="mt-8 mx-auto w-fit flex flex-col items-start sm:flex-row gap-x-10">
        <div className="relative w-44 h-44 rounded-xl">
          <Image
            src={"https://avatars.githubusercontent.com/u/73229823?v=4"}
            alt="sudo-nick"
            layout="fill"
          />
        </div>
        <div className="flex flex-col items-center sm:items-start py-3">
          <div className="flex">
            <h2 className="text-xl font-bold">Smark</h2>
            <h2 className="text-xl ml-3 font-bold">@sudonick</h2>
          </div>
          <p className="mt-3 w-80 break-words line-clamp-2">
            A smart bookmarking tool that helps you organize your bookmarks and
            share them with others.
          </p>
          <div className="flex flex-wrap mt-4 gap-3">
            <GitHubLogoIcon className="cursor-pointer" width={20} height={20} />
            <GlobeIcon width={20} height={20} />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ProjectPage;
