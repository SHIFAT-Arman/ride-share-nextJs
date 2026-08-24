"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/api/admins";
import { Button } from "@/components/ui/button";

interface DeleteAdminCardProps {
  adminId: string;
  adminName: string;
}

export function DeleteAdminCard({ adminId, adminName }: DeleteAdminCardProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    try {
      await adminApi.deleteAdmin(adminId);
      router.push("/admin/dashboard");
    } catch {
      setError("Delete failed. Please try again.");
      setLoading(false);
      setConfirming(false);
    }
  };

  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
      <h3 className="text-xs font-semibold text-red-400/70 uppercase tracking-wider mb-2">
        Danger Zone
      </h3>
      <p className="text-white/40 text-sm mb-5">
        Permanently delete{" "}
        <span className="text-white/70">{adminName}</span>'s account.
        This cannot be undone.
      </p>

      {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

      {confirming ? (
        <div className="flex gap-3">
          <Button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white border-0"
          >
            {loading ? "Deleting…" : "Yes, delete"}
          </Button>
          <Button
            onClick={() => setConfirming(false)}
            variant="ghost"
            className="flex-1 text-white/50 hover:text-white hover:bg-white/5"
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => setConfirming(true)}
          className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30"
        >
          Delete Admin
        </Button>
      )}
    </div>
  );
}
