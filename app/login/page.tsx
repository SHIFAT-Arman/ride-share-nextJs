"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff, Loader2 } from "lucide-react";
import { z } from "zod";
import { adminApi } from "@/api/admins";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;
type FormErrors = Partial<Record<keyof LoginForm, string>>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof LoginForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      const response = await adminApi.login({
        ...result.data,
      });

      router.push("/admin/dashboard");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setServerError(
        axiosErr?.response?.data?.message ??
          "Invalid credentials. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      {/* Background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% -10%, rgba(79,70,229,0.14), transparent)",
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center px-8 py-6 border-b border-white/5">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold tracking-widest uppercase text-white/50 group-hover:text-white/70 transition-colors">
            RideShare Admin
          </span>
        </Link>
      </header>

      {/* Form */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
            <p className="text-white/40 text-sm">
              Sign in to access the operations dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {serverError && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {serverError}
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-white/60 text-xs uppercase tracking-wider"
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
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:border-indigo-500/50 focus-visible:ring-indigo-500/20 h-10"
              />
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-white/60 text-xs uppercase tracking-wider"
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
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:border-indigo-500/50 focus-visible:ring-indigo-500/20 h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
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
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg border-0 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-white/30">
            Need an admin account?{" "}
            <Link
              href="/admin/register"
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
