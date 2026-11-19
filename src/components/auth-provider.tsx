"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { clearTokenCache } from "@/lib/api";
import type { AppUser } from "@/lib/types";

interface AuthContextValue {
  user: AppUser | null;
  isPending: boolean;
  isSigningOut: boolean;
  refetch: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isPending, refetch } = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const user = useMemo(
    () => ((data?.user as unknown as AppUser | undefined) ?? null),
    [data]
  );

  const signOut = useCallback(async () => {
    setIsSigningOut(true);
    try {
      await authClient.signOut();
      clearTokenCache();
      await refetch();
    } finally {
      // Keep the flag briefly so route guards do not bounce the now-anonymous
      // user to /sign-in before the caller navigates away from a protected page.
      window.setTimeout(() => setIsSigningOut(false), 1000);
    }
  }, [refetch]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isPending,
      isSigningOut,
      refetch: async () => {
        await refetch();
      },
      signOut,
    }),
    [user, isPending, isSigningOut, refetch, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
