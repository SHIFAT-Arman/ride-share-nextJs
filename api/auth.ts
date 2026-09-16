import type { AxiosRequestConfig } from "axios";
import api from "../lib/axios";

export type UserRole = "admin" | "rider" | "driver";

export interface SessionUser {
  sub: string;
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  role: UserRole;
  sub: string;
  email: string;
}

/** Shared auth helpers used by every portal role. */
export const authApi = {
  login: (data: LoginRequest) => api.post<LoginResponse>("/auth/login", data),

  logout: () => api.post("/auth/logout"),

  /** Rotate cookies using rs_refresh (called by axios on 401). */
  refresh: () => api.post<{ message: string }>("/auth/refresh"),

  /** Returns the signed-in user from the JWT (sub, email, role). */
  me: (config?: AxiosRequestConfig) =>
    api.get<SessionUser>("/auth/me", config),
};

/** Map a role to its portal dashboard path. */
export const dashboardPathForRole = (role: string): string => {
  if (role === "admin") return "/portal/admin/dashboard";
  if (role === "rider") return "/portal/rider/dashboard";
  if (role === "driver") return "/portal/driver/dashboard";
  return "/login";
};

/** Map a role to its self-profile path. */
export const profilePathForRole = (role: string): string => {
  if (role === "admin") return "/portal/admin/profile";
  if (role === "rider") return "/portal/rider/profile";
  if (role === "driver") return "/portal/driver/profile";
  return "/login";
};
