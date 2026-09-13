import type { AxiosRequestConfig } from "axios";
import api from "../lib/axios";
import {
  Admin,
  AdminFilterParams,
  Announcement,
  AnnouncementListResponse,
} from "@/types/admin";
import type { PaginationResponse } from "@/types/pagination";

export type AdminListResponse = PaginationResponse<Admin>;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  country?: string;
  phoneNumber?: string;
  joiningDate?: string;
  profilePictureUrl?: string;
  age?: number;
  role?: string;
}

export interface LoginResponse {
  message: string;
}

export interface SessionUser {
  sub: string;
  email: string;
  role: string;
}

export interface UpdateAdminDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  country?: string;
  phoneNumber?: string;
  joiningDate?: string;
  profilePictureUrl?: string;
  age?: number;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export interface AnnouncementRequest {
  title: string;
  content: string;
  targetRoles: ("rider" | "driver" | "admin")[];
}

export interface SendEmailRequest {
  recipients: string[];
  subject: string;
  html: string;
  text?: string;
}

export interface EmailResponse {
  message: string;
}

export const adminApi = {
  me: () => api.get("/admin/get-admin-by-id"),

  create: (data: CreateRequest) =>
    api.post<Admin>("/auth/register/admin", data),

  update: (id: string, data: UpdateAdminDto) =>
    api.patch<Admin>(`/admin/update-admin/${id}`, data),

  changePassword: (id: string, data: ChangePasswordDto) =>
    api.patch(`/admin/change-password/${id}`, data),

  getAll: (
    filter: { limit?: number; offset?: number } = {},
    config?: AxiosRequestConfig,
  ) =>
    api.get<AdminListResponse>("/admin/admin-list", {
      params: filter,
      ...config,
    }),

  search: (
    filter: Partial<AdminFilterParams> = {},
    config?: AxiosRequestConfig,
  ) =>
    api.get<AdminListResponse>("/admin/admin-list", {
      params: filter,
      ...config,
    }),

  login: (data: LoginRequest) => api.post<LoginResponse>("/auth/login", data),

  logout: () => api.post("/auth/logout"),

  getById: (id: string, config?: AxiosRequestConfig) =>
    api.get<Admin>(`/admin/get-admin-by-id/${id}`, config),

  uploadProfilePicture: (id: string, formData: FormData) =>
    api.put(`/admin/${id}/profile-picture`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getProfilePicture: () =>
    api.get<Blob>(`/admin/profile-picture`, { responseType: "blob" }),

  getProfilePictureById: (id: string) =>
    api.get<Blob>(`/admin/${id}/profile-picture`, { responseType: "blob" }),

  deleteAdmin: (id: string) => api.delete(`/admin/delete-admin/${id}`),

  getAnnouncements: (
    filter: { limit?: number; offset?: number } = {},
    config?: AxiosRequestConfig,
  ) =>
    api.get<AnnouncementListResponse>("/admin/get-announcements", {
      params: filter,
      ...config,
    }),

  createAnnouncement: (data: AnnouncementRequest) =>
    api.post<Announcement>("/admin/create-announcement", data),

  deleteAnnouncement: (id: string) =>
    api.delete(`/admin/delete-announcement/${id}`),

  sendEmail: (data: SendEmailRequest) =>
    api.post<EmailResponse>("/admin/send-email", data),
};
