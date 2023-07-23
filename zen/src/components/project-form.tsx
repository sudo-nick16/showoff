import { NextPage } from "next";
import { useSelector } from "react-redux";
import {
  ProjectFormMode,
  RootState,
  setDescription,
  setGithubUrl,
  setHostedUrl,
  setImg,
  setTagline,
  setTech,
  setTitle,
  useAppDispatch,
} from "@/store/store";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GitHubLogoIcon, GlobeIcon } from "@radix-ui/react-icons";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import useAxios from "@/hooks/useAxios";

type ProjectFormWrapperProps = {
  children?: React.ReactNode;
  callback?: (data: any) => void;
};

const ProjectForm = ({ callback }: { callback?: <T>(data: T) => void }) => {
  const appDispatch = useAppDispatch();
  const projectForm = useSelector<RootState, RootState["projectForm"]>(
    (store) => store.projectForm
  );
  const userState = useSelector<RootState, RootState["auth"]>(
    (store) => store.auth
  );
  const api = useAxios();

  const submitHandler = async () => {
    const projectData = {
      _id: projectForm._id,
      title: projectForm.title,
      img: projectForm.img,
      tagline: projectForm.tagline,
      description: projectForm.description,
      github_url: projectForm.github_url,
      hosted_url: projectForm.hosted_url,
      tech: JSON.stringify(projectForm.tech),
    };
    let res;
    if (projectForm.mode === ProjectFormMode.CreateMode) {
      res = await api.post("/stellar/projects", projectData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (!res?.data.error) {
        res = await api.get(`/stellar/users/${userState.user?.username}/projects`)
      }
    } else if (projectForm.mode === ProjectFormMode.EditMode) {
      res = await api.put(`/stellar/projects/${projectForm._id}`, projectData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }
    if (!res?.data.error) {
      // const res = await api.get(`/stellar/users/${userState.user?.username}/projects`);
      // console.log(res.data);
      // if (!res.data.error) {
      callback && callback(res?.data);
      // }
    }
  };

  return (
    projectForm.show && (
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {projectForm.mode === ProjectFormMode.CreateMode
              ? "Create Project"
              : "Edit Project"}
          </DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              onChange={(e) => appDispatch(setTitle(e.target.value))}
              value={projectForm.title}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tagline" className="text-right">
              Tagline
            </Label>
            <Input
              id="tagline"
              onChange={(e) => appDispatch(setTagline(e.target.value))}
              value={projectForm.tagline}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="desc" className="text-right">
              Description
            </Label>
            <Textarea
              id="desc"
              onChange={(e) => appDispatch(setDescription(e.target.value))}
              value={projectForm.description}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="img" className="text-right">
              Image
            </Label>
            <Input
              id="img"
              onChange={(e) => appDispatch(setImg(e.target.value))}
              value={projectForm.img}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="github_url" className="text-right">
              <GitHubLogoIcon className="ml-auto w-6 h-6" />
            </Label>
            <Input
              id="github_url"
              onChange={(e) => appDispatch(setGithubUrl(e.target.value))}
              value={projectForm.github_url}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hosted_url" className="text-right">
              <GlobeIcon className="ml-auto w-6 h-6" />
            </Label>
            <Input
              id="hosted_url"
              onChange={(e) => appDispatch(setHostedUrl(e.target.value))}
              value={projectForm.hosted_url}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tech" className="text-right">
              Technologies
            </Label>
            <Input
              id="technologies"
              onChange={(e) => appDispatch(setTech(e.target.value.split(",")))}
              value={projectForm.tech.join(",")}
              className="col-span-3"
            />
          </div>
          {!!projectForm.tech.length && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div></div>
              <div className="col-span-3 flex flex-wrap gap-2">
                {projectForm.tech.map((tech, i) => (
                  <Badge key={i}>{tech}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={submitHandler}>
            {projectForm.mode === ProjectFormMode.CreateMode
              ? "Add Project"
              : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    )
  );
};

const ProjectFormWrapper: NextPage<ProjectFormWrapperProps> = ({
  children,
  callback,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <ProjectForm callback={callback} />
    </Dialog>
  );
};

export default ProjectFormWrapper;
