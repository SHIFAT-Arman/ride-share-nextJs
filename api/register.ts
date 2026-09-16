import api from "@/lib/axios";
import { Rider } from "./riders";

export type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  age: number;
};

export const registerApi = {
  register: (data: RegisterRequest) =>
    api.post<Rider>("/auth/register/", data),
};
