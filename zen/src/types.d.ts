export type Project = {
  _id?: string;
  title: string;
  tagline: string;
  img: string;
  description: string;
  github_url: string;
  hosted_url: string;
  tech: string[];
  downvotes?: number;
  upvotes?: number;
  slug?: string;
  username?: string;
  user_id?: string;
};

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  img: string
  headline: string;
  description: string;
  githubId?: string;
  website?: string;
};

export type Post = {
  _id?: string;
  title: string;
  slug: string;
  body: string;
  project_id: string;
  userId?: number;
  username?: string;
  created_at?: string;
  updated_at?: string;
}

