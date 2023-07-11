import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "./utils";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"] as string;
  console.log({authHeader});
  if (!authHeader) {
    return res.status(401).json({ error: "auth header missing" });
  }
  const tokenArr = authHeader.split(" ");
  console.log({tokenArr});
  if (tokenArr.length !== 2) {
    return res.status(401).json({ error: "invalid auth header" });
  }
  try {
    const payload = verifyAccessToken(tokenArr[1]);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "invalid auth token" });
  }
};
