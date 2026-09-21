"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { z } from "zod";

import {
  authApi,
  dashboardPathForRole,
  type ApplyAsDriverRequest,
} from "@/api/auth";
import { riderApi } from "@/api/riders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToastManager } from "@/components/ui/toast";
import { AdminDetailSkeleton } from "@/components/admin-detail/admin-detail-skeleton";

const applySchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .regex(/^[A-Za-z\s'-]+$/, "First name can only contain letters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .regex(/^[A-Za-z\s'-]+$/, "Last name can only contain letters"),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .regex(/^[0-9+\-\s()]+$/, "Enter a valid phone number"),
  vehicleType: z.enum(["CAR", "BIKE", "CAR_XL"]),
  licensePlate: z.string().trim().min(2, "Enter a license plate"),
  seatingCapacity: z.coerce
    .number()
    .int("Seats must be a whole number")
    .min(1, "At least 1 seat")
    .max(12, "Too many seats"),
});

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  vehicleType: ApplyAsDriverRequest["vehicleType"] | "";
  licensePlate: string;
  seatingCapacity: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const fieldClass =
  "h-10 bg-white/5 border-sky-800/50 text-sky-50 placeholder:text-sky-200/30 focus-visible:border-sky-500/60 focus-visible:ring-sky-500/25";

const emptyForm: FormState = {
  firstName: "",
  lastName: "",
  phone: "",
  vehicleType: "",
  licensePlate: "",
  seatingCapacity: "4",
};

export default function ApplyDriverPage() {
  const router = useRouter();
  const { add: addToast } = useToastManager();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { data: session } = await authApi.me();
        if (session.role !== "rider") {
          router.replace(dashboardPathForRole(session.role));
          return;
        }
        const { data: rider } = await riderApi.getById(session.sub);
        if (cancelled) return;
        setForm((prev) => ({
          ...prev,
          firstName: rider.firstName ?? "",
          lastName: rider.lastName ?? "",
          phone: rider.phone ?? "",
        }));
      } catch {
        if (!cancelled) setServerError("Could not load your profile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    const parsed = applySchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormState;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setSaving(true);
    try {
      await authApi.applyAsDriver(parsed.data);
      addToast({ title: "You're a driver now", type: "success" });
      // Full navigation so portal shell reloads session with the new role cookie.
      window.location.assign("/portal/driver/dashboard");
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string | string[] } };
      };
      const raw = axiosErr?.response?.data?.message;
      const message =
        typeof raw === "string"
          ? raw
          : Array.isArray(raw)
            ? raw.join(", ")
            : "Could not submit application. Check the fields and try again.";
      setServerError(message);
      addToast({ title: message, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-xl">
        <AdminDetailSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6">
        <p className="font-mono text-xs tracking-[0.25em] text-sky-400 uppercase">
          Apply
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-sky-50">
          Become a driver
        </h1>
        <p className="mt-2 text-sm text-sky-200/60">
          Same login. Add your vehicle so you can go online and get matched.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border border-sky-800/40 bg-sky-950/40 p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sky-200/80">
              First name
            </Label>
            <Input
              id="firstName"
              name="firstName"
              value={form.firstName}
              onChange={onChange}
              className={fieldClass}
              autoComplete="given-name"
            />
            {errors.firstName && (
              <p className="text-xs text-red-400">{errors.firstName}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sky-200/80">
              Last name
            </Label>
            <Input
              id="lastName"
              name="lastName"
              value={form.lastName}
              onChange={onChange}
              className={fieldClass}
              autoComplete="family-name"
            />
            {errors.lastName && (
              <p className="text-xs text-red-400">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sky-200/80">
            Phone
          </Label>
          <Input
            id="phone"
            name="phone"
            value={form.phone}
            onChange={onChange}
            className={fieldClass}
            autoComplete="tel"
          />
          {errors.phone && (
            <p className="text-xs text-red-400">{errors.phone}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="vehicleType" className="text-sky-200/80">
              Vehicle type
            </Label>
            <select
              id="vehicleType"
              name="vehicleType"
              value={form.vehicleType}
              onChange={onChange}
              className={`w-full rounded-md border px-3 text-sm ${fieldClass}`}
            >
              <option value="" disabled>
                Select type
              </option>
              <option value="CAR">Car</option>
              <option value="CAR_XL">Car XL</option>
              <option value="BIKE">Bike</option>
            </select>
            {errors.vehicleType && (
              <p className="text-xs text-red-400">{errors.vehicleType}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="seatingCapacity" className="text-sky-200/80">
              Seats
            </Label>
            <Input
              id="seatingCapacity"
              name="seatingCapacity"
              type="number"
              min={1}
              max={12}
              value={form.seatingCapacity}
              onChange={onChange}
              className={fieldClass}
            />
            {errors.seatingCapacity && (
              <p className="text-xs text-red-400">{errors.seatingCapacity}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="licensePlate" className="text-sky-200/80">
            License plate
          </Label>
          <Input
            id="licensePlate"
            name="licensePlate"
            value={form.licensePlate}
            onChange={onChange}
            className={fieldClass}
            placeholder="e.g. DHA-1234"
          />
          {errors.licensePlate && (
            <p className="text-xs text-red-400">{errors.licensePlate}</p>
          )}
        </div>

        {serverError && (
          <p className="text-sm text-red-400">{serverError}</p>
        )}

        <Button
          type="submit"
          disabled={saving}
          className="w-full bg-sky-700 text-white hover:bg-sky-800"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Submitting…
            </>
          ) : (
            "Submit application"
          )}
        </Button>
      </form>
    </div>
  );
}
