import { NextPage } from "next";
import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  xl?: boolean;
  lg?: boolean;
  md?: boolean;
};
const Container: NextPage<Props> = ({
  children,
  className = "",
  md,
  lg = true,
  xl,
}) => {
  return (
    <div
      className={`mx-auto px-10 ${className} ${!!md && "max-w-[800px]"} ${
        !!lg && "max-w-[1280px]"
      } ${!!xl && "max-w-[1440px]"}`}
    >
      {children}
    </div>
  );
};

export const GlassContainer: NextPage<Props> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <Container
      className={`
        border border-l-muted border-t-muted border-b-transparent border-r-transparent overflow-hidden
        after:content-[""] after:absolute after:top-0 after:left-0 after:bg-muted after:w-full after:h-2 after:rounded-full after:blur-md
        before:content-[""] before:absolute before:top-0 before:left-0 before:bg-muted before:w-2 before:h-full before:rounded-full before:blur-md
        backdrop-blur-2xl bg-[#1F29371E] relative rounded-2xl ${className} px-4 py-4`}
      {...rest}
    >
      {children}
    </Container>
  );
};

export default Container;
