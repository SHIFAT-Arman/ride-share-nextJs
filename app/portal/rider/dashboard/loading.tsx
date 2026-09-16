import { Skeleton } from "@/components/ui/skeleton";

export default function RiderDashboardLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-3 w-16 bg-sky-800/50" />
        <Skeleton className="h-8 w-40 bg-sky-800/50" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-40 rounded-xl bg-sky-800/40" />
        <Skeleton className="h-40 rounded-xl bg-sky-800/40" />
      </div>
    </div>
  );
}
