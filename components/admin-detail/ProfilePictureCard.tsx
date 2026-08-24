"use client";

import { useState } from "react";
import { adminApi } from "@/api/admins";
import { Button } from "@/components/ui/button";

interface ProfilePictureCardProps {
  adminId: string;
  onSuccess: () => void;
}

export function ProfilePictureCard({
  adminId,
  onSuccess,
}: ProfilePictureCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setMessage("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      await adminApi.uploadProfilePicture(adminId, formData);
      setMessage("Profile picture updated.");
      setIsError(false);
      setFile(null);
      onSuccess();
    } catch {
      setMessage("Upload failed. Please try again.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/8 bg-white/3 p-6">
      <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-5">
        Profile Picture
      </h3>

      <div className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-white/40
            file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0
            file:text-xs file:bg-white/10 file:text-white/70
            hover:file:bg-white/15 cursor-pointer"
        />

        {message && (
          <p
            className={`text-xs ${isError ? "text-red-400" : "text-emerald-400"}`}
          >
            {message}
          </p>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white border-0"
        >
          {loading ? "Uploading…" : "Upload Picture"}
        </Button>
      </div>
    </div>
  );
}
