"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { normalizeError } from "@/lib/api-client";
import { Button } from "@/components/Button";
import { InputField } from "@/components/FormFields";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const { hasSession } = await signup({
        email,
        password,
        full_name: fullName,
        department: department || undefined,
      });
      setIsSubmitting(false);
      if (hasSession) {
        router.replace("/dashboard");
      } else {
        setNeedsConfirmation(true);
      }
    } catch (err) {
      setError(normalizeError(err).message);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-paper px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-7 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-ink font-display text-base font-semibold text-paper">
            L
          </div>
          <span className="font-display text-lg font-semibold text-ink">
            Ledger
          </span>
        </div>

        <h1 className="font-display text-2xl font-semibold text-ink">
          Create your account
        </h1>
        <p className="mt-1.5 text-sm text-slate">
          Set up access to request and track your leave.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
          <InputField
            label="Full name"
            name="full_name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jordan Avery"
          />
          <InputField
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
          />
          <InputField
            label="Department"
            name="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="Engineering (optional)"
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            hint="Minimum 6 characters."
          />

          {error && (
            <p className="rounded-md bg-brick-bg px-3 py-2 text-sm text-brick">
              {error}
            </p>
          )}

          {needsConfirmation && (
            <p className="rounded-md bg-amber-bg px-3 py-2 text-sm text-[#8a5a14]">
              Check your email to confirm your account, then sign in.
            </p>
          )}

          <Button type="submit" isLoading={isSubmitting} className="mt-1 w-full">
            Create account
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-ink underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
