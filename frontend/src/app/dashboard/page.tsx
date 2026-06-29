"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarPlus, Clock3, Check, X, Ban } from "lucide-react";
import { format } from "date-fns";
import { AuthGuard } from "@/components/AuthGuard";
import { StatusPill } from "@/components/StatusPill";
import { useAuth } from "@/lib/auth-context";
import { getMyLeaves } from "@/lib/services";
import { normalizeError } from "@/lib/api-client";
import { LeaveRequest } from "@/lib/types";

const toneClasses = {
  amber: { bg: "bg-amber-bg", text: "text-amber" },
  forest: { bg: "bg-forest-bg", text: "text-forest" },
  brick: { bg: "bg-brick-bg", text: "text-brick" },
  "gray-status": { bg: "bg-gray-status-bg", text: "text-gray-status" },
} as const;

function StatCard({
  label,
  value,
  Icon,
  tone,
}: {
  label: string;
  value: number;
  Icon: typeof Clock3;
  tone: keyof typeof toneClasses;
}) {
  const cls = toneClasses[tone];
  return (
    <div className="flex items-center gap-3.5 rounded-lg border border-line bg-paper-raised px-4 py-3.5">
      <div
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md ${cls.bg}`}
      >
        <Icon className={`h-[18px] w-[18px] ${cls.text}`} strokeWidth={2} />
      </div>
      <div>
        <p className="font-display text-xl font-semibold leading-none text-ink">
          {value}
        </p>
        <p className="mt-0.5 text-xs text-slate">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { profile } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getMyLeaves()
      .then((data) => {
        if (isMounted) setLeaves(data);
      })
      .catch((err) => {
        if (isMounted) setError(normalizeError(err).message);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const counts = {
    pending: leaves.filter((l) => l.status === "pending").length,
    approved: leaves.filter((l) => l.status === "approved").length,
    rejected: leaves.filter((l) => l.status === "rejected").length,
    cancelled: leaves.filter((l) => l.status === "cancelled").length,
  };

  const recent = leaves.slice(0, 6);

  return (
    <AuthGuard>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-slate-light">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink">
            Welcome, {profile?.full_name?.split(" ")[0]}
          </h1>
        </div>
        <Link
          href="/leave/new"
          className="focus-ring inline-flex flex-shrink-0 items-center gap-2 rounded-md border border-ink bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink-light"
        >
          <CalendarPlus className="h-4 w-4" />
          Request leave
        </Link>
      </div>

      {error && (
        <p className="mb-6 rounded-md bg-brick-bg px-3 py-2 text-sm text-brick">
          {error}
        </p>
      )}

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Pending" value={counts.pending} Icon={Clock3} tone="amber" />
        <StatCard label="Approved" value={counts.approved} Icon={Check} tone="forest" />
        <StatCard label="Rejected" value={counts.rejected} Icon={X} tone="brick" />
        <StatCard label="Cancelled" value={counts.cancelled} Icon={Ban} tone="gray-status" />
      </div>

      <div className="rounded-lg border border-line bg-paper-raised">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-base font-semibold text-ink">
            Recent requests
          </h2>
          <Link
            href="/leave"
            className="text-sm font-medium text-ink underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="px-5 py-8 text-center text-sm text-slate">
            Loading your leave history…
          </div>
        ) : recent.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm text-slate">
              No leave requests yet. When you need time off, it starts here.
            </p>
            <Link
              href="/leave/new"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-ink underline-offset-4 hover:underline"
            >
              <CalendarPlus className="h-3.5 w-3.5" />
              Request your first leave
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {recent.map((leave) => (
              <li
                key={leave.id}
                className="flex items-center justify-between gap-4 px-5 py-3.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">
                    {format(new Date(leave.start_date), "MMM d")} –{" "}
                    {format(new Date(leave.end_date), "MMM d, yyyy")}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-slate">
                    {leave.reason}
                  </p>
                </div>
                <StatusPill status={leave.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </AuthGuard>
  );
}
