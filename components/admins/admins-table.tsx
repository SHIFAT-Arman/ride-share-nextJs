"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminApi, type CreateRequest } from "@/api/admins";
import type { Admin } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToastManager } from "@/components/ui/toast";

const fieldClass =
  "h-10 bg-white/5 border-sky-800/50 text-sky-50 placeholder:text-sky-200/30 focus-visible:border-sky-500/60 focus-visible:ring-sky-500/25";

const emptyForm: CreateRequest = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  country: "",
  phoneNumber: "",
};

function joined(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function AdminsTable({ admins }: { admins: Admin[] }) {
  const router = useRouter();
  const { add: addToast } = useToastManager();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [age, setAge] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await adminApi.create({
        ...form,
        country: form.country || undefined,
        phoneNumber: form.phoneNumber || undefined,
        age: age ? Number(age) : undefined,
      });
      setForm(emptyForm);
      setAge("");
      setOpen(false);
      addToast({ title: "Admin added", type: "success" });
      router.refresh();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const message =
        axiosErr?.response?.data?.message ??
        "Could not add admin. Check the fields and try again.";
      setError(message);
      addToast({ title: message, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (admin: Admin) => {
    if (
      !confirm(
        `Delete ${admin.firstName} ${admin.lastName}? This cannot be undone.`,
      )
    ) {
      return;
    }
    setDeletingId(admin.id);
    try {
      await adminApi.deleteAdmin(admin.id);
      addToast({ title: "Admin deleted", type: "success" });
      router.refresh();
    } catch {
      addToast({ title: "Could not delete admin. Try again.", type: "error" });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.25em] text-sky-400 uppercase">
            Operators
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-sky-50">
            Admins
          </h1>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button className="bg-sky-700 text-white hover:bg-sky-800" />
            }
          >
            Add admin
          </SheetTrigger>
          <SheetContent className="bg-sky-950 text-sky-50 border-sky-800">
            <SheetHeader>
              <SheetTitle className="text-sky-50">Add admin</SheetTitle>
              <SheetDescription className="text-sky-200/60">
                Creates a portal operator with the fields below.
              </SheetDescription>
            </SheetHeader>
            <form
              onSubmit={handleCreate}
              autoComplete="off"
              className="flex flex-1 flex-col"
            >
              <div className="space-y-4 px-6">
                {error && open && (
                  <p className="text-sm text-red-400">{error}</p>
                )}
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    autoComplete="off"
                    required
                    value={form.firstName}
                    onChange={onChange}
                    className={fieldClass}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    autoComplete="off"
                    required
                    value={form.lastName}
                    onChange={onChange}
                    className={fieldClass}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="off"
                    required
                    value={form.email}
                    onChange={onChange}
                    className={fieldClass}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={form.password}
                    onChange={onChange}
                    className={fieldClass}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    autoComplete="off"
                    value={form.country}
                    onChange={onChange}
                    className={fieldClass}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phoneNumber">Phone</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    autoComplete="off"
                    value={form.phoneNumber}
                    onChange={onChange}
                    className={fieldClass}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    autoComplete="off"
                    min={18}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className={fieldClass}
                  />
                </div>
              </div>
              <SheetFooter>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-sky-700 text-white hover:bg-sky-800"
                >
                  {saving ? "Adding…" : "Add admin"}
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {admins.length === 0 ? (
        <p className="rounded-xl border border-sky-800/40 px-6 py-16 text-center text-sm text-sky-200/50">
          No admins yet. Add an operator to get started.
        </p>
      ) : (
        <Table className="border-sky-800/40">
          <TableHeader>
            <TableRow className="border-sky-800/40 hover:bg-transparent">
              <TableHead className="text-sky-200/70">Name</TableHead>
              <TableHead className="text-sky-200/70">Email</TableHead>
              <TableHead className="text-sky-200/70">Country</TableHead>
              <TableHead className="text-sky-200/70">Phone</TableHead>
              <TableHead className="text-sky-200/70">Joined</TableHead>
              <TableHead className="text-right text-sky-200/70">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin) => (
              <TableRow
                key={admin.id}
                className="border-sky-800/40 hover:bg-sky-950/40"
              >
                <TableCell className="font-medium text-sky-50">
                  {admin.firstName} {admin.lastName}
                </TableCell>
                <TableCell className="text-sky-100/80">{admin.email}</TableCell>
                <TableCell>{admin.country || "—"}</TableCell>
                <TableCell>{admin.phoneNumber || "—"}</TableCell>
                <TableCell className="font-mono text-xs">
                  {joined(admin.joiningDate)}
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/portal/admin/${admin.id}`}
                    className="inline-flex h-8 items-center rounded-4xl px-3 text-sm text-sky-300 hover:bg-sky-900/50 hover:text-sky-100"
                  >
                    Edit
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={deletingId === admin.id}
                    onClick={() => handleDelete(admin)}
                    className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  >
                    {deletingId === admin.id ? "Deleting…" : "Delete"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
