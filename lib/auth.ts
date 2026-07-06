export const AUTH_COOKIE = "foit_session";

export type LoginState = {
  status: "idle" | "error";
  message?: string;
};
