import type { AxiosRequestConfig } from "axios";
import api from "../lib/axios";
import type { PaginationResponse } from "@/types/pagination";
import { CreateRequest } from "./admins";

export type RiderStatus = "ACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION";

export interface Rider {
  id: string;
  firstName: string;
  lastName: string;
  status: RiderStatus;
  email?: string;
}

export interface FindRiderParams {
  limit?: number;
  offset?: number;
  id?: string;
  status?: RiderStatus;
  firstName?: string;
  lastName?: string;
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
};
