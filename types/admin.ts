export enum AdminRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  SUPPORT_AGENT = "SUPPORT_AGENT",
}

export interface AdminProfile {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  country: string;
  phoneNumber: string | null;
  profilePictureUrl: string | null;
  joiningDate: string;
}

export interface Admin {
  id: string;
  email: string;
  password: string;
  role: AdminRole;
  createdAt: Date;
  updatedAt: Date;
  profile: AdminProfile;
}

export interface AdminFilterParams {
  id?: string;
  joiningDate?: Date;
  country?: string;
  firstName?: string;
  lastName?: string;
  role?: AdminRole;
  limit?: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  admin: {
    id: string;
    email?: string;
    password?: string;
    role?: AdminRole;
    createdAt?: string;
    updatedAt?: string;
  };
}

export interface AnnouncementListResponse {
  data: Announcement[];
  meta: {
    total: number;
    offset: number;
    limit: number;
  };
}
