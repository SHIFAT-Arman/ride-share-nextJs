import { z } from "zod";
import type { Admin } from "@/types/admin";

const passwordRules = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[0-9]/, "Must contain at least one number")
  .regex(/[^a-zA-Z0-9]/, "Must contain at least one special character");

export const profileSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .regex(/^[A-Za-z\s'-]+$/, "First name can only contain letters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .regex(/^[A-Za-z\s'-]+$/, "Last name can only contain letters"),
  email: z.email("Enter a valid email address"),
  phoneNumber: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || /^[0-9+\-\s()]{7,20}$/.test(v),
      "Enter a valid phone number",
    ),
  country: z.string().trim().max(100, "Country is too long"),
  joiningDate: z
    .string()
    .refine(
      (v) => v === "" || !Number.isNaN(Date.parse(v)),
      "Enter a valid joining date",
    ),
  age: z
    .string()
    .trim()
    .refine((v) => {
      if (v === "") return true;
      const n = Number(v);
      return Number.isInteger(n) && n >= 18 && n <= 100;
    }, "Age must be between 18 and 100"),
});

export const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordRules,
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ProfileForm = z.infer<typeof profileSchema>;
export type PasswordForm = z.infer<typeof passwordSchema>;
export type ProfileErrors = Partial<Record<keyof ProfileForm, string>>;
export type PasswordErrors = Partial<Record<keyof PasswordForm, string>>;

export const emptyPassword: PasswordForm = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function display(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "Not set";
  return String(value);
}

export function toForm(admin: Admin): ProfileForm {
  return {
    firstName: admin.firstName,
    lastName: admin.lastName,
    email: admin.email,
    phoneNumber: admin.phoneNumber ?? "",
    country: admin.country ?? "",
    joiningDate: admin.joiningDate?.slice(0, 10) ?? "",
    age: admin.age?.toString() ?? "",
  };
}
