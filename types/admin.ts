import type { PaginationResponse } from "./pagination";

export type AdminRole = "admin";

export type NotificationRole = "rider" | "driver" | "admin";

export interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  age?: number;
  country: string;
  phoneNumber: string | null;
  profilePictureUrl: string | null;
  joiningDate: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  role: AdminRole;
}

export interface AdminFilterParams {
  id?: string;
  joiningDate?: string;
  country?: string;
  firstName?: string;
  lastName?: string;
  role?: AdminRole;
  limit?: number;
  offset?: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetRoles?: NotificationRole[];
  createdAt: string;
  updatedAt: string;
  admin?: Admin;
}

export type AnnouncementListResponse = PaginationResponse<Announcement>;
export type AdminListResponse = PaginationResponse<Admin>;
