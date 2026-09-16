import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<unknown> | null = null;

function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = api.post("/auth/refresh").finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

async function clearSessionAndGoLogin() {
  try {
    await api.post("/auth/logout");
  } catch {
    // Best-effort revoke; still leave the auth pages.
  }
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const config = err.config as RetriableConfig | undefined;
    const url = String(config?.url ?? "");
    const isAuthForm =
      url.includes("/auth/login") ||
      url.includes("/auth/logout") ||
      url.includes("/auth/refresh");
    const onPublicPage =
      typeof window !== "undefined" &&
      (window.location.pathname === "/login" ||
        window.location.pathname === "/register");

    if (
      err.response?.status === 401 &&
      config &&
      !config._retry &&
      !isAuthForm &&
      typeof window !== "undefined" &&
      !onPublicPage
    ) {
      config._retry = true;
      try {
        await refreshSession();
        return api(config);
      } catch {
        await clearSessionAndGoLogin();
        return Promise.reject(err);
      }
    }

    if (
      err.response?.status === 401 &&
      typeof window !== "undefined" &&
      !isAuthForm &&
      !onPublicPage
    ) {
      await clearSessionAndGoLogin();
    }

    return Promise.reject(err);
  },
);

export default api;
