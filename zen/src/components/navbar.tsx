import { NextPage } from "next";
import React from "react";
import { Input } from "./ui/input";
import Container from "./container";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch, logout } from "@/store/store";
import useAxios from "@/hooks/useAxios";

type Props = {};
const Navbar: NextPage<Props> = ({ }) => {
  const authState = useSelector<RootState, RootState["auth"]>(
    (state) => state.auth
  );
  console.log({ authState });
  const router = useRouter();
  const appDispatch = useAppDispatch();
  const path = router.pathname;
  const api = useAxios();

  const logoutHandler = async () => {
    const res = await api.post("/auth/logout", {}, {});
    if (!res.data.error) {
      router.push("/login");
      appDispatch(logout())
    }
  }

  return (
    <div className="border-b">
      <Container className="py-4 flex justify-end gap-x-4">
        <Input className="w-96" placeholder="Search" />
        {authState.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="relative h-10 w-10">
                <Image
                  src="https://avatars.githubusercontent.com/u/73229823?v=4"
                  layout="fill"
                  alt=""
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href={`/${authState.user.username}`}>
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>
              <Link href={`/my-projects`}>
                <DropdownMenuItem>Projects</DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={logoutHandler}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            {path === "/login" ? null : (
              <Link href={"/login"}>
                <Button variant={"outline"}>Log in</Button>
              </Link>
            )}
            {path === "/signup" ? null : (
              <Link href={"/signup"}>
                <Button>Sign up</Button>
              </Link>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default Navbar;
