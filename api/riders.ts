import type { AxiosRequestConfig } from "axios";
import api from "../lib/axios";
import type { PaginationResponse } from "@/types/pagination";

export type RiderStatus = "ACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION";

export interface Rider {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  age?: number;
  status: RiderStatus;
  email?: string;
  profilePictureUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface FindRiderParams {
  limit?: number;
  offset?: number;
  id?: string;
  status?: RiderStatus;
  firstName?: string;
  lastName?: string;
}

export interface CreateRiderDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  age?: number;
}

export interface UpdateRiderDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export interface UpdateRiderStatusDto {
  status: RiderStatus;
}

export const riderApi = {
  getAll: (
    filter: Partial<FindRiderParams> = {},
    config?: AxiosRequestConfig,
  ) =>
    api.get<PaginationResponse<Rider>>("/riders/rider-list", {
      params: filter,
      ...config,
    }),

  getById: (id: string, config?: AxiosRequestConfig) =>
    api.get<Rider>(`/riders/${id}`, config),

  create: (data: CreateRiderDto) => api.post<Rider>("/riders", data),

  update: (id: string, data: UpdateRiderDto) =>
    api.patch<Rider>(`/riders/${id}`, data),

  updateStatus: (id: string, data: UpdateRiderStatusDto) =>
    api.patch<Rider>(`/riders/${id}/status`, data),

  delete: (id: string) => api.delete(`/riders/${id}`),

  uploadProfilePicture: (id: string, formData: FormData) =>
    api.put<{ profilePictureUrl: string }>(
      `/riders/${id}/profile-picture`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    ),
};
