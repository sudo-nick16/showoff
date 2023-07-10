import dotenv from "dotenv";
import { base64ToPrivateKey, base64ToPublicKey } from "./utils";
dotenv.config();

export const constants = {
  Port: process.env.PORT || 6969,
  PostgresURI: process.env.POSTGRESURI || "",
  GoogleClientID: process.env.GOOGLE_CLIENT_ID || "",
  GoogleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  ServerURL: process.env.SERVER_URL || "http://localhost:6969",
  ClientURL: process.env.CLIENT_URL || "http://localhost:3000",
  AccessPublicKey: base64ToPublicKey(process.env.ACCESS_PUBLIC_KEY!) || "",
  AccessPrivateKey: base64ToPrivateKey(process.env.ACCESS_PRIVATE_KEY!) || "",
  RefreshKey: process.env.REFRESH_KEY || "",
};
