import express from "express";
import { constants } from "./constants";
import passport from "passport";
import PassportGoogle from "passport-google-oauth20";
import { PrismaClient, User } from "@prisma/client";
import { UserRepo } from "./userRepository";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "./utils";
import cookieParser from "cookie-parser";
import { TokenPayload } from "./types";

const GoogleStrategy = PassportGoogle.Strategy;
const prisma = new PrismaClient();
const userRepo = new UserRepo(prisma);

passport.use(
  new GoogleStrategy(
    {
      clientID: constants.GoogleClientID,
      clientSecret: constants.GoogleClientSecret,
      callbackURL: constants.ServerURL + "/auth/google/callback",
    },
    async (_, __, profile, cb) => {
      const u = await userRepo.getUserByEmail(profile._json.email!);
      if (!u) {
        const newUser = await userRepo.createUser({
          username: profile._json.email!,
          name: profile._json.name!,
          email: profile._json.email!,
          password: "",
          img: profile._json.picture!,
        });
        if (!newUser) {
          return cb("couldn't create user.", {});
        }
        return cb(null, newUser);
      }
      return cb(null, u);
    }
  )
);

const main = async () => {
  const app = express();
  app.use(passport.initialize());
  app.use(express.json());
  app.use(cookieParser());

  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/login",
      session: false,
      assignProperty: "user",
    }),
    (req, res) => {
      const user = req.user as User;
      const tokenPayload: TokenPayload = {
        id: user.id,
        username: user.username,
        email: user.email,
        tokenVersion: user.tokenVersion,
      };
      const refreshToken = createRefreshToken(tokenPayload);
      res.cookie("sid", refreshToken, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.redirect(constants.ClientURL + "/");
    }
  );

  app.post("/auth/refresh-token", async (req, res) => {
    const refreshToken = req.cookies.sid;
    if (!refreshToken) {
      res.send({ error: "no refresh token provided", accessToken: "" });
    }
    try {
      const tp = verifyRefreshToken(refreshToken);
      if (!tp) {
        res.send({ error: "invalid refresh token", accessToken: "" });
      }
      const user = await userRepo.getUserById(tp.id);
      if (!user) {
        res.send({ error: "user not found", accessToken: "" });
      }
      if (user!.tokenVersion !== tp.tokenVersion) {
        res.send({ error: "invalid refresh token", accessToken: "" });
      }
      const accessToken = createAccessToken({
        id: user!.id,
        username: user!.username,
        email: user!.email,
        tokenVersion: user!.tokenVersion,
      });
      res.send({ error: "", accessToken });
    } catch (e) {
      res.send({ error: e.message, accessToken: "" });
    }
  });

  app.listen(constants.Port, () => {
    console.log(`Server running on port ${constants.Port}`);
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
