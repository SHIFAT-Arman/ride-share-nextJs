import type { AxiosRequestConfig } from "axios";
import api from "../lib/axios";

export type UserRole = "admin" | "rider" | "driver";

export interface SessionUser {
  sub: string;
  email: string;
  role: UserRole;
  availableRoles: UserRole[];
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

export type ApplyAsDriverRequest = {
  firstName: string;
  lastName: string;
  phone: string;
  vehicleType: "CAR" | "BIKE" | "CAR_XL";
  licensePlate: string;
  seatingCapacity: number;
};

/** Shared auth helpers used by every portal role. */
export const authApi = {
  login: (data: LoginRequest) => api.post<LoginResponse>("/auth/login", data),

  logout: () => api.post("/auth/logout"),

  /** Rotate cookies using rs_refresh (called by axios on 401). */
  refresh: () => api.post<{ message: string }>("/auth/refresh"),

  /** Returns the signed-in user from the JWT (sub, email, role). */
  me: (config?: AxiosRequestConfig) =>
    api.get<SessionUser>("/auth/me", config),

  /** Rider → driver upgrade (same account + vehicle); re-issues cookies. */
  applyAsDriver: (data: ApplyAsDriverRequest) =>
    api.post<LoginResponse>("/auth/register/driver", data),

  /** Flip active dashboard mode; re-issues cookies. */
  switchRole: (role: "rider" | "driver") =>
    api.post<LoginResponse>("/auth/switch-role", { role }),
};

/** Map a role to its portal dashboard path. */
export { dashboardPathForRole } from "../lib/marketing-nav";

/** Map a role to its self-profile path. */
export const profilePathForRole = (role: string): string => {
  if (role === "admin") return "/portal/admin/profile";
  if (role === "rider") return "/portal/rider/profile";
  if (role === "driver") return "/portal/driver/profile";
  return "/login";
};
