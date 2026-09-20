"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import type { Rider } from "@/api/riders";
import { riderApi } from "@/api/riders";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToastManager } from "@/components/ui/toast";
import { Field, MetaRow, fieldClass } from "@/components/admin-detail/form-field";
import { display } from "@/components/admin-detail/schema";
import { pictureSrc } from "@/lib/media";

const schema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .regex(/^[A-Za-z\s'-]+$/, "First name can only contain letters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .regex(/^[A-Za-z\s'-]+$/, "Last name can only contain letters"),
  email: z.email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .regex(/^[0-9+\-\s()]{7,20}$/, "Enter a valid phone number"),
});

type Form = z.infer<typeof schema>;
type FormErrors = Partial<Record<keyof Form, string>>;

function toForm(rider: Rider): Form {
  return {
    firstName: rider.firstName,
    lastName: rider.lastName,
    email: rider.email ?? "",
    phone: rider.phone ?? "",
  };
}

export function RiderProfileCard({
  rider,
  onSaved,
  canManageStatus = false,
}: {
  rider: Rider;
  onSaved: () => void;
  canManageStatus?: boolean;
}) {
  const { add: addToast } = useToastManager();
  const [form, setForm] = useState<Form>(() => toForm(rider));
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [pfpUrl, setPfpUrl] = useState<string | undefined>(
    () => pictureSrc(rider.profilePictureUrl ?? null),
  );
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setForm(toForm(rider));
    setPfpUrl(pictureSrc(rider.profilePictureUrl ?? null));
  }, [rider]);

  const initials =
    `${rider.firstName[0] ?? ""}${rider.lastName[0] ?? ""}`.toUpperCase();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (files: File[]) => {
    const file = files[0];
    if (!file || uploading) return;

    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    setMessage("");

    try {
      const { data } = await riderApi.uploadProfilePicture(rider.id, formData);
      setPfpUrl(pictureSrc(data.profilePictureUrl ?? null));
      setMessage("Picture updated.");
      setIsError(false);
      onSaved();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setMessage(axiosErr?.response?.data?.message ?? "Upload failed.");
      setIsError(true);
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setMessage("");
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const next: FormErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !(key in next)) {
          next[key as keyof Form] = issue.message;
        }
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      await riderApi.update(rider.id, parsed.data);
      addToast({ title: "Profile updated", type: "success" });
      onSaved();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      addToast({
        title:
          axiosErr?.response?.data?.message ??
          "Save failed. Check the fields and try again.",
        type: "error",
      });
    }
    setSaving(false);
  };

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const status = e.target.value as Rider["status"];
    if (status === rider.status) return;
    setStatusSaving(true);
    try {
      await riderApi.updateStatus(rider.id, { status });
      addToast({ title: "Status updated", type: "success" });
      onSaved();
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string | string[] } };
      };
      const raw = axiosErr?.response?.data?.message;
      const title = Array.isArray(raw)
        ? raw.join(", ")
        : (raw ?? "Could not update status.");
      addToast({ title, type: "error" });
    }
    setStatusSaving(false);
  };

  return (
    <Card className="border-sky-800/40 bg-sky-950/40 text-sky-50 shadow-none">
      <CardContent className="space-y-8 p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[auto_1fr_1fr] md:items-start">
          <div className="flex flex-col gap-3">
            <Avatar className="size-40 rounded-xl after:rounded-xl">
              {pfpUrl ? (
                <AvatarImage
                  src={pfpUrl}
                  alt={`${rider.firstName} ${rider.lastName}`}
                  className="rounded-xl"
                />
              ) : null}
              <AvatarFallback className="rounded-xl bg-sky-400/40 text-2xl font-semibold text-sky-50">
                {initials}
              </AvatarFallback>
            </Avatar>
            <FileUpload onChange={handleImageChange} />
          </div>

          <div className="space-y-4">
            <MetaRow label="First name" value={rider.firstName} />
            <MetaRow label="Last name" value={rider.lastName} />
            <MetaRow label="Email" value={display(rider.email)} />
          </div>

          <div className="space-y-4">
            <MetaRow label="Phone" value={display(rider.phone)} />
            {canManageStatus ? (
              <div className="space-y-1.5">
                <p className="text-xs tracking-wide text-sky-200/50 uppercase">
                  Status
                </p>
                <select
                  value={rider.status}
                  disabled={statusSaving}
                  onChange={handleStatusChange}
                  className={`${fieldClass} w-full rounded-md border px-3 text-sm`}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                  <option value="PENDING_VERIFICATION">
                    PENDING_VERIFICATION
                  </option>
                </select>
              </div>
            ) : (
              <MetaRow label="Status" value={display(rider.status)} />
            )}
            <MetaRow label="Age" value={display(rider.age)} />
          </div>
        </div>

        <Separator className="bg-sky-800/40" />

        <form id="rider-profile-form" noValidate onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field id="firstName" label="First name" error={errors.firstName}>
              <Input
                id="firstName"
                name="firstName"
                value={form.firstName}
                onChange={onChange}
                aria-invalid={!!errors.firstName}
                className={fieldClass}
              />
            </Field>
            <Field id="lastName" label="Last name" error={errors.lastName}>
              <Input
                id="lastName"
                name="lastName"
                value={form.lastName}
                onChange={onChange}
                aria-invalid={!!errors.lastName}
                className={fieldClass}
              />
            </Field>
            <Field id="email" label="Email" error={errors.email}>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                aria-invalid={!!errors.email}
                className={fieldClass}
              />
            </Field>
            <Field id="phone" label="Phone" error={errors.phone}>
              <Input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={onChange}
                aria-invalid={!!errors.phone}
                className={fieldClass}
              />
            </Field>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col items-stretch gap-3 p-6 pt-0 sm:flex-row sm:items-center sm:justify-end">
        {message && (
          <p
            className={`mr-auto text-xs ${isError ? "text-red-400" : "text-emerald-400"}`}
          >
            {message}
          </p>
        )}
        <Button
          type="submit"
          form="rider-profile-form"
          disabled={saving}
          className="border-0 bg-sky-700 text-white hover:bg-sky-800 active:translate-y-px"
        >
          {saving ? "Saving" : "Save changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}
