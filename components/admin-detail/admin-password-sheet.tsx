"use client";

import { useState } from "react";
import { adminApi } from "@/api/admins";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Field, fieldClass } from "@/components/admin-detail/form-field";
import {
  emptyPassword,
  passwordSchema,
  type PasswordErrors,
  type PasswordForm,
} from "@/components/admin-detail/schema";

export function AdminPasswordSheet({ adminId }: { adminId: string }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyPassword);
  const [errors, setErrors] = useState<PasswordErrors>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const parsed = passwordSchema.safeParse(form);
    if (!parsed.success) {
      const next: PasswordErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !(key in next)) {
          next[key as keyof PasswordForm] = issue.message;
        }
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      await adminApi.changePassword(adminId, {
        oldPassword: parsed.data.oldPassword,
        newPassword: parsed.data.newPassword,
      });
      setMessage("Password updated.");
      setIsError(false);
      setForm(emptyPassword);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setMessage(
        axiosErr?.response?.data?.message ??
          "Could not update password. Check the fields and try again.",
      );
      setIsError(true);
    }
    setSaving(false);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setForm(emptyPassword);
          setErrors({});
          setMessage("");
        }
      }}
    >
      <SheetTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="border-sky-700/60 bg-transparent text-sky-100 hover:bg-sky-900/60"
          />
        }
      >
        Reset password
      </SheetTrigger>
      <SheetContent className="border-sky-800 bg-sky-950 text-sky-50">
        <SheetHeader>
          <SheetTitle className="text-sky-50">Reset password</SheetTitle>
          <SheetDescription className="text-sky-200/60">
            Enter the current password, then choose a new one.
          </SheetDescription>
        </SheetHeader>
        <form
          id="admin-password-form"
          noValidate
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col"
        >
          <div className="space-y-4 px-6">
            <Field
              id="oldPassword"
              label="Current password"
              error={errors.oldPassword}
            >
              <Input
                id="oldPassword"
                name="oldPassword"
                type="password"
                autoComplete="current-password"
                value={form.oldPassword}
                onChange={onChange}
                aria-invalid={!!errors.oldPassword}
                className={fieldClass}
              />
            </Field>
            <Field
              id="newPassword"
              label="New password"
              error={errors.newPassword}
            >
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                value={form.newPassword}
                onChange={onChange}
                aria-invalid={!!errors.newPassword}
                className={fieldClass}
              />
            </Field>
            <Field
              id="confirmPassword"
              label="Confirm password"
              error={errors.confirmPassword}
            >
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={onChange}
                aria-invalid={!!errors.confirmPassword}
                className={fieldClass}
              />
            </Field>
            {message && (
              <p
                className={`text-xs ${isError ? "text-red-400" : "text-emerald-400"}`}
              >
                {message}
              </p>
            )}
          </div>
          <SheetFooter>
            <Button
              type="submit"
              form="admin-password-form"
              disabled={saving}
              className="border-0 bg-sky-700 text-white hover:bg-sky-800"
            >
              {saving ? "Updating" : "Update password"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
