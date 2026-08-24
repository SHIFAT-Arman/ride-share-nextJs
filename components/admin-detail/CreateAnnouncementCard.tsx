"use client";

import { useState } from "react";
import { adminApi } from "@/api/admins";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function CreateAnnouncementCard() {
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
    } catch {
      setMessage("Failed to publish. Please try again.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/8 bg-white/3 p-6">
      <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-5">
        Create Announcement
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-white/50 text-xs uppercase tracking-wider">Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Important Announcement"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-10"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-white/50 text-xs uppercase tracking-wider">Content</Label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your announcement here…"
            rows={4}
            className="flex w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500/50 resize-none"
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
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white border-0"
        >
          {loading ? "Publishing…" : "Publish Announcement"}
        </Button>
      </form>
    </div>
  );
}
