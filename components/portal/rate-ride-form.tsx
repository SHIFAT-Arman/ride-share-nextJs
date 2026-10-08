"use client";

import { useState } from "react";
import {
  rideApi,
  type CreateRideRatingRequest,
  type RideRating,
} from "@/api/rides";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  rideId: string;
  existing: RideRating | null;
  onRated: (rating: RideRating) => void;
};

export function RateRideForm({ rideId, existing, onRated }: Props) {
  const [score, setScore] = useState(existing?.score ?? 5);
  const [comment, setComment] = useState(existing?.comment ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (existing) {
    return (
      <div className="rounded-xl border border-sky-800/60 bg-sky-950/40 p-4">
        <p className="text-xs font-medium tracking-wide text-sky-400 uppercase">
          Your rating
        </p>
        <p className="mt-1 font-mono text-sky-50">{existing.score}/5</p>
        {existing.comment ? (
          <p className="mt-1 text-sm text-sky-200/70">{existing.comment}</p>
        ) : null}
      </div>
    );
  }

  const submit = async () => {
    setBusy(true);
    setError("");
    const body: CreateRideRatingRequest = { score };
    const trimmed = comment.trim();
    if (trimmed) body.comment = trimmed;
    try {
      const { data } = await rideApi.rate(rideId, body);
      onRated(data);
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(typeof msg === "string" ? msg : "Could not submit rating");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3 rounded-xl border border-sky-800/60 bg-sky-950/40 p-4">
      <div>
        <p className="text-xs font-medium tracking-wide text-sky-400 uppercase">
          Rate your driver
        </p>
        <p className="mt-1 text-sm text-sky-200/70">
          How was this trip? Scores are 1–5.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <Button
            key={n}
            type="button"
            size="sm"
            variant={score === n ? "default" : "outline"}
            onClick={() => setScore(n)}
            disabled={busy}
          >
            {n}
          </Button>
        ))}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="ride-rating-comment" className="text-sky-200/80">
          Comment (optional)
        </Label>
        <Textarea
          id="ride-rating-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={500}
          rows={3}
          disabled={busy}
          className="border-sky-800/60 bg-sky-950/60 text-sky-50"
        />
      </div>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <Button size="sm" disabled={busy} onClick={() => void submit()}>
        {busy ? "Submitting…" : "Submit rating"}
      </Button>
    </div>
  );
}
