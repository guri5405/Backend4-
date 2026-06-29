"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { AppShell } from "./AppShell";

export function AuthGuard({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const { isAuthenticated, isLoading, profile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (adminOnly && profile?.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, adminOnly, profile, router]);

  if (isLoading || !isAuthenticated || (adminOnly && profile?.role !== "admin")) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-paper">
        <div className="flex items-center gap-2.5 text-sm text-slate">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading your workspace…
        </div>
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
