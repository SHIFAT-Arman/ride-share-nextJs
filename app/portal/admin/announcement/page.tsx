"use client";

import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";
import { adminApi } from "@/api/admins";
import { Announcement } from "@/types/admin";
import { subscribeRoleNotifications } from "@/lib/pusher-client";
import { CreateAnnouncementCard } from "@/components/admin-detail/CreateAnnouncementCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToastManager } from "@/components/ui/toast";

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AnnouncementPage() {
  const { add: addToast } = useToastManager();
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminApi.getAnnouncements({ limit: 100 });
      setItems(res.data.data);
    } catch {
      setError("Failed to load announcements. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // When another admin publishes to admins, refresh the list
  useEffect(() => {
    return subscribeRoleNotifications("admin", (data) => {
      setItems((prev) => {
        if (prev.some((item) => item.id === data.id)) return prev;
        return [
          {
            id: data.id,
            title: data.title,
            content: data.content,
            targetRoles: data.targetRoles,
            createdAt: data.createdAt,
            updatedAt: data.createdAt,
          },
          ...prev,
        ];
      });
    });
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await adminApi.deleteAnnouncement(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      addToast({ title: "Announcement deleted", type: "success" });
    } catch {
      addToast({
        title: "Could not delete announcement. Try again.",
        type: "error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div>
        <p className="font-mono text-[10px] tracking-[0.25em] text-sky-400 uppercase">
          Notices
        </p>
        <h1 className="mt-1 mb-6 text-2xl font-semibold tracking-tight">
          Announcements
        </h1>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            {error}
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 text-red-400 hover:bg-red-500/10"
              onClick={load}
            >
              Try again
            </Button>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-28 bg-sky-900/40" />
            <Skeleton className="h-28 bg-sky-900/40" />
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-sky-800/40 px-6 py-20 text-center">
            <Megaphone className="mx-auto mb-3 h-8 w-8 text-sky-200/15" />
            <p className="text-sm text-sky-200/40">No announcements yet</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-sky-800/40 bg-sky-950/50 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-base font-medium text-sky-50">
                      {item.title}
                    </h2>
                    <p className="mt-1 font-mono text-[11px] text-sky-200/40">
                      {formatDate(item.createdAt)}
                      {item.admin
                        ? ` · ${item.admin.firstName} ${item.admin.lastName}`
                        : ""}
                      {item.targetRoles?.length
                        ? ` · to ${item.targetRoles.join(", ")}`
                        : ""}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={deletingId === item.id}
                    onClick={() => handleDelete(item.id)}
                    className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  >
                    {deletingId === item.id ? "Deleting…" : "Delete"}
                  </Button>
                </div>
                <p className="mt-3 text-sm whitespace-pre-wrap text-sky-100/70">
                  {item.content}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <CreateAnnouncementCard onCreated={load} />
    </div>
  );
}
