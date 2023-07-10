import { NextPage } from "next";
import React from "react";

type Props = {
    children: React.ReactNode;
    className?: string;
};
const Container: NextPage<Props> = ({ children, className = "" }) => {
    return (
        <div className={`max-w-[1440px] mx-auto px-10 ${className}`}>{children}</div>
    );
};

export default Container;
