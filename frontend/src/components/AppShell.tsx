"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  BookOpen,
  CalendarPlus,
  LayoutGrid,
  LogOut,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutGrid;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/leave", label: "My Leave", icon: BookOpen },
  { href: "/leave/new", label: "Request Leave", icon: CalendarPlus },
  { href: "/admin", label: "Review Queue", icon: ShieldCheck, adminOnly: true },
  { href: "/profile", label: "Profile", icon: UserRound },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { profile, logout } = useAuth();
  const pathname = usePathname();

  const visibleItems = navItems.filter(
    (item) => !item.adminOnly || profile?.role === "admin"
  );

  return (
    <div className="flex min-h-screen w-full">
      <aside className="flex w-64 flex-shrink-0 flex-col border-r border-line bg-paper-raised/60 px-5 py-6">
        <div className="mb-8 flex items-center gap-2.5 px-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-ink font-display text-base font-semibold text-paper">
            L
          </div>
          <div>
            <p className="font-display text-base font-semibold leading-tight text-ink">
              Ledger
            </p>
            <p className="text-[0.6875rem] leading-tight text-slate-light">
              Leave Management
            </p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {visibleItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/leave" && pathname?.startsWith(item.href + "/")) ||
              (item.href === "/leave" && pathname === "/leave");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "focus-ring flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-ink text-paper"
                    : "text-slate hover:bg-ink/[0.05] hover:text-ink"
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-line pt-4">
          <div className="mb-3 flex items-center gap-2.5 px-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/[0.06] font-mono text-xs font-semibold text-ink">
              {profile?.full_name?.charAt(0)?.toUpperCase() ?? "?"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">
                {profile?.full_name}
              </p>
              <p className="truncate text-xs text-slate-light">
                {profile?.role === "admin" ? "Administrator" : "Employee"}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="focus-ring flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-slate transition-colors hover:bg-brick-bg hover:text-brick"
          >
            <LogOut className="h-4 w-4" strokeWidth={2} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-8 py-10">{children}</div>
      </main>
    </div>
  );
}
