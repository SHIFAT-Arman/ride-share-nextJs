"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  riderApi,
  type CreateRiderDto,
  type Rider,
} from "@/api/riders";
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

const emptyForm: CreateRiderDto = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  phone: "",
};

export function RidersTable({ riders }: { riders: Rider[] }) {
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
      await riderApi.create({
        ...form,
        age: age ? Number(age) : undefined,
      });
      setForm(emptyForm);
      setAge("");
      setOpen(false);
      addToast({ title: "Rider added", type: "success" });
      router.refresh();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const message =
        axiosErr?.response?.data?.message ??
        "Could not add rider. Check the fields and try again.";
      setError(typeof message === "string" ? message : "Could not add rider.");
      addToast({
        title: typeof message === "string" ? message : "Could not add rider.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (rider: Rider) => {
    if (
      !confirm(
        `Delete ${rider.firstName} ${rider.lastName}? This cannot be undone.`,
      )
    ) {
      return;
    }
    setDeletingId(rider.id);
    try {
      await riderApi.delete(rider.id);
      addToast({ title: "Rider deleted", type: "success" });
      router.refresh();
    } catch {
      addToast({ title: "Could not delete rider. Try again.", type: "error" });
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
            Riders
          </h1>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button className="bg-sky-700 text-white hover:bg-sky-800" />
            }
          >
            Add rider
          </SheetTrigger>
          <SheetContent className="bg-sky-950 text-sky-50 border-sky-800">
            <SheetHeader>
              <SheetTitle className="text-sky-50">Add rider</SheetTitle>
              <SheetDescription className="text-sky-200/60">
                Creates a rider account. Status starts as pending verification.
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
                  {saving ? "Adding…" : "Add rider"}
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {riders.length === 0 ? (
        <p className="rounded-xl border border-sky-800/40 px-6 py-16 text-center text-sm text-sky-200/50">
          No riders yet. Add a rider to get started.
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
            {riders.map((rider) => (
              <TableRow
                key={rider.id}
                className="border-sky-800/40 hover:bg-sky-950/40"
              >
                <TableCell className="font-medium text-sky-50">
                  {rider.firstName} {rider.lastName}
                </TableCell>
                <TableCell className="text-sky-100/80">
                  {rider.email || "—"}
                </TableCell>
                <TableCell>{rider.phone || "—"}</TableCell>
                <TableCell className="font-mono text-xs">
                  {rider.status}
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/portal/admin/riders/${rider.id}`}
                    className="inline-flex h-8 items-center rounded-4xl px-3 text-sm text-sky-300 hover:bg-sky-900/50 hover:text-sky-100"
                  >
                    Edit
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={deletingId === rider.id}
                    onClick={() => handleDelete(rider)}
                    className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  >
                    {deletingId === rider.id ? "Deleting…" : "Delete"}
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
