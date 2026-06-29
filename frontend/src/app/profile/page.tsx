"use client";

import { FormEvent, useEffect, useState } from "react";
import { Check } from "lucide-react";
import { AuthGuard } from "@/components/AuthGuard";
import { Button } from "@/components/Button";
import { InputField } from "@/components/FormFields";
import { useAuth } from "@/lib/auth-context";
import { updateProfile } from "@/lib/services";
import { normalizeError } from "@/lib/api-client";

export default function ProfilePage() {
  const { profile, setProfile } = useAuth();
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!profile) return;
    const name = profile.full_name;
    const dept = profile.department ?? "";
    queueMicrotask(() => {
      setFullName(name);
      setDepartment(dept);
    });
  }, [profile]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);
    try {
      const updated = await updateProfile({
        full_name: fullName,
        department: department || undefined,
      });
      setProfile(updated);
      setSuccess(true);
    } catch (err) {
      setError(normalizeError(err).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthGuard>
      <h1 className="font-display text-2xl font-semibold text-ink">Profile</h1>
      <p className="mt-1 text-sm text-slate">
        Your details as they appear to reviewers.
      </p>

      <div className="mt-7 max-w-md">
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-line bg-paper-raised px-4 py-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/[0.06] font-mono text-sm font-semibold text-ink">
            {profile?.full_name?.charAt(0)?.toUpperCase() ?? "?"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">
              {profile?.email}
            </p>
            <p className="text-xs text-slate-light">
              {profile?.role === "admin" ? "Administrator" : "Employee"} ·
              Joined{" "}
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString()
                : "—"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <InputField
            label="Full name"
            name="full_name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <InputField
            label="Department"
            name="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="e.g. Engineering"
          />

          {error && (
            <p className="rounded-md bg-brick-bg px-3 py-2 text-sm text-brick">
              {error}
            </p>
          )}
          {success && (
            <p className="flex items-center gap-1.5 rounded-md bg-forest-bg px-3 py-2 text-sm text-forest">
              <Check className="h-3.5 w-3.5" />
              Profile updated.
            </p>
          )}

          <Button type="submit" isLoading={isSubmitting} className="mt-1 self-start">
            Save changes
          </Button>
        </form>
      </div>
    </AuthGuard>
  );
}
