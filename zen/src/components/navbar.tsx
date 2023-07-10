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

type Props = {};
const Navbar: NextPage<Props> = ({}) => {
  const router = useRouter();
  const path = router.pathname;
  return (
    <div className="border-b">
      <Container className="py-4 flex justify-end gap-x-4">
        <Input className="w-96" placeholder="Search" />
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
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Projects</DropdownMenuItem>
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Container>
    </div>
  );
};

export default Navbar;
