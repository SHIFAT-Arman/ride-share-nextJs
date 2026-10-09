import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SCORES = [5, 4, 3, 2, 1] as const;

export function RatingHealthCard({
  data,
}: {
  data: {
    averageScore: number | null;
    ratingCount: number;
    ratedShare: number;
    distribution: { score: number; count: number }[];
  };
}) {
  const byScore = new Map(data.distribution.map((d) => [d.score, d.count]));
  const maxCount = Math.max(1, ...SCORES.map((s) => byScore.get(s) ?? 0));
  const avg =
    data.averageScore == null
      ? "—"
      : data.averageScore.toLocaleString(undefined, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        });
  const ratedPct = `${Math.round(data.ratedShare * 100)}%`;

  return (
    <Card className="border-sky-800/60 bg-[#082f49] text-sky-50 shadow-[0_16px_40px_rgba(2,6,23,0.45)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl tracking-tight text-sky-50">
          Rating health
        </CardTitle>
        <CardDescription className="text-sky-200/70">
          Average score and share of completed rides that were rated.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <dl className="grid grid-cols-3 gap-4">
          <div>
            <dt className="text-xs text-sky-200/70">Avg rating</dt>
            <dd className="mt-1 font-mono text-2xl tabular-nums text-sky-50">
              {avg}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-sky-200/70">Ratings</dt>
            <dd className="mt-1 font-mono text-2xl tabular-nums text-sky-50">
              {data.ratingCount.toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-sky-200/70">Rated share</dt>
            <dd className="mt-1 font-mono text-2xl tabular-nums text-sky-50">
              {ratedPct}
            </dd>
          </div>
        </dl>

        {data.ratingCount === 0 ? (
          <p className="text-sm text-sky-200/70">No ratings in this range.</p>
        ) : (
          <ul className="space-y-2">
            {SCORES.map((score) => {
              const count = byScore.get(score) ?? 0;
              const width = `${(count / maxCount) * 100}%`;
              return (
                <li key={score} className="flex items-center gap-3">
                  <span className="w-6 shrink-0 font-mono text-xs tabular-nums text-sky-200/80">
                    {score}
                  </span>
                  <div className="h-2 min-w-0 flex-1 rounded-sm bg-sky-950/60">
                    <div
                      className="h-full rounded-sm bg-sky-400/80"
                      style={{ width }}
                    />
                  </div>
                  <span className="w-10 shrink-0 text-right font-mono text-xs tabular-nums text-sky-200/70">
                    {count.toLocaleString()}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
