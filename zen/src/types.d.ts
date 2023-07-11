export type Project = {
  name: string;
  slug: string;
  description: string;
  url: string;
  github: string;
  image: string;
  tech: string[];
};

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  img: string
};
