import api from "../lib/axios";

export type PlaceResult = {
  address: string;
  latitude: number;
  longitude: number;
};

export const locationApi = {
  search: (place: string) =>
    api.get<PlaceResult[]>("/location/search", { params: { place } }),

  /** Driver shares current GPS. */
  updateMyLocation: (latitude: number, longitude: number) =>
    api.patch("/location/driver/me", { latitude, longitude }),
};
