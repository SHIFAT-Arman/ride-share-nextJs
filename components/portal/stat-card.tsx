import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const cardClass =
  "border-sky-800/60 bg-[#082f49] text-sky-50 shadow-[0_16px_40px_rgba(2,6,23,0.45)]";

/** Compact KPI tile for portal dashboards. */
export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <Card className={cardClass}>
      <CardHeader className="pb-2">
        <CardDescription className="text-sky-200/70">{label}</CardDescription>
        <CardTitle className="font-mono text-2xl tracking-tight text-sky-50 tabular-nums">
          {typeof value === "number" ? value.toLocaleString() : value}
        </CardTitle>
      </CardHeader>
      {hint ? (
        <CardContent>
          <p className="text-xs text-sky-200/60">{hint}</p>
        </CardContent>
      ) : null}
    </Card>
  );
}
