import { Label } from "@/components/ui/label";

export const fieldClass =
  "h-10 border-sky-800/50 bg-white/5 text-sky-50 placeholder:text-sky-200/30 focus-visible:border-sky-500/60 focus-visible:ring-sky-500/25";

export function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 space-y-1">
      <p className="text-xs text-sky-200/50">{label}</p>
      <p className="break-words text-sm text-sky-50">{value}</p>
    </div>
  );
}

export function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sky-200/70">
        {label}
      </Label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
