// Shown while the API call is in-flight — matches the 2-column card layout exactly.
export function AdminDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
      {/* Left column */}
      <div className="space-y-6">
        {/* Profile card */}
        <div className="rounded-2xl border border-white/8 bg-white/3 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-xl bg-white/8" />
            <div className="space-y-2.5">
              <div className="h-4 w-36 bg-white/8 rounded-full" />
              <div className="h-3 w-20 bg-white/8 rounded-full" />
            </div>
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between py-3 border-b border-white/5 last:border-0">
              <div className="h-3 w-14 bg-white/8 rounded-full" />
              <div className="h-3 w-28 bg-white/8 rounded-full" />
            </div>
          ))}
        </div>

        {/* Announcement card */}
        <div className="rounded-2xl border border-white/8 bg-white/3 p-6 space-y-4">
          <div className="h-3 w-36 bg-white/8 rounded-full" />
          <div className="h-10 bg-white/8 rounded-md" />
          <div className="h-24 bg-white/8 rounded-md" />
          <div className="h-10 bg-white/8 rounded-md" />
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-6">
        {/* Update card */}
        <div className="rounded-2xl border border-white/8 bg-white/3 p-6 space-y-4">
          <div className="h-3 w-24 bg-white/8 rounded-full" />
          <div className="h-10 bg-white/8 rounded-md" />
          <div className="h-10 bg-white/8 rounded-md" />
          <div className="h-10 bg-white/8 rounded-md" />
          <div className="h-10 bg-white/8 rounded-md" />
        </div>

        {/* Profile picture card */}
        <div className="rounded-2xl border border-white/8 bg-white/3 p-6 space-y-4">
          <div className="h-3 w-28 bg-white/8 rounded-full" />
          <div className="h-10 bg-white/8 rounded-md" />
          <div className="h-10 bg-white/8 rounded-md" />
        </div>

        {/* Delete card */}
        <div className="rounded-2xl border border-red-500/10 bg-red-500/3 p-6 space-y-4">
          <div className="h-3 w-24 bg-white/8 rounded-full" />
          <div className="h-4 w-full bg-white/5 rounded-full" />
          <div className="h-10 bg-red-500/10 rounded-md" />
        </div>
      </div>
    </div>
  );
}
