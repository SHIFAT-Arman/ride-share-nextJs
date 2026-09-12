"use client";

import { useState } from "react";
import { adminApi } from "@/api/admins";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function CreateAnnouncementCard({ onCreated }: { onCreated?: () => void }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await adminApi.createAnnouncement({ title, content });
      setMessage("Announcement published.");
      setIsError(false);
      setTitle("");
      setContent("");
      onCreated?.();
    } catch {
      setMessage("Could not publish. Try again.");
      setIsError(true);
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

        {message && (
          <p className={`text-xs ${isError ? "text-red-400" : "text-emerald-400"}`}>
            {message}
          </p>
        )}

        <Button
          type="submit"
          disabled={!title || !content || loading}
          className="w-full border-0 bg-sky-700 text-white hover:bg-sky-800"
        >
          {loading ? "Publishing…" : "Publish announcement"}
        </Button>
      </form>
    </div>
  );
}
