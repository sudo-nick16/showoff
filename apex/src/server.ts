import express from "express";
import { constants } from "./constants";
import passport from "passport";
import cors from "cors";
import slugify from "slugify";
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
import { authMiddleware } from "./middleware";

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
          username: slugify(profile._json.email!),
          name: profile._json.name!,
          email: profile._json.email!,
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
  app.use(cors({
    origin: ["http://localhost:3000", constants.ClientURL],
    credentials: true,
  }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(passport.initialize());

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
        user_id: user.id,
        username: user.username,
        tokenVersion: user.tokenVersion,
      };
      const refreshToken = createRefreshToken(tokenPayload);
      res.cookie("sid", refreshToken, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.redirect(constants.ClientURL + "/" + user.username);
    }
  );

  app.post("/auth/refresh-token", async (req, res) => {
    const refreshToken = req.cookies.sid;
    if (!refreshToken) {
      res.send({ error: "no refresh token provided", accessToken: "" });
      return;
    }
    try {
      const tp = verifyRefreshToken(refreshToken);
      if (!tp) {
        res.send({ error: "invalid refresh token", accessToken: "" });
        return;
      }
      const user = await userRepo.getUserById(tp.user_id);
      if (!user) {
        res.send({ error: "user not found", accessToken: "" });
        return;
      }
      if (user!.tokenVersion !== tp.tokenVersion) {
        res.send({ error: "invalid refresh token", accessToken: "" });
        return;
      }
      const accessToken = createAccessToken({
        user_id: user!.id,
        username: user!.username,
        tokenVersion: user!.tokenVersion,
      });
      res.send({ error: "", accessToken });
      return;
    } catch (e) {
      res.send({ error: e.message, accessToken: "" });
    }
  });

  app.get("/users/me", authMiddleware, async (req, res) => {
    const id = (req.user! as TokenPayload).user_id;
    const user = await userRepo.getUserById(id);
    if (!user) {
      res.status(400).json({ error: "could get your profile." });
      return;
    }
    res.json(user);
  });

  app.get("/users/:user_id", async (req, res) => {
    const userId = req.params.user_id;
    const user = await userRepo.getUserById(parseInt(userId));
    if (!user) {
      res.status(400).json({ error: "user not found." });
      return;
    }
    res.json(user);
  });

  app.post("/users", authMiddleware, async (req, res) => {
    const { username, name } = req.body;
    const id = (req.user! as User).id;
    const user = await userRepo.updateUser(id, {
      username,
      name,
    });
    if (!user) {
      res.status(400).json({ error: "couldn't update user" });
      return;
    }
    res.json(user);
  });

  app.post("/auth/logout", async (_, res) => {
    res.clearCookie("sid");
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
