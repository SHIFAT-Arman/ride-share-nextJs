import Link from "next/link";
import { Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onLogout: () => void;
}

export function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-8 py-4 border-b border-white/5 bg-neutral-950/80 backdrop-blur-md">
      <Link href="/admin" className="flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-semibold tracking-widest uppercase text-white/50">
          RideShare Admin
        </span>
      </Link>

      <Button
        onClick={onLogout}
        variant="ghost"
        size="sm"
        className="text-white/40 hover:text-white/80 hover:bg-white/5 gap-2"
      >
        <LogOut className="w-4 h-4" />
        Sign out
      </Button>
    </header>
  );
}
