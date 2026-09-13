import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function AdminDetailSkeleton() {
  return (
    <Card className="border-sky-800/40 bg-sky-950/40 text-sky-50 shadow-none">
      <CardContent className="space-y-8 p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[auto_1fr_1fr]">
          <Skeleton className="size-40 rounded-xl bg-sky-800/40" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-24 bg-sky-800/40" />
            <Skeleton className="h-5 w-32 bg-sky-800/40" />
            <Skeleton className="h-4 w-24 bg-sky-800/40" />
            <Skeleton className="h-5 w-28 bg-sky-800/40" />
            <Skeleton className="mt-6 h-4 w-16 bg-sky-800/40" />
            <Skeleton className="h-5 w-48 bg-sky-800/40" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-3 w-16 bg-sky-800/40" />
                <Skeleton className="h-4 w-24 bg-sky-800/40" />
              </div>
            ))}
          </div>
        </div>
        <Separator className="bg-sky-800/40" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 rounded-md bg-sky-800/40" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
