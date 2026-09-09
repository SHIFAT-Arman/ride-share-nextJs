"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff, Loader2 } from "lucide-react";
import { z } from "zod";
import { adminApi } from "@/api/admins";
import { AdminRole } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .regex(/^[A-Za-z\s'-]+$/, "First name can only contain letters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .regex(/^[A-Za-z\s'-]+$/, "Last name can only contain letters"),
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Must contain at least one special character"),
  role: z.string().min(1, "Select a role"),
  age: z.coerce
    .number()
    .int("Age must be a whole number")
    .min(18, "Must be at least 18 years old")
    .max(100, "Enter a valid age"),
});

type RegisterFormState = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  age: string;
};

type FormErrors = Partial<Record<keyof RegisterFormState, string>>;

const ROLE_OPTIONS = [
  { value: AdminRole.ADMIN, label: "Admin" },
  { value: AdminRole.SUPER_ADMIN, label: "Super Admin" },
  { value: AdminRole.SUPPORT_AGENT, label: "Support Agent" },
];

export default function AdminRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterFormState>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: AdminRole.ADMIN,
    age: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof RegisterFormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof RegisterFormState;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      await adminApi.register(result.data);
      router.push("/login");
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: {
          data?: {
            message?:
              | string
              | Array<{
                  property: string;
                  constraints?: Record<string, string>;
                }>;
          };
        };
      };

      const message = axiosErr?.response?.data?.message;

      if (typeof message === "string") {
        setServerError(message);
      } else if (Array.isArray(message) && message.length > 0) {
        const firstError = message[0];

        const validationMessage = firstError.constraints
          ? Object.values(firstError.constraints)[0]
          : "Registration failed. Please check your input.";

        setServerError(validationMessage);
      } else {
        setServerError("Registration failed. Please try again.");
      }
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
            <h1 className="text-2xl font-bold mb-2">Create admin account</h1>
            <p className="text-white/40 text-sm">
              Register a new administrator for the operations portal
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {serverError && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {serverError}
              </div>
            )}

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="firstName"
                  className="text-white/60 text-xs uppercase tracking-wider"
                >
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  value={form.firstName}
                  onChange={handleChange}
                  aria-invalid={!!errors.firstName}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:border-indigo-500/50 focus-visible:ring-indigo-500/20 h-10"
                />
                {errors.firstName && (
                  <p className="text-xs text-red-400">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="lastName"
                  className="text-white/60 text-xs uppercase tracking-wider"
                >
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={form.lastName}
                  onChange={handleChange}
                  aria-invalid={!!errors.lastName}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:border-indigo-500/50 focus-visible:ring-indigo-500/20 h-10"
                />
                {errors.lastName && (
                  <p className="text-xs text-red-400">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
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

            {/* Password */}
            <div className="space-y-1.5">
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
                  autoComplete="new-password"
                  placeholder="Min. 8 chars, 1 uppercase, 1 number, 1 symbol"
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

            {/* Role + Age row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="role"
                  className="text-white/60 text-xs uppercase tracking-wider"
                >
                  Role
                </Label>
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50"
                >
                  {ROLE_OPTIONS.map(({ value, label }) => (
                    <option
                      key={value}
                      value={value}
                      className="bg-neutral-900 text-white"
                    >
                      {label}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="text-xs text-red-400">{errors.role}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="age"
                  className="text-white/60 text-xs uppercase tracking-wider"
                >
                  Age
                </Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  placeholder="30"
                  min={18}
                  max={100}
                  value={form.age}
                  onChange={handleChange}
                  aria-invalid={!!errors.age}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:border-indigo-500/50 focus-visible:ring-indigo-500/20 h-10"
                />
                {errors.age && (
                  <p className="text-xs text-red-400">{errors.age}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg border-0 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creating account…
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-white/30">
            Already have an account?{" "}
            <Link
              href="/admin/login"
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
