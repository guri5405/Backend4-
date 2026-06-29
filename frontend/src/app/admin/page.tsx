"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Check, X } from "lucide-react";
import clsx from "clsx";
import { AuthGuard } from "@/components/AuthGuard";
import { StatusPill } from "@/components/StatusPill";
import { Button } from "@/components/Button";
import { approveLeave, getAllLeaves, rejectLeave } from "@/lib/services";
import { normalizeError } from "@/lib/api-client";
import { AdminLeaveRequest, LeaveStatus } from "@/lib/types";

const filters: { label: string; value: LeaveStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Cancelled", value: "cancelled" },
];

export default function AdminReviewPage() {
  const [leaves, setLeaves] = useState<AdminLeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<LeaveStatus | "all">(
    "pending"
  );
  const [actingId, setActingId] = useState<string | null>(null);

  function load(status: LeaveStatus | "all") {
    let isMounted = true;
    queueMicrotask(() => {
      if (isMounted) {
        setIsLoading(true);
        setError(null);
      }
    });
    getAllLeaves(status === "all" ? undefined : status)
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
    return load(activeFilter);
  }, [activeFilter]);

  async function handleDecision(id: string, decision: "approve" | "reject") {
    setActingId(id);
    setError(null);
    try {
      const updated =
        decision === "approve" ? await approveLeave(id) : await rejectLeave(id);
      setLeaves((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...updated } : l))
      );
    } catch (err) {
      setError(normalizeError(err).message);
    } finally {
      setActingId(null);
    }
  }

  return (
    <AuthGuard adminOnly>
      <h1 className="font-display text-2xl font-semibold text-ink">
        Review queue
      </h1>
      <p className="mt-1 text-sm text-slate">
        Approve or reject pending leave requests across the team.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={clsx(
              "focus-ring rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              activeFilter === f.value
                ? "bg-ink text-paper"
                : "border border-line bg-paper-raised text-slate hover:border-ink/30 hover:text-ink"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-5 rounded-md bg-brick-bg px-3 py-2 text-sm text-brick">
          {error}
        </p>
      )}

      <div className="mt-5 overflow-hidden rounded-lg border border-line bg-paper-raised">
        {isLoading ? (
          <div className="px-5 py-10 text-center text-sm text-slate">
            Loading requests…
          </div>
        ) : leaves.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-slate">
            No requests in this view.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-slate-light">
                <th className="px-5 py-3 font-medium">Employee</th>
                <th className="px-5 py-3 font-medium">Dates</th>
                <th className="px-5 py-3 font-medium">Reason</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {leaves.map((leave) => (
                <tr key={leave.id}>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-ink">
                      {leave.profiles?.full_name ?? "—"}
                    </p>
                    <p className="text-xs text-slate-light">
                      {leave.profiles?.department ?? leave.profiles?.email}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-ink">
                    {format(new Date(leave.start_date), "MMM d")} –{" "}
                    {format(new Date(leave.end_date), "MMM d, yyyy")}
                  </td>
                  <td className="max-w-xs truncate px-5 py-3.5 text-slate">
                    {leave.reason}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusPill status={leave.status} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {leave.status === "pending" ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          className="px-3 py-1.5 text-xs"
                          isLoading={actingId === leave.id}
                          onClick={() => handleDecision(leave.id, "approve")}
                        >
                          <Check className="h-3.5 w-3.5" />
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          className="px-3 py-1.5 text-xs"
                          isLoading={actingId === leave.id}
                          onClick={() => handleDecision(leave.id, "reject")}
                        >
                          <X className="h-3.5 w-3.5" />
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-light">
                        Reviewed
                      </span>
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
