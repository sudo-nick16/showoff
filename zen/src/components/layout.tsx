import { NextPage } from "next";
import React from "react";
import Navbar from "./navbar";
import { ThemeProvider } from "./theme-provider";

type Props = {
  children: React.ReactNode;
};

const Layout: NextPage<Props> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <Navbar />
      {children}
    </ThemeProvider>
  );
};

export default Layout;
