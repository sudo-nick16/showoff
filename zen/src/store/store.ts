import { User } from "@/types";
import { PayloadAction, configureStore, createSlice } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

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
  },
});

export default Store;
export type RootState = ReturnType<typeof Store.getState>;

export type AppDispatch = typeof Store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
