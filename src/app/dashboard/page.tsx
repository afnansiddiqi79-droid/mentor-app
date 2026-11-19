"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { LoadingScreen } from "@/components/loading-skeleton";
import { dashboardPathForRole } from "@/lib/format";

export default function DashboardIndexPage() {
  const { user, isPending } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      router.replace("/sign-in?redirect=/dashboard");
      return;
    }
    router.replace(dashboardPathForRole(user.role));
  }, [isPending, user, router]);

  return <LoadingScreen label="Opening your dashboard" />;
}
