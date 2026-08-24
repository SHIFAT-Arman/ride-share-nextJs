import Link from "next/link";
import { Shield, Users, BarChart3, ArrowRight } from "lucide-react";

export default function AdminLandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden">
      {/* Dot-grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Indigo radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(79,70,229,0.18), transparent)",
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold tracking-widest uppercase text-white/50">
            RideShare
          </span>
        </div>
        <span className="text-xs text-white/25 font-mono tracking-wider">
          Operations Portal
        </span>
      </header>

      {/* Main */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-16">
        {/* Status badge */}
        <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs text-indigo-300 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Secure administrator access
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-7xl font-bold text-center leading-none tracking-tight mb-5 max-w-3xl">
          Control every{" "}
          <span
            style={{
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              backgroundImage: "linear-gradient(135deg, #818cf8, #38bdf8)",
            }}
          >
            ride.
          </span>
        </h1>

        <p className="text-white/35 text-center text-base sm:text-lg max-w-sm mb-14 leading-relaxed">
          The unified operations dashboard for RideShare&nbsp;administrators —
          manage users, monitor activity, and enforce policies.
        </p>

        {/* Action cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
          <Link href="/admin/login" className="group block">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-200 hover:border-indigo-500/40 hover:bg-indigo-500/5 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-0.5">
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-indigo-400" />
                </div>
                <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-200" />
              </div>
              <h3 className="font-semibold text-white mb-1">Sign In</h3>
              <p className="text-sm text-white/35">Access your admin account</p>
            </div>
          </Link>

          <Link href="/admin/register" className="group block">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-200 hover:border-sky-500/40 hover:bg-sky-500/5 hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-0.5">
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-sky-400" />
                </div>
                <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-sky-400 group-hover:translate-x-1 transition-all duration-200" />
              </div>
              <h3 className="font-semibold text-white mb-1">Create Account</h3>
              <p className="text-sm text-white/35">
                Register a new administrator
              </p>
            </div>
          </Link>
        </div>

        {/* Feature row */}
        <div className="mt-20 flex flex-wrap items-center justify-center gap-6 text-xs text-white/20">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-3 h-3" />
            <span>Live metrics</span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-2">
            <Users className="w-3 h-3" />
            <span>Role-based access</span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3" />
            <span>JWT secured</span>
          </div>
        </div>
      </main>
    </div>
  );
}
