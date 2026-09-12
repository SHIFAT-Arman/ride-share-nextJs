import type { AxiosRequestConfig } from "axios";
import api from "../lib/axios";
import type { PaginationResponse } from "@/types/pagination";

export type DriverStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "PENDING_VERIFICATION";

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  status: DriverStatus;
  email?: string;
}

export interface FindDriverParams {
  limit?: number;
  offset?: number;
  id?: string;
  status?: DriverStatus;
  firstName?: string;
  lastName?: string;
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
};
