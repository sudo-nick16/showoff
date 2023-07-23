import { NextPage } from "next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useSelector } from "react-redux";
import { RootState, setUserDescription, setUserGithubId, setUserHeadline, setUserName, setUserUsername, setUserWebsite, useAppDispatch } from "@/store/store";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import useAxios from "@/hooks/useAxios";
import { User } from "@/types";

type UserFormWrapperProps = {
  children: React.ReactNode;
  callback?: (user: User) => void;
};
const UserForm = ({ callback }: { callback?: (user: User) => void }) => {
  const appDispatch = useAppDispatch();
  const api = useAxios();
  const userForm = useSelector<RootState, RootState["userForm"]>(
    (store) => store.userForm
  );

  const handleSubmit = async () => {
    const data = {
      name: userForm.name,
      username: userForm.username,
      headline: userForm.headline,
      githubId: userForm.githubId,
      website: userForm.website,
      description: userForm.description,
    }
    const res = await api.put('/apex/users', data)
    if (!res.data.error) {
      callback && callback(res.data);
    }
  }

  return (
    userForm.show && (
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              onChange={(e) => appDispatch(setUserName(e.target.value))}
              value={userForm.name}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              onChange={(e) => appDispatch(setUserUsername(e.target.value))}
              value={userForm.username}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="headline" className="text-right">
              Headline
            </Label>
            <Input
              id="headline"
              onChange={(e) => appDispatch(setUserHeadline(e.target.value))}
              value={userForm.headline}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="desc" className="text-right">
              About
            </Label>
            <Textarea
              id="desc"
              onChange={(e) => appDispatch(setUserDescription(e.target.value))}
              value={userForm.description}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="githubId" className="text-right">
              Github Id
            </Label>
            <Input
              id="githubId"
              onChange={(e) => appDispatch(setUserGithubId(e.target.value))}
              value={userForm.githubId}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="website" className="text-right">
              Website
            </Label>
            <Input
              id="website"
              onChange={(e) => appDispatch(setUserWebsite(e.target.value))}
              value={userForm.website}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    )
  );
};

const UserFormWrapper: NextPage<UserFormWrapperProps> = ({ children, callback }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <UserForm callback={callback} />
    </Dialog>
  );
};

export default UserFormWrapper;
