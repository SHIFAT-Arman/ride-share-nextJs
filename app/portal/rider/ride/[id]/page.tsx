"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2 } from "lucide-react";
import { authApi } from "@/api/auth";
import { rideApi, type Ride } from "@/api/rides";
import { subscribeRideChannel } from "@/lib/pusher-client";
import { Button } from "@/components/ui/button";

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

export default function RiderActiveRidePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const driverMarker = useRef<L.Marker | null>(null);

  const [ride, setRide] = useState<Ride | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: session } = await authApi.me();
        if (session.role !== "rider") {
          router.replace("/login");
          return;
        }
        const { data } = await rideApi.getById(id);
        if (!cancelled) setRide(data);
      } catch {
        if (!cancelled) setError("Could not load ride.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, router]);

  useEffect(() => {
    if (!ride || !mapEl.current) return;

    let cancelled = false;
    fixLeafletDefaultIcon();
    const map = L.map(mapEl.current).setView(
      [ride.pickupLatitude, ride.pickupLongitude],
      13,
    );
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);
    mapRef.current = map;

    L.marker([ride.pickupLatitude, ride.pickupLongitude])
      .addTo(map)
      .bindPopup("Pickup");
    L.marker([ride.destinationLatitude, ride.destinationLongitude])
      .addTo(map)
      .bindPopup("Destination");
    map.fitBounds(
      L.latLngBounds(
        [ride.pickupLatitude, ride.pickupLongitude],
        [ride.destinationLatitude, ride.destinationLongitude],
      ).pad(0.2),
    );

    // Re-fetch OSRM geometry — not stored on Ride (book page had it in memory only)
    void rideApi
      .estimate({
        pickup: {
          latitude: ride.pickupLatitude,
          longitude: ride.pickupLongitude,
          address: ride.pickupAddress,
        },
        destination: {
          latitude: ride.destinationLatitude,
          longitude: ride.destinationLongitude,
          address: ride.destinationAddress,
        },
        vehicleType: ride.vehicleType,
      })
      .then(({ data }) => {
        if (cancelled || !mapRef.current) return;
        const latLngs = data.geometry.map(
          ([lng, lat]) => [lat, lng] as [number, number],
        );
        const line = L.polyline(latLngs, { color: "#0ea5e9", weight: 5 }).addTo(
          mapRef.current,
        );
        mapRef.current.fitBounds(line.getBounds().pad(0.15));
      })
      .catch(() => {
        // Markers still useful if routing fails
      });

    return () => {
      cancelled = true;
      map.remove();
      mapRef.current = null;
      driverMarker.current = null;
    };
  }, [ride?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!ride?.id) return;
    return subscribeRideChannel(ride.id, {
      onStatus: (ev) => {
        setRide((prev) =>
          prev
            ? {
                ...prev,
                status: ev.status as Ride["status"],
                driverUserId: ev.driverUserId,
              }
            : prev,
        );
      },
      onDriverLocation: (ev) => {
        const map = mapRef.current;
        if (!map) return;
        if (driverMarker.current) {
          driverMarker.current.setLatLng([ev.latitude, ev.longitude]);
        } else {
          driverMarker.current = L.marker([ev.latitude, ev.longitude], {
            title: "Driver",
          })
            .addTo(map)
            .bindPopup("Driver");
        }
      },
    });
  }, [ride?.id]);

  // Poll as fallback when Pusher is missing
  useEffect(() => {
    if (!ride?.id) return;
    if (ride.status === "COMPLETED" || ride.status === "CANCELLED") return;
    const t = setInterval(async () => {
      try {
        const { data } = await rideApi.getById(ride.id);
        setRide(data);
      } catch {
        /* ignore */
      }
    }, 8000);
    return () => clearInterval(t);
  }, [ride?.id, ride?.status]);

  const cancel = async () => {
    if (!ride) return;
    setBusy(true);
    try {
      const { data } = await rideApi.cancel(ride.id);
      setRide(data);
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(typeof msg === "string" ? msg : "Cancel failed");
    } finally {
      setBusy(false);
    }
  };

  if (error && !ride) {
    return (
      <p className="text-destructive p-6 text-sm">
        {error}{" "}
        <Link href="/portal/rider/dashboard" className="underline">
          Dashboard
        </Link>
      </p>
    );
  }

  if (!ride) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4 md:p-6">
      <div>
        <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
          Active ride
        </p>
        <h1 className="text-2xl font-semibold">{ride.status}</h1>
        <p className="text-muted-foreground text-sm">
          {ride.pickupAddress} → {ride.destinationAddress}
        </p>
        {ride.estimatedFare != null && (
          <p className="text-sm">Fare ~ ৳{ride.estimatedFare}</p>
        )}
      </div>

      <div
        ref={mapEl}
        className="z-0 h-[min(50vh,380px)] w-full overflow-hidden rounded-xl border"
      />

      {error && <p className="text-destructive text-sm">{error}</p>}

      <div className="flex flex-wrap gap-2">
        {(ride.status === "SEARCHING" || ride.status === "ACCEPTED") && (
          <Button variant="destructive" disabled={busy} onClick={cancel}>
            Cancel ride
          </Button>
        )}
        <Button variant="outline" render={<Link href="/portal/rider/dashboard" />}>
          Dashboard
        </Button>
      </div>
    </div>
  );
}
