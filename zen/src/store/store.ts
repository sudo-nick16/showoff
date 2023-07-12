import { Project, User } from "@/types";
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
    title: "",
    description: "",
    img: "",
    github_url: "",
    hosted_url: "",
    tech: [] as string[],
    techstr: "",
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
    setHostedUrl: (state, action: PayloadAction<string>) => {
      state.hosted_url = action.payload;
    },
    setTech: (state, action: PayloadAction<string>) => {
      state.techstr = action.payload;
      state.tech = action.payload.split(",");
    },
    setCreateMode: (state, _) => {
      state.mode = ProjectFormMode.CreateMode;
      state.title = "";
      state.description = "";
      state.img = "";
      state.github_url = "";
      state.hosted_url = "";
      state.tech = [];
      state.techstr = "";
      state.show = true;
    },
    setEditMode: (state, action: PayloadAction<Project>) => {
      state.mode = ProjectFormMode.EditMode;
      state.title = action.payload.title;
      state.description = action.payload.description;
      state.img = action.payload.img;
      state.github_url = action.payload.github_url;
      state.hosted_url = action.payload.hosted_url;
      state.tech = action.payload.tech;
      state.techstr = action.payload.tech.join(",");
      state.show = true;
    },
    clearForm: (state, _) => {
      state.title = "";
      state.description = "";
      state.img = "";
      state.github_url = "";
      state.hosted_url = "";
      state.tech = [];
      state.techstr = "";
      state.show = false;
    },
  },
});

export const {
  setTitle,
  setDescription,
  setImg,
  setGithubUrl,
  setHostedUrl,
  setTech,
  setCreateMode,
  setEditMode,
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
  },
  reducers: {
    setUserUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
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
      }>
    ) => {
      state.username = action.payload.username;
      state.name = action.payload.name;
      state.headline = action.payload.headline;
      state.description = action.payload.description;
      state.show = true;
    },
    hideUserForm: (state, _) => {
      state.username = "";
      state.name = "";
      state.headline = "";
      state.description = "";
      state.show = false;
    },
  },
});

export const {
  setUserUsername,
  setUserHeadline,
  setUserName,
  showUserForm,
  hideUserForm,
  setUserDescription,
} = userForm.actions;

const authState = createSlice({
  name: "auth",
  initialState: {
    accessToken: "",
    user: undefined as User | undefined,
  },
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setUser: (state, action: PayloadAction<User | undefined>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.accessToken = "";
      state.user = undefined;
    },
  },
});

export const { setAccessToken, setUser, logout } = authState.actions;

export const Store = configureStore({
  reducer: {
    auth: authState.reducer,
    projectForm: projectForm.reducer,
    userForm: userForm.reducer,
  },
});

export default Store;
export type RootState = ReturnType<typeof Store.getState>;

export type AppDispatch = typeof Store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
