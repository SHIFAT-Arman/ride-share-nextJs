import api from "../lib/axios";

export type VehicleType = "CAR" | "BIKE" | "CAR_XL";

export type RideLocation = {
  latitude: number;
  longitude: number;
  address: string;
};

export type CreateRideRequest = {
  pickup: RideLocation;
  destination: RideLocation;
  vehicleType: VehicleType;
};

export type RideEstimate = {
  estimatedFare: number;
  estimatedDistanceInKm: number;
  estimatedDurationInMinutes: number;
  geometry: [number, number][];
  nearbyDrivers: unknown[];
};

export type RideStatus =
  | "REQUESTED"
  | "SEARCHING"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type Ride = {
  id: string;
  riderUserId: string;
  driverUserId: string | null;
  pickupLatitude: number;
  pickupLongitude: number;
  pickupAddress: string;
  destinationLatitude: number;
  destinationLongitude: number;
  destinationAddress: string;
  vehicleType: VehicleType;
  status: RideStatus;
  estimatedFare: number | null;
  estimatedDistanceInKm: number | null;
  estimatedDurationInMinutes: number | null;
  createdAt: string;
};

export const rideApi = {
  estimate: (data: CreateRideRequest) =>
    api.post<RideEstimate>("/ride/estimate", data),

  create: (data: CreateRideRequest) => api.post<Ride>("/ride", data),

  getActive: () => api.get<Ride | null>("/ride/active"),

  getSearching: () => api.get<Ride[]>("/ride/searching"),

  getById: (id: string) => api.get<Ride>(`/ride/${id}`),

  accept: (id: string) => api.post<Ride>(`/ride/${id}/accept`),

  start: (id: string) => api.post<Ride>(`/ride/${id}/start`),

  complete: (id: string) => api.post<Ride>(`/ride/${id}/complete`),

  cancel: (id: string) => api.post<Ride>(`/ride/${id}/cancel`),
};
