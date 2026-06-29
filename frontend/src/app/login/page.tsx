"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { normalizeError } from "@/lib/api-client";
import { Button } from "@/components/Button";
import { InputField } from "@/components/FormFields";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      router.replace("/dashboard");
    } catch (err) {
      setError(normalizeError(err).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[1.1fr_1fr]">
      {/* Left: ledger visual panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-ink px-12 py-12 text-paper lg:flex">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-paper font-display text-base font-semibold text-ink">
            L
          </div>
          <span className="font-display text-lg font-semibold">Ledger</span>
        </div>

        <div className="max-w-md">
          <p className="font-display text-[2.5rem] leading-[1.1] font-semibold">
            Every leave request, kept like a proper register.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-paper/70">
            One place to request time off, track its status, and—if you
            review for your team—clear the queue without the back-and-forth
            emails.
          </p>
        </div>

        <LedgerStrip />
      </div>

      {/* Right: form */}
      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <div className="mb-2 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-ink font-display text-base font-semibold text-paper">
                L
              </div>
              <span className="font-display text-lg font-semibold text-ink">
                Ledger
              </span>
            </div>
          </div>

          <h1 className="font-display text-2xl font-semibold text-ink">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-slate">
            Sign in to request leave or review your team&apos;s queue.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
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
              label="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            {error && (
              <p className="rounded-md bg-brick-bg px-3 py-2 text-sm text-brick">
                {error}
              </p>
            )}

            <Button type="submit" isLoading={isSubmitting} className="mt-1 w-full">
              Sign in
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate">
            New here?{" "}
            <Link href="/signup" className="font-medium text-ink underline-offset-4 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function LedgerStrip() {
  const blocks = [
    { color: "bg-forest", w: "w-10" },
    { color: "bg-amber", w: "w-6" },
    { color: "bg-forest", w: "w-14" },
    { color: "bg-paper/20", w: "w-8" },
    { color: "bg-brick", w: "w-5" },
    { color: "bg-forest", w: "w-9" },
    { color: "bg-amber", w: "w-12" },
    { color: "bg-paper/20", w: "w-6" },
  ];
  return (
    <div>
      <p className="mb-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-paper/50">
        Recent activity
      </p>
      <div className="flex h-2.5 w-full gap-1 overflow-hidden rounded-full">
        {blocks.map((b, i) => (
          <span key={i} className={`h-full ${b.color} ${b.w} rounded-full`} />
        ))}
      </div>
    </div>
  );
}
