import Container from "@/components/container";
import ProjectCard from "@/components/project-card";
import constants from "@/constants";
import { Project } from "@/types";
import axios from "axios";
import { InferGetServerSidePropsType, NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";

const SearchPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ projects }) => {
  const { q, filter } = useRouter().query;
  return <>
    <Container md className="my-6 flex flex-col">
      <div className="text-muted-foreground text-sm mb-4 px-2">
        Showing results for "{q}" filtered by "{filter == "project" ? "project name" : filter}"
      </div>
      {
        projects.map((project, i) => {
          return (
            <ProjectCard showControls={false} className="w-full" key={i} project={project} />
          )
        })
      }
    </Container>
  </>
};

export const getServerSideProps = async (ctx: NextPageContext) => {
  const { q, filter } = ctx.query;
  const res = await axios.get(constants.ServerURL + "/stellar/projects/search?q=" + q + "&filter=" + filter);
  console.log(res.data.projects);
  if (res.data.error) {
    return {
      props: {
        projects: []
      }
    }
  }
  return {
    props: {
      projects: res.data.projects as Project[]
    }
  }
}

export default SearchPage;
