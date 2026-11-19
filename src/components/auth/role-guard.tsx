"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { LoadingScreen } from "@/components/loading-skeleton";
import { dashboardPathForRole } from "@/lib/format";
import type { Role } from "@/lib/types";

interface RoleGuardProps {
  roles?: Role[];
  children: React.ReactNode;
}

/**
 * Client-side UX guard. Backend authorization is always enforced separately.
 * While the session is loading we render a skeleton instead of redirecting,
 * so authenticated users are never bounced to /sign-in on reload.
 */
export function RoleGuard({ roles, children }: RoleGuardProps) {
  const { user, isPending } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const allowed = !roles || (user ? roles.includes(user.role) : false);

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      const redirect = encodeURIComponent(pathname || "/dashboard");
      router.replace(`/sign-in?redirect=${redirect}`);
      return;
    }
    if (!allowed) {
      router.replace(dashboardPathForRole(user.role));
    }
  }, [isPending, user, allowed, router, pathname]);

  if (isPending || !user || !allowed) {
    return <LoadingScreen label="Preparing your dashboard" />;
  }

  return <>{children}</>;
}
