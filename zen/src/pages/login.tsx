import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import constants from "@/constants";
import React from "react";

const Login = () => {
  const handleLogin = () => {
    window.location.assign(constants.ServerURL + "/auth/google");
  };
  return (
    <Container className="my-10 h-[calc(100dvh-12rem)] flex items-center justify-center">
      <Card className="">
        <CardHeader>
          <CardTitle>Log in to Showoff</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleLogin} variant="secondary" className="w-full">
            Continue with google
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
