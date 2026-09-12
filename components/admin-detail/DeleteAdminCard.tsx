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
      router.push("/portal/admin");
      router.refresh();
    } catch {
      setError("Delete failed. Try again.");
      setLoading(false);
      setConfirming(false);
    }
  };

  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
      <h3 className="mb-2 text-xs font-semibold tracking-wider text-red-400/70 uppercase">
        Delete admin
      </h3>
      <p className="mb-5 text-sm text-sky-200/50">
        Permanently delete <span className="text-sky-100/80">{adminName}</span>.
        This cannot be undone.
      </p>

      {error && <p className="mb-3 text-xs text-red-400">{error}</p>}

      {confirming ? (
        <div className="flex gap-3">
          <Button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 border-0 bg-red-600 text-white hover:bg-red-500"
          >
            {loading ? "Deleting…" : "Yes, delete"}
          </Button>
          <Button
            onClick={() => setConfirming(false)}
            variant="ghost"
            className="flex-1 text-sky-200/50 hover:bg-white/5 hover:text-sky-50"
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => setConfirming(true)}
          className="w-full border border-red-500/30 bg-red-600/20 text-red-400 hover:bg-red-600/30"
        >
          Delete admin
        </Button>
      )}
    </div>
  );
}
