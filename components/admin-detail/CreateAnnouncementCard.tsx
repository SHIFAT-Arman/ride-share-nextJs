"use client";

import { useState } from "react";
import { adminApi } from "@/api/admins";
import type { NotificationRole } from "@/types/admin";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToastManager } from "@/components/ui/toast";

const ROLE_OPTIONS: { value: NotificationRole; label: string }[] = [
  { value: "rider", label: "Riders" },
  { value: "driver", label: "Drivers" },
  { value: "admin", label: "Admins" },
];

const MAX_CONTENT_WORDS = 200;

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

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

  const wordCount = countWords(content);
  const overLimit = wordCount > MAX_CONTENT_WORDS;

  const toggleRole = (role: NotificationRole, checked: boolean) => {
    setTargetRoles((prev) =>
      checked ? [...prev, role] : prev.filter((r) => r !== role),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (overLimit) {
      addToast({
        title: `Content exceeds ${MAX_CONTENT_WORDS} words`,
        type: "error",
      });
      return;
    }
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
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write the notice…"
            rows={4}
            aria-invalid={overLimit || undefined}
            className="min-h-24 border-sky-800/50 bg-white/5 text-sky-50 placeholder:text-sky-200/20"
          />
          <p
            className={
              overLimit
                ? "text-right text-xs text-red-400"
                : "text-right text-xs text-sky-200/40"
            }
          >
            {wordCount} / {MAX_CONTENT_WORDS}
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-xs tracking-wider text-sky-200/50 uppercase">
            Send to
          </Label>
          <div className="flex flex-col gap-2.5">
            {ROLE_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2.5 text-sm text-sky-100/80"
              >
                <Checkbox
                  checked={targetRoles.includes(option.value)}
                  onCheckedChange={(checked) =>
                    toggleRole(option.value, checked === true)
                  }
                  className="border-sky-700/60 bg-white/5 data-checked:border-sky-600 data-checked:bg-sky-600"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          disabled={
            !title ||
            !content ||
            overLimit ||
            targetRoles.length === 0 ||
            loading
          }
          className="w-full rounded-md border-0 bg-sky-700 text-white hover:bg-sky-800"
        >
          {loading ? "Publishing…" : "Publish announcement"}
        </Button>
      </form>
    </div>
  );
}
