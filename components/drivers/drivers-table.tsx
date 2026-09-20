"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  driverApi,
  type CreateDriverDto,
  type Driver,
} from "@/api/drivers";
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

const emptyForm: CreateDriverDto = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  phone: "",
};

export function DriversTable({ drivers }: { drivers: Driver[] }) {
  const router = useRouter();
  const { add: addToast } = useToastManager();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
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
      await driverApi.create(form);
      setForm(emptyForm);
      setOpen(false);
      addToast({ title: "Driver added", type: "success" });
      router.refresh();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const message =
        axiosErr?.response?.data?.message ??
        "Could not add driver. Check the fields and try again.";
      setError(typeof message === "string" ? message : "Could not add driver.");
      addToast({
        title: typeof message === "string" ? message : "Could not add driver.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (driver: Driver) => {
    if (
      !confirm(
        `Delete ${driver.firstName} ${driver.lastName}? This cannot be undone.`,
      )
    ) {
      return;
    }
    setDeletingId(driver.id);
    try {
      await driverApi.delete(driver.id);
      addToast({ title: "Driver deleted", type: "success" });
      router.refresh();
    } catch {
      addToast({ title: "Could not delete driver. Try again.", type: "error" });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.25em] text-sky-400 uppercase">
            Accounts
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-sky-50">
            Drivers
          </h1>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button className="bg-sky-700 text-white hover:bg-sky-800" />
            }
          >
            Add driver
          </SheetTrigger>
          <SheetContent className="bg-sky-950 text-sky-50 border-sky-800">
            <SheetHeader>
              <SheetTitle className="text-sky-50">Add driver</SheetTitle>
              <SheetDescription className="text-sky-200/60">
                Creates a driver account. Status starts as pending verification.
                Password needs upper, lower, number, and special character.
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
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    autoComplete="off"
                    required
                    value={form.phone}
                    onChange={onChange}
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
                  {saving ? "Adding…" : "Add driver"}
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {drivers.length === 0 ? (
        <p className="rounded-xl border border-sky-800/40 px-6 py-16 text-center text-sm text-sky-200/50">
          No drivers yet. Add a driver to get started.
        </p>
      ) : (
        <Table className="border-sky-800/40">
          <TableHeader>
            <TableRow className="border-sky-800/40 hover:bg-transparent">
              <TableHead className="text-sky-200/70">Name</TableHead>
              <TableHead className="text-sky-200/70">Email</TableHead>
              <TableHead className="text-sky-200/70">Phone</TableHead>
              <TableHead className="text-sky-200/70">Status</TableHead>
              <TableHead className="text-right text-sky-200/70">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drivers.map((driver) => (
              <TableRow
                key={driver.id}
                className="border-sky-800/40 hover:bg-sky-950/40"
              >
                <TableCell className="font-medium text-sky-50">
                  {driver.firstName} {driver.lastName}
                </TableCell>
                <TableCell className="text-sky-100/80">
                  {driver.email || "—"}
                </TableCell>
                <TableCell>{driver.phone || "—"}</TableCell>
                <TableCell className="font-mono text-xs">
                  {driver.status}
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/portal/admin/drivers/${driver.id}`}
                    className="inline-flex h-8 items-center rounded-4xl px-3 text-sm text-sky-300 hover:bg-sky-900/50 hover:text-sky-100"
                  >
                    Edit
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={deletingId === driver.id}
                    onClick={() => handleDelete(driver)}
                    className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  >
                    {deletingId === driver.id ? "Deleting…" : "Delete"}
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
