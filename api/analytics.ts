import type { AxiosRequestConfig } from "axios";
import api from "../lib/axios";

export type AnalyticsRange = "7d" | "30d" | "all";

export type RidesByDay = {
  date: string;
  count: number;
  earnings?: number;
};

export type VehicleMixItem = {
  vehicleType: string;
  count: number;
};

export type AdminAnalytics = {
  range: AnalyticsRange;
  from: string | null;
  to: string;
  kpis: {
    totalRides: number;
    completedRides: number;
    cancelledRides: number;
    completionRate: number;
    cancellationRate: number;
    estimatedGmv: number;
    onlineDrivers: number;
    pendingDriverVerifications: number;
    pendingRiderVerifications: number;
    searchingRides: number;
  };
  ridesByDay: { date: string; count: number }[];
  ridesByStatus: { status: string; count: number }[];
  vehicleMix: { vehicleType: string; count: number; estimatedFare: number }[];
  ratingHealth: {
    averageScore: number | null;
    ratingCount: number;
    ratedShare: number;
    distribution: { score: number; count: number }[];
  };
  accounts: { admin: number; rider: number; driver: number };
};

export type RiderAnalytics = {
  range: AnalyticsRange;
  from: string | null;
  to: string;
  role: "rider";
  kpis: {
    completedRides: number;
    cancelledRides: number;
    estimatedSpend: number;
    avgDistanceKm: number | null;
    avgDurationMin: number | null;
  };
  ridesByDay: RidesByDay[];
  vehicleMix: VehicleMixItem[];
};

export type DriverAnalytics = {
  range: AnalyticsRange;
  from: string | null;
  to: string;
  role: "driver";
  kpis: {
    completedRides: number;
    cancelledRides: number;
    estimatedEarnings: number;
    averageRating: number | null;
    ratingCount: number;
  };
  ridesByDay: (RidesByDay & { earnings: number })[];
};

export type MeAnalytics = RiderAnalytics | DriverAnalytics;

export type AnalyticsParams = {
  range?: AnalyticsRange;
};

export const analyticsApi = {
  getAdmin: (
    params: AnalyticsParams = {},
    config?: AxiosRequestConfig,
  ) =>
    api.get<AdminAnalytics>("/analytics/admin", {
      params,
      ...config,
    }),

  getMe: (
    params: AnalyticsParams = {},
    config?: AxiosRequestConfig,
  ) =>
    api.get<MeAnalytics>("/analytics/me", {
      params,
      ...config,
    }),
};
