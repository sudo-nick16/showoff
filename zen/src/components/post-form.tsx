import { NextPage } from "next";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useSelector } from "react-redux";
import {
  PostMode,
  RootState,
  setPostBody,
  setPostTitle,
  useAppDispatch,
} from "@/store/store";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import useAxios from "@/hooks/useAxios";
import { Post } from "@/types";
import { MdEditor } from "md-editor-rt";

type PostFormWrapperProps = {
  children: React.ReactNode;
  callback?: (post: any) => void;
};
const PostForm = ({ callback }: { callback?: (post: Post) => void }) => {
  const appDispatch = useAppDispatch();
  const api = useAxios();
  const postForm = useSelector<RootState, RootState["postForm"]>(
    (store) => store.postForm
  );

  const handleSubmit = async () => {
    const data = {
      title: postForm.title,
      body: postForm.body,
    };
    var res;
    if (postForm.mode === PostMode.EditMode) {
      res = await api.put(
        `/stellar/projects/${postForm.project_id}/posts/${postForm._id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } else if (postForm.mode === PostMode.CreateMode) {
      res = await api.post(
        `/stellar/projects/${postForm.project_id}/posts`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (!res?.data.error) {
        res = await api.get(`/stellar/projects/${postForm.project_id}/posts`)
      }
    }
    if (!res?.data.error) {
      callback && callback(res?.data);
    }
  };

  return (
    postForm.show && (
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {postForm.mode === PostMode.CreateMode
              ? "Create Post"
              : "Edit Post"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-6 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              onChange={(e) => appDispatch(setPostTitle(e.target.value))}
              value={postForm.title}
              className="col-span-5"
            />
          </div>
          <div className="grid grid-cols-6 items-center gap-4">
            <Label htmlFor="body" className="text-right">
              Body
            </Label>
            <MdEditor
              footers={[]}
              theme="dark"
              codeTheme="github"
              scrollAuto
              className="col-span-5 !bg-transparent !h-40 overflow-hidden"
              tableShape={[10, 100]}
              preview={false}
              toolbars={[]}
              editorId="post"
              modelValue={postForm.body}
              onChange={(e) => {
                console.log("edit", e);
                appDispatch(setPostBody(e));
              }}
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

const PostFormWrapper: NextPage<PostFormWrapperProps> = ({
  children,
  callback,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <PostForm callback={callback} />
    </Dialog>
  );
};

export default PostFormWrapper;
