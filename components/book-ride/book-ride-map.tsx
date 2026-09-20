"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2 } from "lucide-react";
import { authApi, dashboardPathForRole } from "@/api/auth";
import { locationApi, type PlaceResult } from "@/api/location";
import {
  rideApi,
  type RideEstimate,
  type VehicleType,
} from "@/api/rides";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const FALLBACK_PICKUP = {
  latitude: 23.8103,
  longitude: 90.4125,
  address: "Default pickup (Dhaka)",
};

function fixLeafletDefaultIcon() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

function apiErrorMessage(err: unknown, fallback: string): string {
  const msg = (err as { response?: { data?: { message?: string | string[] } } })
    ?.response?.data?.message;
  if (Array.isArray(msg)) return msg.filter(Boolean).join(", ") || fallback;
  if (typeof msg === "string" && msg) return msg;
  return fallback;
}

type Pickup = {
  latitude: number;
  longitude: number;
  address: string;
};

export default function BookRideMap() {
  const router = useRouter();
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const pickupMarker = useRef<L.Marker | null>(null);
  const destMarker = useRef<L.Marker | null>(null);
  const routeLine = useRef<L.Polyline | null>(null);

  const [ready, setReady] = useState(false);
  const [pickup, setPickup] = useState<Pickup | null>(null);
  const [destination, setDestination] = useState<PlaceResult | null>(null);
  const [vehicleType, setVehicleType] = useState<VehicleType | null>(null);
  const [estimate, setEstimate] = useState<RideEstimate | null>(null);
  const [estimating, setEstimating] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [bookedRideId, setBookedRideId] = useState<string | null>(null);
  const [bookedStatus, setBookedStatus] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await authApi.me();
        if (cancelled) return;
        if (data.role !== "rider") {
          router.replace(dashboardPathForRole(data.role));
          return;
        }
        setReady(true);
      } catch {
        if (!cancelled) router.replace("/login?next=/book-a-ride");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    if (!ready || bookedRideId || !mapEl.current) return;

    let cancelled = false;
    fixLeafletDefaultIcon();
    const map = L.map(mapEl.current).setView(
      [FALLBACK_PICKUP.latitude, FALLBACK_PICKUP.longitude],
      13,
    );
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);
    mapRef.current = map;

    const placePickup = (p: Pickup) => {
      if (cancelled) return;
      setPickup(p);
      if (pickupMarker.current) pickupMarker.current.remove();
      pickupMarker.current = L.marker([p.latitude, p.longitude])
        .addTo(map)
        .bindPopup("Pickup");
      map.setView([p.latitude, p.longitude], 13);
    };

    placePickup(FALLBACK_PICKUP);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          placePickup({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            address: "Current location",
          });
        },
        () => {},
        { enableHighAccuracy: false, timeout: 8000 },
      );
    }

    return () => {
      cancelled = true;
      map.remove();
      mapRef.current = null;
      pickupMarker.current = null;
      destMarker.current = null;
      routeLine.current = null;
    };
  }, [ready, bookedRideId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!destination) {
      destMarker.current?.remove();
      destMarker.current = null;
      return;
    }

    destMarker.current?.remove();
    destMarker.current = L.marker([
      destination.latitude,
      destination.longitude,
    ])
      .addTo(map)
      .bindPopup("Destination");
  }, [destination]);

  // OSRM estimate + polyline when pickup, destination, and vehicle are set
  useEffect(() => {
    if (!pickup || !destination || !vehicleType) {
      setEstimate(null);
      routeLine.current?.remove();
      routeLine.current = null;
      return;
    }

    let stale = false;
    setEstimating(true);
    setError("");
    (async () => {
      try {
        const { data } = await rideApi.estimate({
          pickup,
          destination: {
            latitude: destination.latitude,
            longitude: destination.longitude,
            address: destination.address,
          },
          vehicleType,
        });
        if (stale) return;
        setEstimate(data);

        const map = mapRef.current;
        if (!map) return;
        routeLine.current?.remove();
        // OSRM returns [lng, lat]; Leaflet wants [lat, lng]
        const latLngs = data.geometry.map(
          ([lng, lat]) => [lat, lng] as [number, number],
        );
        routeLine.current = L.polyline(latLngs, {
          color: "#0ea5e9",
          weight: 5,
        }).addTo(map);
        map.fitBounds(routeLine.current.getBounds().pad(0.15));
      } catch (err) {
        if (!stale) {
          setEstimate(null);
          setError(apiErrorMessage(err, "Could not get route. Try again."));
        }
      } finally {
        if (!stale) setEstimating(false);
      }
    })();

    return () => {
      stale = true;
    };
  }, [pickup, destination, vehicleType]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }
    if (destination && q === destination.address) {
      setResults([]);
      setSearching(false);
      return;
    }

    let stale = false;
    const t = setTimeout(async () => {
      setSearching(true);
      setError("");
      try {
        const { data } = await locationApi.search(q);
        if (!stale) setResults(data);
      } catch (err) {
        if (!stale) {
          setError(apiErrorMessage(err, "Search failed. Try again."));
          setResults([]);
        }
      } finally {
        if (!stale) setSearching(false);
      }
    }, 400);

    return () => {
      stale = true;
      clearTimeout(t);
    };
  }, [query, destination]);

  const confirm = async () => {
    if (!pickup || !destination || !vehicleType) return;
    setSubmitting(true);
    setError("");
    try {
      const { data } = await rideApi.create({
        pickup,
        destination: {
          latitude: destination.latitude,
          longitude: destination.longitude,
          address: destination.address,
        },
        vehicleType,
      });
      setBookedRideId(data.id);
      setBookedStatus(data.status);
    } catch (err: unknown) {
      setError(
        apiErrorMessage(
          err,
          "Could not book ride. Check that you are logged in as a rider.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!ready) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center pt-24 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  if (bookedRideId) {
    const searching = bookedStatus === "SEARCHING";
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center gap-4 px-4 pt-24 text-center">
        <h1 className="text-2xl font-semibold">
          {searching ? "Looking for a driver…" : "Driver assigned"}
        </h1>
        <p className="text-muted-foreground text-sm">
          Ride <span className="font-mono text-xs">{bookedRideId}</span>
          {bookedStatus ? ` · ${bookedStatus}` : ""}
        </p>
        <Button render={<Link href={`/portal/rider/ride/${bookedRideId}`} />}>
          Track ride
        </Button>
        <Button variant="outline" render={<Link href="/portal/rider/dashboard" />}>
          Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 pt-24 pb-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Book a ride</h1>
        <p className="text-muted-foreground text-sm">
          Search a destination, pick car or bike, confirm.
        </p>
      </div>

      <div
        ref={mapEl}
        className="z-0 h-[min(55vh,420px)] w-full overflow-hidden rounded-xl border"
      />

      <div className="relative flex flex-col gap-2">
        <label className="text-sm font-medium" htmlFor="dest-search">
          Destination
        </label>
        <Input
          id="dest-search"
          value={query}
          onChange={(e) => {
            const v = e.target.value;
            setQuery(v);
            if (destination && v !== destination.address) {
              setDestination(null);
            }
          }}
          placeholder="Search place…"
          autoComplete="off"
        />
        {searching && (
          <p className="text-muted-foreground text-xs">Searching…</p>
        )}
        {results.length > 0 && (
          <ul className="absolute top-full z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg border bg-background shadow-md">
            {results.map((r) => (
              <li key={`${r.latitude},${r.longitude},${r.address}`}>
                <button
                  type="button"
                  className="hover:bg-muted w-full px-3 py-2 text-left text-sm"
                  onClick={() => {
                    setDestination(r);
                    setQuery(r.address);
                    setResults([]);
                  }}
                >
                  {r.address}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {destination && (
        <p className="text-muted-foreground text-xs">
          Going to: {destination.address}
        </p>
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          variant={vehicleType === "CAR" ? "default" : "outline"}
          onClick={() => setVehicleType("CAR")}
        >
          Car
        </Button>
        <Button
          type="button"
          variant={vehicleType === "BIKE" ? "default" : "outline"}
          onClick={() => setVehicleType("BIKE")}
        >
          Bike
        </Button>
      </div>

      {estimating && (
        <p className="text-muted-foreground flex items-center gap-2 text-sm">
          <Loader2 className="size-4 animate-spin" /> Computing route…
        </p>
      )}

      {estimate && !estimating && (
        <div className="text-muted-foreground grid gap-1 text-sm sm:grid-cols-3">
          <p>
            Distance:{" "}
            <span className="text-foreground font-medium">
              {estimate.estimatedDistanceInKm} km
            </span>
          </p>
          <p>
            ETA:{" "}
            <span className="text-foreground font-medium">
              ~{estimate.estimatedDurationInMinutes} min
            </span>
          </p>
          <p>
            Fare:{" "}
            <span className="text-foreground font-medium">
              ৳{estimate.estimatedFare}
            </span>
          </p>
        </div>
      )}

      {error && <p className="text-destructive text-sm">{error}</p>}

      <Button
        type="button"
        size="lg"
        disabled={
          !pickup ||
          !destination ||
          !vehicleType ||
          !estimate ||
          estimating ||
          submitting
        }
        onClick={confirm}
      >
        {submitting ? (
          <>
            <Loader2 className="animate-spin" /> Booking…
          </>
        ) : (
          "Confirm ride"
        )}
      </Button>
    </div>
  );
}
