export type Project = {
  id?: string;
  title: string;
  img: string;
  description: string;
  github_url: string;
  hosted_url: string;
  tech: string[];
  downvotes?: number;
  upvotes?: number;
  slug?: string;
  username?: string;
};

export type User = {
  id: number;
  name: string;
  username: string;
  headline: string;
  description: string;
  description: string;
  email: string;
  img: string
};
