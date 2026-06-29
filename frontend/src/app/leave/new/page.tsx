"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { AuthGuard } from "@/components/AuthGuard";
import { Button } from "@/components/Button";
import { InputField, TextareaField } from "@/components/FormFields";
import { applyLeave } from "@/lib/services";
import { normalizeError } from "@/lib/api-client";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function NewLeavePage() {
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await applyLeave({ start_date: startDate, end_date: endDate, reason });
      router.push("/leave");
    } catch (err) {
      setError(normalizeError(err).message);
      setIsSubmitting(false);
    }
  }

  return (
    <AuthGuard>
      <Link
        href="/leave"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-slate hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to my leave
      </Link>

      <div className="max-w-lg">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Request leave
        </h1>
        <p className="mt-1 text-sm text-slate">
          Tell us the dates and why. We&apos;ll route it to your reviewer.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Start date"
              type="date"
              name="start_date"
              required
              min={todayISO()}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <InputField
              label="End date"
              type="date"
              name="end_date"
              required
              min={startDate || todayISO()}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <TextareaField
            label="Reason"
            name="reason"
            required
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="A short note on why you're requesting this time off."
          />

          {error && (
            <p className="rounded-md bg-brick-bg px-3 py-2 text-sm text-brick">
              {error}
            </p>
          )}

          <div className="mt-1 flex items-center gap-3">
            <Button type="submit" isLoading={isSubmitting}>
              <Send className="h-4 w-4" />
              Submit request
            </Button>
            <Link
              href="/leave"
              className="text-sm font-medium text-slate hover:text-ink"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </AuthGuard>
  );
}
