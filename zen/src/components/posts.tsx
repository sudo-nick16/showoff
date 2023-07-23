import { Post } from "@/types";
import { NextPage } from "next";
import { GlassContainer } from "./container";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils";
import { ChevronDownIcon, ChevronUpIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { editPost, useAppDispatch } from "@/store/store";
import PostFormWrapper from "./post-form";
import useAxios from "@/hooks/useAxios";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";

type Props = {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  callback: (data: any) => void;
  className?: string;
};

type CardProps = {
  post: Post;
  callback: (data: any) => void;
  onDelete: (pid: string) => void;
};

export const PostCard: React.FC<CardProps> = ({ post, callback, onDelete }) => {
  const [seeMore, setSeeMore] = useState(false);
  const appDispatch = useAppDispatch();
  const [mdxSource, setMdxSource] = useState<any | undefined>(undefined);
  const [serialized, setSerialized] = useState(false);

  useEffect(() => {
    const mdx = async () => {
      const mdxSrc = await serialize(post.body, {
        mdxOptions: {
          development: true,
        }
      });
      setMdxSource(mdxSrc);
      setSerialized(true);
    }
    mdx();
  }, [])

  return (
    <GlassContainer className="relative w-full">
      <span className="flex items-center gap-1 absolute top-2 right-3 cursor-pointer" onClick={() => setSeeMore(s => !s)}>
        <PostFormWrapper callback={callback}>
          <Pencil1Icon width={15} height={15} className="opacity-50" onClick={() => appDispatch(editPost(post))} />
        </PostFormWrapper>
        <TrashIcon onClick={() => onDelete(post._id!)} width={15} height={15} className="opacity-50" />
        {seeMore ?
          <ChevronUpIcon width={20} height={20} className="opacity-50" /> : <ChevronDownIcon width={20} height={20} className="opacity-50" />
        }
      </span>
      <h2 className="font-bold text-xl">{post.title}</h2>
      <p className="text-xs text-muted-foreground mb-3">- {formatDate(post.updated_at!)}</p>
      <span className={`${seeMore ? "" : "line-clamp-3"}`}>
        {
          serialized &&
          <MDXRemote {...mdxSource} />
        }
      </span>
    </GlassContainer>
  );
};

const Posts: NextPage<Props> = ({ posts, callback, className, setPosts }) => {
  const api = useAxios();
  console.log(posts)
  return (
    <div className={`flex flex-col w-full gap-4 ${className}`}>
      {posts.map((post, i) => {
        return <PostCard onDelete={async () => {
          const res = await api.delete(`/stellar/posts/${post._id}`);
          if (!res?.data.error) {
            setPosts(ps => ps.filter((p) => p._id !== post._id))
          }
        }} callback={callback} key={i} post={post} />;
      })}
    </div>
  );
};

export default Posts;
