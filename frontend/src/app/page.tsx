"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function RootPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    router.replace(isAuthenticated ? "/dashboard" : "/login");
  }, [isLoading, isAuthenticated, router]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-paper">
      <div className="flex items-center gap-2.5 text-sm text-slate">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading Ledger…
      </div>
    </div>
  );
}
