"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { CalendarPlus } from "lucide-react";
import { AuthGuard } from "@/components/AuthGuard";
import { StatusPill } from "@/components/StatusPill";
import { Button } from "@/components/Button";
import { cancelLeave, getMyLeaves } from "@/lib/services";
import { normalizeError } from "@/lib/api-client";
import { LeaveRequest } from "@/lib/types";

export default function MyLeavePage() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  function load() {
    let isMounted = true;
    queueMicrotask(() => {
      if (isMounted) setIsLoading(true);
    });
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
  }

  useEffect(() => {
    return load();
  }, []);

  async function handleCancel(id: string) {
    setCancellingId(id);
    setError(null);
    try {
      const updated = await cancelLeave(id);
      setLeaves((prev) => prev.map((l) => (l.id === id ? updated : l)));
    } catch (err) {
      setError(normalizeError(err).message);
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <AuthGuard>
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">
            My Leave
          </h1>
          <p className="mt-1 text-sm text-slate">
            Every request you&apos;ve filed, and where it stands.
          </p>
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
        <p className="mb-5 rounded-md bg-brick-bg px-3 py-2 text-sm text-brick">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-lg border border-line bg-paper-raised">
        {isLoading ? (
          <div className="px-5 py-10 text-center text-sm text-slate">
            Loading your leave history…
          </div>
        ) : leaves.length === 0 ? (
          <div className="px-5 py-12 text-center">
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
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-left font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-slate-light">
                <th className="px-5 py-3 font-medium">Dates</th>
                <th className="px-5 py-3 font-medium">Reason</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Filed</th>
                <th className="px-5 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {leaves.map((leave) => (
                <tr key={leave.id}>
                  <td className="whitespace-nowrap px-5 py-3.5 font-medium text-ink">
                    {format(new Date(leave.start_date), "MMM d")} –{" "}
                    {format(new Date(leave.end_date), "MMM d, yyyy")}
                  </td>
                  <td className="max-w-xs truncate px-5 py-3.5 text-slate">
                    {leave.reason}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusPill status={leave.status} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-slate-light">
                    {format(new Date(leave.created_at), "MMM d, yyyy")}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {leave.status === "pending" && (
                      <Button
                        variant="danger"
                        className="px-3 py-1.5 text-xs"
                        isLoading={cancellingId === leave.id}
                        onClick={() => handleCancel(leave.id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AuthGuard>
  );
}
