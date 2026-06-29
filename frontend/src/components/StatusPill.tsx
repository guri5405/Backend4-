import clsx from "clsx";
import { LeaveStatus } from "@/lib/types";
import { Clock3, Check, X, Ban } from "lucide-react";

const config: Record<
  LeaveStatus,
  { label: string; className: string; Icon: typeof Clock3 }
> = {
  pending: { label: "Pending", className: "status-pending", Icon: Clock3 },
  approved: { label: "Approved", className: "status-approved", Icon: Check },
  rejected: { label: "Rejected", className: "status-rejected", Icon: X },
  cancelled: { label: "Cancelled", className: "status-cancelled", Icon: Ban },
};

export function StatusPill({ status }: { status: LeaveStatus }) {
  const { label, className, Icon } = config[status];
  return (
    <span className={clsx("status-pill", className)}>
      <Icon className="h-3 w-3" strokeWidth={2.5} />
      {label}
    </span>
  );
}
