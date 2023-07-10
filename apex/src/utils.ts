import { constants } from "./constants";
import { TokenPayload } from "./types";
import jwt, { Algorithm } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const base64ToPrivateKey = (base64Str: string): crypto.KeyObject => {
  const buffer = Buffer.from(base64Str, "base64");
  const keyObj = crypto.createPrivateKey({
    key: buffer.toString(),
    format: "pem",
    type: "pkcs8",
  })
  return keyObj;
}

export const base64ToPublicKey = (base64Str: string): crypto.KeyObject => {
  const buffer = Buffer.from(base64Str, "base64");
  const keyObj = crypto.createPublicKey({
    key: buffer.toString(),
    format: "pem",
    type: "pkcs1"
  })
  return keyObj;
}

export const createAccessToken = (payload: TokenPayload) => {
    const token = jwt.sign(payload, constants.AccessPrivateKey, {
        expiresIn: "15m",
        algorithm: "RS256",
    });
    return token;
};

export const verifyAccessToken = (token: string): TokenPayload => {
    const payload = jwt.verify(token, constants.AccessPublicKey, {
        algorithms: ["RS256"] as Algorithm[],
    });
    return payload as TokenPayload;
};

export const createRefreshToken = (payload: TokenPayload) => {
    const token = jwt.sign(payload, constants.RefreshKey, {
        expiresIn: "7d",
        algorithm: "HS256",
    });
    return token;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
    const payload = jwt.verify(token, constants.RefreshKey, {
        algorithms: ["HS256"] as Algorithm[],
    });
    return payload as TokenPayload;
};

export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

export const comparePassword = async (password: string, hash: string) => {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
};

