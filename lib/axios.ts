import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isLoginRequest = err.config?.url?.includes("/auth/login");
    if (
      err.response?.status === 401 &&
      typeof window !== "undefined" &&
      !isLoginRequest
    ) {
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);
export default api;
