import Link from "next/link";
import type { Ride } from "@/api/rides";
import { Button } from "@/components/ui/button";

type Props = {
  rides: Ride[];
  /** When set, completed rides link to the rider track/rate page. */
  riderTrackHref?: (rideId: string) => string;
  emptyLabel?: string;
};

export function RideHistoryList({
  rides,
  riderTrackHref,
  emptyLabel = "No past rides yet.",
}: Props) {
  if (rides.length === 0) {
    return <p className="py-8 text-sm text-sky-200/70">{emptyLabel}</p>;
  }

  return (
    <ul className="space-y-3">
      {rides.map((ride) => (
        <li
          key={ride.id}
          className="flex flex-col gap-2 border-b border-sky-900/60 pb-3 last:border-0 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="text-sm text-sky-100">
            <p className="text-xs font-medium tracking-wide text-sky-400 uppercase">
              {ride.status}
              {ride.createdAt ? ` · ${formatDate(ride.createdAt)}` : ""}
            </p>
            <p className="mt-1">
              {ride.pickupAddress} → {ride.destinationAddress}
            </p>
            <p className="text-sky-400">
              {ride.vehicleType}
              {ride.estimatedFare != null ? ` · ৳${ride.estimatedFare}` : ""}
            </p>
          </div>
          {riderTrackHref && ride.status === "COMPLETED" ? (
            <Button
              size="sm"
              variant="outline"
              render={<Link href={riderTrackHref(ride.id)} />}
            >
              View / rate
            </Button>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
