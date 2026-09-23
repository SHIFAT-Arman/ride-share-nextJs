"use client";

import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import {
  testimonialsApi,
  type Testimonial,
  type TestimonialInput,
} from "@/api/testimonials";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToastManager } from "@/components/ui/toast";

const MIN = 6;
const MAX = 9;

const emptyForm: TestimonialInput = {
  name: "",
  designation: "",
  testimonial: "",
  avatar: "",
};

function apiMessage(err: unknown, fallback: string) {
  const raw = (err as { response?: { data?: { message?: unknown } } })?.response
    ?.data?.message;
  if (Array.isArray(raw)) return raw.join(" ");
  if (typeof raw === "string") return raw;
  return fallback;
}

export default function TestimonialsAdminPage() {
  const { add: addToast } = useToastManager();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await testimonialsApi.list();
      setItems(res.data);
    } catch {
      setError("Failed to load testimonials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const atMax = items.length >= MAX;
  const atMin = items.length <= MIN;
  const formReady =
    form.name.trim() &&
    form.designation.trim() &&
    form.testimonial.trim() &&
    form.avatar.trim().startsWith("https://");

  const setField = (key: keyof TestimonialInput, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const startEdit = (item: Testimonial) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      designation: item.designation,
      testimonial: item.testimonial,
      avatar: item.avatar,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId && atMax) return;
    setSaving(true);
    try {
      if (editingId) {
        const res = await testimonialsApi.update(editingId, form);
        setItems((prev) =>
          prev.map((item) => (item.id === editingId ? res.data : item)),
        );
        addToast({ title: "Testimonial updated", type: "success" });
        cancelEdit();
      } else {
        const res = await testimonialsApi.create(form);
        setItems((prev) => [...prev, res.data]);
        setForm(emptyForm);
        addToast({ title: "Testimonial added", type: "success" });
      }
    } catch (err: unknown) {
      addToast({
        title: apiMessage(err, "Could not save testimonial."),
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (atMin) return;
    setDeletingId(id);
    try {
      await testimonialsApi.remove(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      if (editingId === id) cancelEdit();
      addToast({ title: "Testimonial deleted", type: "success" });
    } catch (err: unknown) {
      addToast({
        title: apiMessage(err, "Could not delete testimonial."),
        type: "error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div>
        <p className="text-xs tracking-wider text-sky-400 uppercase">
          Marketing
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Testimonials
        </h1>
        <p className="mt-1 mb-6 text-sm text-sky-200/50">
          {items.length} / {MAX}. Keep between {MIN} and {MAX}.
        </p>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            {error}
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 rounded-md text-red-400 hover:bg-red-500/10"
              onClick={load}
            >
              Try again
            </Button>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-28 bg-sky-900/40" />
            <Skeleton className="h-28 bg-sky-900/40" />
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-sky-800/40 px-6 py-20 text-center">
            <Quote className="mx-auto mb-3 h-8 w-8 text-sky-200/15" />
            <p className="text-sm text-sky-200/40">No testimonials yet</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-sky-800/40 bg-sky-950/50 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-base font-medium text-sky-50">
                      {item.name}
                    </h2>
                    <p className="mt-1 text-xs text-sky-200/40">
                      {item.designation}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(item)}
                      className="rounded-md text-sky-200 hover:bg-sky-800/40"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={atMin || deletingId === item.id}
                      title={
                        atMin ? `At least ${MIN} testimonials` : undefined
                      }
                      onClick={() => handleDelete(item.id)}
                      className="rounded-md text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    >
                      {deletingId === item.id ? "Deleting…" : "Delete"}
                    </Button>
                  </div>
                </div>
                <p className="mt-3 text-sm whitespace-pre-wrap text-sky-100/70">
                  {item.testimonial}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-sky-800/40 bg-sky-950/40 p-6">
        <h3 className="mb-5 text-xs font-semibold tracking-wider text-sky-200/50 uppercase">
          {editingId ? "Edit testimonial" : "Add testimonial"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs tracking-wider text-sky-200/50 uppercase">
              Name
            </Label>
            <Input
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              maxLength={80}
              className="h-10 border-sky-800/50 bg-white/5 text-sky-50 placeholder:text-sky-200/20"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs tracking-wider text-sky-200/50 uppercase">
              Designation
            </Label>
            <Input
              value={form.designation}
              onChange={(e) => setField("designation", e.target.value)}
              maxLength={120}
              className="h-10 border-sky-800/50 bg-white/5 text-sky-50 placeholder:text-sky-200/20"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs tracking-wider text-sky-200/50 uppercase">
              Quote
            </Label>
            <Textarea
              value={form.testimonial}
              onChange={(e) => setField("testimonial", e.target.value)}
              maxLength={2000}
              rows={4}
              className="min-h-24 border-sky-800/50 bg-white/5 text-sky-50 placeholder:text-sky-200/20"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs tracking-wider text-sky-200/50 uppercase">
              Avatar URL
            </Label>
            <Input
              value={form.avatar}
              onChange={(e) => setField("avatar", e.target.value)}
              placeholder="https://"
              className="h-10 border-sky-800/50 bg-white/5 text-sky-50 placeholder:text-sky-200/20"
            />
          </div>
          {!editingId && atMax && (
            <p className="text-xs text-sky-200/50">
              Maximum of {MAX}. Edit an existing one instead.
            </p>
          )}
          <Button
            type="submit"
            disabled={saving || !formReady || (!editingId && atMax)}
            className="w-full rounded-md border-0 bg-sky-700 text-white hover:bg-sky-800"
          >
            {saving ? "Saving…" : editingId ? "Save changes" : "Add testimonial"}
          </Button>
          {editingId && (
            <Button
              type="button"
              variant="ghost"
              onClick={cancelEdit}
              className="w-full rounded-md text-sky-200"
            >
              Cancel
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
