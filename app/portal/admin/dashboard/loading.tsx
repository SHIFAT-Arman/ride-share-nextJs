import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="rounded-xl border border-sky-800/60 bg-[#082f49] p-6">
      <Skeleton className="h-6 w-28 bg-sky-800/50" />
      <Skeleton className="mt-2 h-4 w-72 max-w-full bg-sky-800/40" />
      <div className="mt-8 grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_12rem]">
        <Skeleton className="mx-auto size-[220px] rounded-full bg-sky-800/40" />
        <div className="grid gap-4">
          <Skeleton className="h-7 bg-sky-800/40" />
          <Skeleton className="h-7 bg-sky-800/40" />
          <Skeleton className="h-7 bg-sky-800/40" />
          <Skeleton className="h-7 bg-sky-800/40" />
        </div>
      </div>
    </div>
  );
}
