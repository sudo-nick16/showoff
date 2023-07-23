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
  const router = useRouter();
  const appDispatch = useAppDispatch();
  const path = router.pathname;
  const api = useAxios();

  const logoutHandler = async () => {
    const res = await api.post("/apex/auth/logout", {});
    if (!res.data.error) {
      router.push("/login");
      appDispatch(logout());
    }
  };

  return (
    <div className="border-b backdrop-blur sticky top-0 z-[10]">
      <Container className="py-4 px-3 flex justify-between items-center gap-x-4">
        <div className="relative hidden sm:block w-[120px] min-w-[120px] h-[40px] min-h-[40px]">
          <Image
            src={"/showoff.svg"}
            layout="fill"
            alt="Showoff Logo"
          />
        </div>
        <div className="flex w-full sm:w-auto gap-x-4">
          <Input className="sm:w-96" placeholder="Search" />
          {authState.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="relative h-10 w-10">
                  <Image
                    src={authState.user.img}
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
                <DropdownMenuItem onClick={logoutHandler}>
                  Sign out
                </DropdownMenuItem>
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
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
