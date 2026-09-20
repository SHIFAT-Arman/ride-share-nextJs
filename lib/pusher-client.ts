import Pusher from "pusher-js";

export type NotificationRole = "rider" | "driver" | "admin";

export type AnnouncementEvent = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  targetRoles: NotificationRole[];
};

let pusher: Pusher | null = null;

function getPusher() {
  if (typeof window === "undefined") return null;

  const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
  if (!key || !cluster) {
    console.warn("Pusher env missing: NEXT_PUBLIC_PUSHER_KEY / CLUSTER");
    return null;
  }

  if (!pusher) {
    pusher = new Pusher(key, { cluster });
  }

  return pusher;
}

/** Listen for new announcements on a role channel. Returns an unsubscribe function. */
export function subscribeRoleNotifications(
  role: NotificationRole,
  onAnnouncement: (data: AnnouncementEvent) => void,
) {
  const client = getPusher();
  if (!client) return () => {};

  const channelName = `${role}-notifications`;
  const channel = client.subscribe(channelName);

  channel.bind("new-announcement", onAnnouncement);

  return () => {
    channel.unbind("new-announcement", onAnnouncement);
  };
}

export type RideAssignedEvent = {
  rideId: string;
  status: string;
  pickupAddress: string;
  destinationAddress: string;
  vehicleType: string;
  estimatedFare: number | null;
};

export type RideStatusEvent = {
  rideId: string;
  status: string;
  driverUserId: string | null;
};

export type DriverLocationEvent = {
  rideId: string;
  latitude: number;
  longitude: number;
};

/** Driver channel: ride auto-assigned. */
export function subscribeDriverRideAssigned(
  driverUserId: string,
  onAssigned: (data: RideAssignedEvent) => void,
) {
  const client = getPusher();
  if (!client) return () => {};

  const channel = client.subscribe(`driver-${driverUserId}`);
  channel.bind("ride-assigned", onAssigned);
  return () => {
    channel.unbind("ride-assigned", onAssigned);
    client.unsubscribe(`driver-${driverUserId}`);
  };
}

/** Ride channel: status + live driver GPS. */
export function subscribeRideChannel(
  rideId: string,
  handlers: {
    onStatus?: (data: RideStatusEvent) => void;
    onDriverLocation?: (data: DriverLocationEvent) => void;
  },
) {
  const client = getPusher();
  if (!client) return () => {};

  const name = `ride-${rideId}`;
  const channel = client.subscribe(name);
  if (handlers.onStatus) channel.bind("ride-status", handlers.onStatus);
  if (handlers.onDriverLocation) {
    channel.bind("driver-location", handlers.onDriverLocation);
  }
  return () => {
    if (handlers.onStatus) channel.unbind("ride-status", handlers.onStatus);
    if (handlers.onDriverLocation) {
      channel.unbind("driver-location", handlers.onDriverLocation);
    }
    client.unsubscribe(name);
  };
}
