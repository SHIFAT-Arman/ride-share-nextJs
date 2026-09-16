import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DriverRating } from "@/api/drivers";

/** Simple list of ratings for the driver dashboard. */
export function RatingsCard({ ratings }: { ratings: DriverRating[] }) {
  return (
    <Card className="border-sky-800/60 bg-[#082f49] text-sky-50 shadow-[0_16px_40px_rgba(2,6,23,0.45)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl tracking-tight text-sky-50">
          Ratings
        </CardTitle>
        <CardDescription className="text-sky-200/70">
          Feedback from recent rides
        </CardDescription>
      </CardHeader>
      <CardContent>
        {ratings.length === 0 ? (
          <p className="py-8 text-sm text-sky-200/70">No ratings yet.</p>
        ) : (
          <ul className="space-y-3">
            {ratings.map((r) => (
              <li
                key={r.id}
                className="rounded-lg border border-sky-800/40 bg-sky-950/40 px-3 py-2"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-sky-50">
                    {r.score}/5
                  </span>
                  <span className="text-xs text-sky-200/50">
                    {formatDate(r.createdAt)}
                  </span>
                </div>
                {r.comment ? (
                  <p className="mt-1 text-sm text-sky-200/70">{r.comment}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
