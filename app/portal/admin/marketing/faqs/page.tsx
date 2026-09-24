"use client";

import { useEffect, useState } from "react";
import { CircleHelp } from "lucide-react";
import { faqsApi, type Faq, type FaqInput } from "@/api/faqs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToastManager } from "@/components/ui/toast";

const emptyForm: FaqInput = { question: "", answer: "" };

function apiMessage(err: unknown, fallback: string) {
  const raw = (err as { response?: { data?: { message?: unknown } } })?.response
    ?.data?.message;
  if (Array.isArray(raw)) return raw.join(" ");
  if (typeof raw === "string") return raw;
  return fallback;
}

export default function FaqsAdminPage() {
  const { add: addToast } = useToastManager();
  const [items, setItems] = useState<Faq[]>([]);
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
      const res = await faqsApi.list();
      setItems(res.data);
    } catch {
      setError("Failed to load FAQs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const formReady = form.question.trim() && form.answer.trim();

  const startEdit = (item: Faq) => {
    setEditingId(item.id);
    setForm({ question: item.question, answer: item.answer });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving || !formReady) return;
    setSaving(true);
    try {
      if (editingId) {
        const res = await faqsApi.update(editingId, form);
        setItems((prev) =>
          prev.map((item) => (item.id === editingId ? res.data : item)),
        );
        addToast({ title: "FAQ updated", type: "success" });
        cancelEdit();
      } else {
        const res = await faqsApi.create(form);
        setItems((prev) => [...prev, res.data]);
        setForm(emptyForm);
        addToast({ title: "FAQ added", type: "success" });
      }
    } catch (err: unknown) {
      addToast({
        title: apiMessage(err, "Could not save FAQ."),
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await faqsApi.remove(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      if (editingId === id) cancelEdit();
      addToast({ title: "FAQ deleted", type: "success" });
    } catch (err: unknown) {
      addToast({
        title: apiMessage(err, "Could not delete FAQ."),
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
        <h1 className="mt-1 mb-6 text-2xl font-semibold tracking-tight">FAQ</h1>

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
        ) : items.length === 0 && !error ? (
          <div className="rounded-xl border border-sky-800/40 px-6 py-20 text-center">
            <CircleHelp className="mx-auto mb-3 h-8 w-8 text-sky-200/15" />
            <p className="text-sm text-sky-200/40">No questions yet</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-sky-800/40 bg-sky-950/50 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-base font-medium text-sky-50">
                    {item.question}
                  </h2>
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
                      disabled={deletingId === item.id}
                      onClick={() => handleDelete(item.id)}
                      className="rounded-md text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    >
                      {deletingId === item.id ? "Deleting…" : "Delete"}
                    </Button>
                  </div>
                </div>
                <p className="mt-3 text-sm whitespace-pre-wrap text-sky-100/70">
                  {item.answer}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-sky-800/40 bg-sky-950/40 p-6">
        <h3 className="mb-5 text-xs font-semibold tracking-wider text-sky-200/50 uppercase">
          {editingId ? "Edit question" : "Add question"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs tracking-wider text-sky-200/50 uppercase">
              Question
            </Label>
            <Textarea
              value={form.question}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, question: e.target.value }))
              }
              maxLength={200}
              rows={2}
              className="min-h-16 border-sky-800/50 bg-white/5 text-sky-50 placeholder:text-sky-200/20"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs tracking-wider text-sky-200/50 uppercase">
              Answer
            </Label>
            <Textarea
              value={form.answer}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, answer: e.target.value }))
              }
              maxLength={2000}
              rows={5}
              className="min-h-28 border-sky-800/50 bg-white/5 text-sky-50 placeholder:text-sky-200/20"
            />
          </div>
          <Button
            type="submit"
            disabled={saving || !formReady}
            className="w-full rounded-md border-0 bg-sky-700 text-white hover:bg-sky-800"
          >
            {saving ? "Saving…" : editingId ? "Save changes" : "Add question"}
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
