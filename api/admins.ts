import api from "../lib/axios";
import {
  Admin,
  AdminFilterParams,
  Announcement,
  AnnouncementListResponse,
} from "@/types/admin";

export interface AdminListResponse {
  data: Admin[];
  meta: {
    total: number;
    offset: number;
    limit: number;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  age: number;
}

export interface LoginResponse {
  access_token: string;
}

export interface UpdateAdminDto {
  country?: string;
  joiningDate?: string;
  role?: string;
}

export interface AnnouncementRequest {
  title: string;
  content: string;
}

export const adminApi = {
  getAll: (filter: Partial<AdminFilterParams> = {}) =>
    api.get<Admin[]>("/admin/admin-list", { params: filter }),

  login: (data: LoginRequest) => api.post<LoginResponse>("/auth/login", data),

  logout: () => api.post("/auth/logout"),

  register: (data: RegisterRequest) =>
    api.post<Admin>("/auth/register/admin", data),

  getById: (id: string) =>
    api.get<AdminListResponse>("/admin/admin-list", { params: { id } }),

  updateAdmin: (id: string, data: UpdateAdminDto) =>
    api.patch(`/admin/update-admin/${id}`, data),

  uploadProfilePicture: (id: string, formData: FormData) =>
    api.put(`/admin/${id}/profile-picture`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // getProfilePicture: (id: string) => api.get(`uploads/admins/${id}`),

  deleteAdmin: (id: string) => api.delete(`/admin/delete-admin/${id}`),

  getAnnouncements: () =>
    api.get<AnnouncementListResponse>("/admin/get-announcements"),

  createAnnouncement: (data: AnnouncementRequest) =>
    api.post<Announcement>("/admin/create-announcement", data),

  deleteAnnouncement: (id: string) =>
    api.delete(`/admin/delete-announcement/${id}`),
};
