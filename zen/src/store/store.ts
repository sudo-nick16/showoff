import { Post, Project, User } from "@/types";
import { PayloadAction, configureStore, createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

export enum ProjectFormMode {
  CreateMode,
  EditMode,
}

const projectForm = createSlice({
  name: "projectForm",
  initialState: {
    show: true,
    mode: ProjectFormMode.CreateMode,
    _id: "",
    title: "",
    tagline: "",
    description: "",
    img: "",
    github_url: "",
    hosted_url: "",
    tech: [] as string[],
  },
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setImg: (state, action: PayloadAction<string>) => {
      state.img = action.payload;
    },
    setGithubUrl: (state, action: PayloadAction<string>) => {
      state.github_url = action.payload;
    },
    setTagline: (state, action: PayloadAction<string>) => {
      state.tagline = action.payload;
    },
    setHostedUrl: (state, action: PayloadAction<string>) => {
      state.hosted_url = action.payload;
    },
    setTech: (state, action: PayloadAction<string[]>) => {
      state.tech = action.payload
    },
    createNewProject: (state) => {
      state.mode = ProjectFormMode.CreateMode;
      state.title = "";
      state.tagline = "";
      state.description = "";
      state.img = "";
      state.github_url = "";
      state.hosted_url = "";
      state.tech = [];
      state.show = true;
    },
    editProject: (state, action: PayloadAction<Project>) => {
      state.mode = ProjectFormMode.EditMode;
      state._id = action.payload._id!;
      state.title = action.payload.title;
      state.tagline = action.payload.tagline;
      state.description = action.payload.description;
      state.img = action.payload.img;
      state.github_url = action.payload.github_url;
      state.hosted_url = action.payload.hosted_url;
      state.tech = action.payload.tech;
      state.show = true;
    },
    clearForm: (state) => {
      state.title = "";
      state.tagline = "";
      state.description = "";
      state.img = "";
      state.github_url = "";
      state.hosted_url = "";
      state.tech = [];
      state.show = false;
    },
  },
});

export const {
  setTitle,
  setDescription,
  setImg,
  setGithubUrl,
  setTagline,
  setHostedUrl,
  setTech,
  createNewProject,
  editProject,
  clearForm,
} = projectForm.actions;

const userForm = createSlice({
  name: "userForm",
  initialState: {
    show: false,
    username: "",
    name: "",
    headline: "",
    description: "",
    website: "",
    githubId: "",
  },
  reducers: {
    setUserUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setUserGithubId: (state, action: PayloadAction<string>) => {
      state.githubId = action.payload;
    },
    setUserWebsite: (state, action: PayloadAction<string>) => {
      state.website = action.payload;
    },
    setUserDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setUserHeadline: (state, action: PayloadAction<string>) => {
      state.headline = action.payload;
    },
    showUserForm: (
      state,
      action: PayloadAction<{
        username: string;
        name: string;
        description: string;
        headline: string;
        githubId: string;
        website: string;
      }>
    ) => {
      state.username = action.payload.username;
      state.name = action.payload.name;
      state.headline = action.payload.headline;
      state.description = action.payload.description;
      state.website = action.payload.website;
      state.githubId = action.payload.githubId;
      state.show = true;
    },
    hideUserForm: (state, _) => {
      state.username = "";
      state.name = "";
      state.headline = "";
      state.description = "";
      state.website = "";
      state.githubId = "";
      state.show = false;
    },
  },
});

export const {
  setUserUsername,
  setUserHeadline,
  setUserName,
  setUserWebsite,
  setUserGithubId,
  showUserForm,
  hideUserForm,
  setUserDescription,
} = userForm.actions;


export enum PostMode {
  CreateMode,
  EditMode,
}

const postForm = createSlice({
  name: "postForm",
  initialState: {
    show: false,
    mode: PostMode.CreateMode,
    _id: "",
    title: "",
    body: "",
    project_id: "",
  },
  reducers: {
    setPostTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setPostBody: (state, action: PayloadAction<string>) => {
      state.body = action.payload;
    },
    createPost: (state, action: PayloadAction<string>) => {
      state.show = true;
      state.mode = PostMode.CreateMode;
      state._id = "";
      state.title = "";
      state.body = "";
      state.project_id = action.payload;
    },
    editPost: (state, action: PayloadAction<Post>) => {
      state.show = true;
      state.mode = PostMode.EditMode;
      state._id = action.payload._id!;
      state.title = action.payload.title;
      state.body = action.payload.body;
      state.project_id = action.payload.project_id;
    },
    hidePostForm: (state) => {
      state.show = false;
      state.mode = PostMode.CreateMode;
      state._id = "";
      state.title = "";
      state.body = "";
      state.project_id = "";
    }
  }
})

export const {
  setPostTitle,
  setPostBody,
  createPost,
  editPost,
  hidePostForm
} = postForm.actions


const authState = createSlice({
  name: "user",
  initialState: {
    accessToken: "",
    user: undefined as User | undefined,
  },
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setUserState: (state, action: PayloadAction<User | undefined>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.accessToken = "";
      state.user = undefined;
    },
  },
});

export const { setAccessToken, setUserState, logout } = authState.actions;

export const Store = configureStore({
  reducer: {
    auth: authState.reducer,
    projectForm: projectForm.reducer,
    userForm: userForm.reducer,
    postForm: postForm.reducer
  },
});

export default Store;
export type RootState = ReturnType<typeof Store.getState>;

export type AppDispatch = typeof Store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
