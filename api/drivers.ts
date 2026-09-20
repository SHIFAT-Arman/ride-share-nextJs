import type { AxiosRequestConfig } from "axios";
import api from "../lib/axios";
import type { PaginationResponse } from "@/types/pagination";

export type DriverStatus = "ACTIVE" | "INACTIVE" | "PENDING_VERIFICATION";

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  status: DriverStatus;
  email?: string;
  profilePictureUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface FindDriverParams {
  limit?: number;
  offset?: number;
  id?: string;
  status?: DriverStatus;
  firstName?: string;
  lastName?: string;
}

export interface CreateDriverDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

export interface UpdateDriverDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export interface UpdateDriverStatusDto {
  status: DriverStatus;
}

export interface DriverRating {
  id: string;
  score: number;
  comment: string | null;
  createdAt: string;
}

export const driverApi = {
  getAll: (
    filter: Partial<FindDriverParams> = {},
    config?: AxiosRequestConfig,
  ) =>
    api.get<PaginationResponse<Driver>>("/drivers/driver-list", {
      params: filter,
      ...config,
    }),

  getById: (id: string, config?: AxiosRequestConfig) =>
    api.get<Driver>(`/drivers/${id}`, config),

  create: (data: CreateDriverDto) => api.post<Driver>("/drivers", data),

  update: (id: string, data: UpdateDriverDto) =>
    api.patch<Driver>(`/drivers/${id}`, data),

  updateStatus: (id: string, data: UpdateDriverStatusDto) =>
    api.patch<Driver>(`/drivers/${id}/status`, data),

  delete: (id: string) => api.delete(`/drivers/${id}`),

  uploadProfilePicture: (id: string, formData: FormData) =>
    api.put<{ profilePictureUrl: string }>(
      `/drivers/${id}/profile-picture`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    ),

  getRatings: (config?: AxiosRequestConfig) =>
    api.get<DriverRating[] | null>("/drivers/ratings", config),
};
