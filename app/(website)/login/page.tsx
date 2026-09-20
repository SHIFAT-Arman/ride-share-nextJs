"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { z } from "zod";
import { authApi, dashboardPathForRole, type UserRole } from "@/api/auth";
import BorderGlow from "@/components/BorderGlow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Same-origin next only; riders may return to book-a-ride. */
function postLoginPath(role: UserRole, next: string | null): string {
  const dashboard = dashboardPathForRole(role);
  if (!next || !next.startsWith("/") || next.startsWith("//")) return dashboard;
  if (next === "/book-a-ride" && role === "rider") return next;
  if (next === dashboard) return next;
  return dashboard;
}

const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;
type FormErrors = Partial<Record<keyof LoginForm, string>>;

const fieldClass =
  "h-10 bg-white/5 border-white/10 text-[#eef3fb] placeholder:text-white/25 focus-visible:border-sky-700/60 focus-visible:ring-sky-700/25";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setAnimated(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof LoginForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setServerError("");

    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof LoginForm;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      // Role comes back in the login body so we do not need /auth/me here.
      const { data } = await authApi.login(result.data);
      const next = new URLSearchParams(window.location.search).get("next");
      const path = postLoginPath(data.role, next);
      if (path === "/login") {
        setServerError("Unknown account role. Contact support.");
        return;
      }
      router.push(path);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setServerError(
        axiosErr?.response?.data?.message ??
          (!axiosErr?.response
            ? "Cannot reach the API. Check network / API URL."
            : "Invalid credentials. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh items-center justify-center bg-[#070b14] px-4 pt-18 text-[#eef3fb]">
      <BorderGlow
        className="w-full max-w-md"
        backgroundColor="#030712"
        glowColor="42 90 70"
        colors={["#fbbf24", "#0B5A8E", "#c084fc"]}
        animated={animated}
      >
        <div className="p-8 sm:p-10">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-white/40">
            Portal
          </p>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-white/40">
            Sign in to access the Portal Dashboard
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            {serverError && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {serverError}
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs uppercase tracking-wider text-white/60"
              >
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                aria-invalid={!!errors.email}
                className={fieldClass}
              />
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-xs uppercase tracking-wider text-white/60"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  aria-invalid={!!errors.password}
                  className={`${fieldClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 transition-colors hover:text-white/60"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-2 h-10 w-full rounded-lg border-0 bg-sky-700 font-medium text-white hover:bg-sky-900"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Log In"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-white/30">
            Need an account?{" "}
            <Link
              href="/register"
              className="text-sky-700 transition-colors hover:text-sky-900"
            >
              Create one
            </Link>
          </p>
        </div>
      </BorderGlow>
    </div>
  );
}
