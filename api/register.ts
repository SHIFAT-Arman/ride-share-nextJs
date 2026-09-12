import api from "@/lib/axios";
import { CreateRequest } from "./admins";
import { Rider } from "./riders";

export const registerApi = {
  register: (data: CreateRequest) => api.post<Rider>("/auth/register/", data),
};
