"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/api/admins";
import type { Admin } from "@/types/admin";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AdminPasswordSheet } from "@/components/admin-detail/admin-password-sheet";
import { Field, MetaRow, fieldClass } from "@/components/admin-detail/form-field";
import {
  display,
  formatDate,
  profileSchema,
  toForm,
  type ProfileErrors,
  type ProfileForm,
} from "@/components/admin-detail/schema";

export function AdminDetailCard({
  admin,
  adminId,
  onSaved,
}: {
  admin: Admin;
  adminId: string;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<ProfileForm>(() => toForm(admin));
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [pfpUrl, setPfpUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let objectUrl: string | undefined;
    let cancelled = false;

    adminApi
      .getProfilePictureById(adminId)
      .then((pic) => {
        objectUrl = URL.createObjectURL(pic.data);
        if (cancelled) {
          URL.revokeObjectURL(objectUrl);
          return;
        }
        setPfpUrl(objectUrl);
      })
      .catch(() => {
        // no picture on file — fallback initials
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [adminId]);

  const initials =
    `${admin.firstName[0] ?? ""}${admin.lastName[0] ?? ""}`.toUpperCase();

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
      await adminApi.uploadProfilePicture(adminId, formData);

      const pic = await adminApi.getProfilePictureById(adminId);
      const nextUrl = URL.createObjectURL(pic.data);
      setPfpUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return nextUrl;
      });

      setMessage("Picture updated.");
      setIsError(false);
    } catch {
      setMessage("Upload failed.");
      setIsError(true);
    }

    setUploading(false);
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setMessage("");
    const parsed = profileSchema.safeParse(form);
    if (!parsed.success) {
      const next: ProfileErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !(key in next)) {
          next[key as keyof ProfileForm] = issue.message;
        }
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      const data = parsed.data;
      await adminApi.update(adminId, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        country: data.country || undefined,
        phoneNumber: data.phoneNumber || undefined,
        joiningDate: data.joiningDate || undefined,
        age: data.age ? Number(data.age) : undefined,
      });
      setForm(data);
      setMessage("Saved changes.");
      setIsError(false);
      onSaved();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setMessage(
        axiosErr?.response?.data?.message ??
          "Save failed. Check the fields and try again.",
      );
      setIsError(true);
    }
    setSaving(false);
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
                  alt={`${admin.firstName} ${admin.lastName}`}
                  className="rounded-xl"
                />
              ) : null}
              <AvatarFallback className="rounded-xl bg-sky-400/40 text-2xl font-semibold text-sky-50">
                {initials}
              </AvatarFallback>
            </Avatar>

            <FileUpload onChange={handleImageChange} />
          </div>

          <div className="flex min-h-40 flex-col justify-between gap-6">
            <div className="space-y-4">
              <MetaRow label="First name" value={admin.firstName} />
              <MetaRow label="Last name" value={admin.lastName} />
            </div>
            <MetaRow label="Email" value={admin.email} />
          </div>

          <div className="space-y-4">
            <MetaRow label="Age" value={display(admin.age)} />
            <MetaRow label="Country" value={display(admin.country)} />
            <MetaRow label="Phone" value={display(admin.phoneNumber)} />
            <MetaRow
              label="Joining date"
              value={
                admin.joiningDate ? formatDate(admin.joiningDate) : "Not set"
              }
            />
          </div>
        </div>

        <Separator className="bg-sky-800/40" />

        <form id="admin-profile-form" noValidate onSubmit={handleSubmit}>
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
            <Field id="phoneNumber" label="Phone" error={errors.phoneNumber}>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={onChange}
                aria-invalid={!!errors.phoneNumber}
                className={fieldClass}
              />
            </Field>
            <Field id="country" label="Country" error={errors.country}>
              <Input
                id="country"
                name="country"
                value={form.country}
                onChange={onChange}
                aria-invalid={!!errors.country}
                className={fieldClass}
              />
            </Field>
            <Field id="age" label="Age" error={errors.age}>
              <Input
                id="age"
                name="age"
                type="number"
                min={18}
                max={100}
                value={form.age}
                onChange={onChange}
                aria-invalid={!!errors.age}
                className={fieldClass}
              />
            </Field>
            <Field
              id="joiningDate"
              label="Joining date"
              error={errors.joiningDate}
            >
              <Input
                id="joiningDate"
                name="joiningDate"
                type="date"
                value={form.joiningDate}
                onChange={onChange}
                aria-invalid={!!errors.joiningDate}
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
        <AdminPasswordSheet adminId={adminId} />
        <Button
          type="submit"
          form="admin-profile-form"
          disabled={saving}
          className="border-0 bg-sky-700 text-white hover:bg-sky-800 active:translate-y-px"
        >
          {saving ? "Saving" : "Save changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}
