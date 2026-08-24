import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardToolbarProps {
  count: number;
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
}

export function DashboardToolbar({
  count,
  loading,
  refreshing,
  onRefresh,
}: DashboardToolbarProps) {
  const subtitle = loading
    ? "Loading…"
    : `${count} administrator${count !== 1 ? "s" : ""} registered`;

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold">Administrators</h1>
        <p className="text-white/35 text-sm mt-1">{subtitle}</p>
      </div>

      <Button
        onClick={onRefresh}
        variant="outline"
        size="sm"
        disabled={refreshing || loading}
        className="gap-2 border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
        Refresh
      </Button>
    </div>
  );
}
