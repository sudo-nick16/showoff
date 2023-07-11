import { NextPage } from "next";
import React, { useEffect } from "react";
import Navbar from "./navbar";
import { ThemeProvider } from "./theme-provider";
import axios from "axios";
import constants from "@/constants";
import { logout, setAccessToken, setUser, useAppDispatch } from "@/store/store";
import useAxios from "@/hooks/useAxios";

type Props = {
  children: React.ReactNode;
};

const Layout: NextPage<Props> = ({ children }) => {
  const appDispatch = useAppDispatch();
  const api = useAxios();

  useEffect(() => {
    const fetchMe = async () => {
      const res = await api.get("/users/me");
      console.log("fetch me", res.data);
      if (!res.data?.error) {
        appDispatch(setUser(res.data));
      }
    };

    const fetchRefreshToken = async () => {
      try {
        const response = await axios.post(
          `${constants.ServerURL}/auth/refresh-token`,
          {},
          {
            withCredentials: true,
          }
        );
        console.log("refresh token response", response.data);
        if (!response.data?.error && response.data?.accessToken) {
          appDispatch(setAccessToken(response.data.accessToken));
          return response.data.accessToken;
        }
      } catch (err) {
        console.log(err);
      }
      appDispatch(logout());
      return "";
    };

    const initState = async () => {
      const token = await fetchRefreshToken();
      if (!token) {
        return;
      }
      await fetchMe();
    }
    initState();
  }, []);
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <Navbar />
      {children}
    </ThemeProvider>
  );
};

export default Layout;
