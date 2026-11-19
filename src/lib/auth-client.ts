import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";
import { AUTH_BASE_URL } from "./api";

export const authClient = createAuthClient({
  baseURL: AUTH_BASE_URL,
  plugins: [jwtClient()],
});

export type AuthSession = typeof authClient.$Infer.Session;
