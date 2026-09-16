"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import type { Driver } from "@/api/drivers";
import { driverApi } from "@/api/drivers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToastManager } from "@/components/ui/toast";
import { Field, MetaRow, fieldClass } from "@/components/admin-detail/form-field";
import { display, pictureSrc } from "@/components/admin-detail/schema";

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

function toForm(driver: Driver): Form {
  return {
    firstName: driver.firstName,
    lastName: driver.lastName,
    email: driver.email ?? "",
    phone: driver.phone ?? "",
  };
}

export function DriverProfileCard({
  driver,
  onSaved,
}: {
  driver: Driver;
  onSaved: () => void;
}) {
  const { add: addToast } = useToastManager();
  const [form, setForm] = useState<Form>(() => toForm(driver));
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [pfpUrl, setPfpUrl] = useState<string | undefined>(
    () => pictureSrc(driver.profilePictureUrl ?? null),
  );
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setForm(toForm(driver));
    setPfpUrl(pictureSrc(driver.profilePictureUrl ?? null));
  }, [driver]);

  const initials =
    `${driver.firstName[0] ?? ""}${driver.lastName[0] ?? ""}`.toUpperCase();

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
      const { data } = await driverApi.uploadProfilePicture(
        driver.id,
        formData,
      );
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
      await driverApi.update(driver.id, parsed.data);
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

  return (
    <Card className="border-sky-800/40 bg-sky-950/40 text-sky-50 shadow-none">
      <CardContent className="space-y-8 p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[auto_1fr_1fr] md:items-start">
          <div className="flex flex-col gap-3">
            <Avatar className="size-40 rounded-xl after:rounded-xl">
              {pfpUrl ? (
                <AvatarImage
                  src={pfpUrl}
                  alt={`${driver.firstName} ${driver.lastName}`}
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
            <MetaRow label="First name" value={driver.firstName} />
            <MetaRow label="Last name" value={driver.lastName} />
            <MetaRow label="Email" value={display(driver.email)} />
          </div>

          <div className="space-y-4">
            <MetaRow label="Phone" value={display(driver.phone)} />
            <MetaRow label="Status" value={display(driver.status)} />
          </div>
        </div>

        <Separator className="bg-sky-800/40" />

        <form id="driver-profile-form" noValidate onSubmit={handleSubmit}>
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
          form="driver-profile-form"
          disabled={saving}
          className="border-0 bg-sky-700 text-white hover:bg-sky-800 active:translate-y-px"
        >
          {saving ? "Saving" : "Save changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}
