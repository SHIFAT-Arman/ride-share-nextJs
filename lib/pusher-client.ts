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

  // Only unbind this handler — other pages may still need the channel
  return () => {
    channel.unbind("new-announcement", onAnnouncement);
  };
}
