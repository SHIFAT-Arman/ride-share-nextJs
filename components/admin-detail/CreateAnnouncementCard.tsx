"use client";

import { useState } from "react";
import { adminApi } from "@/api/admins";
import type { NotificationRole } from "@/types/admin";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToastManager } from "@/components/ui/toast";

const ROLE_OPTIONS: { value: NotificationRole; label: string }[] = [
  { value: "rider", label: "Riders" },
  { value: "driver", label: "Drivers" },
  { value: "admin", label: "Admins" },
];

export function CreateAnnouncementCard({ onCreated }: { onCreated?: () => void }) {
  const { add: addToast } = useToastManager();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [targetRoles, setTargetRoles] = useState<NotificationRole[]>([
    "rider",
    "driver",
    "admin",
  ]);
  const [loading, setLoading] = useState(false);

  const toggleRole = (role: NotificationRole) => {
    setTargetRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminApi.createAnnouncement({ title, content, targetRoles });
      setTitle("");
      setContent("");
      setTargetRoles(["rider", "driver", "admin"]);
      addToast({ title: "Announcement published", type: "success" });
      onCreated?.();
    } catch {
      addToast({ title: "Could not publish. Try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-sky-800/40 bg-sky-950/40 p-6">
      <h3 className="mb-5 text-xs font-semibold tracking-wider text-sky-200/50 uppercase">
        Create announcement
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs tracking-wider text-sky-200/50 uppercase">Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Fare change tonight"
            className="h-10 border-sky-800/50 bg-white/5 text-sky-50 placeholder:text-sky-200/20"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs tracking-wider text-sky-200/50 uppercase">Content</Label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write the notice…"
            rows={4}
            className="flex w-full resize-none rounded-md border border-sky-800/50 bg-white/5 px-3 py-2 text-sm text-sky-50 placeholder:text-sky-200/20 focus-visible:ring-1 focus-visible:ring-sky-500/50 focus-visible:outline-none"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs tracking-wider text-sky-200/50 uppercase">
            Send to
          </Label>
          <div className="flex flex-col gap-2">
            {ROLE_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2 text-sm text-sky-100/80"
              >
                <input
                  type="checkbox"
                  checked={targetRoles.includes(option.value)}
                  onChange={() => toggleRole(option.value)}
                  className="size-4 accent-sky-600"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          disabled={!title || !content || targetRoles.length === 0 || loading}
          className="w-full border-0 bg-sky-700 text-white hover:bg-sky-800"
        >
          {loading ? "Publishing…" : "Publish announcement"}
        </Button>
      </form>
    </div>
  );
}
