"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { authClient } from "@/lib/auth-client";
import { clearTokenCache } from "@/lib/api";
import type { AppUser } from "@/lib/types";

interface AuthContextValue {
  user: AppUser | null;
  isPending: boolean;
  refetch: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isPending, refetch } = authClient.useSession();

  const user = useMemo(
    () => ((data?.user as unknown as AppUser | undefined) ?? null),
    [data]
  );

  const signOut = useCallback(async () => {
    await authClient.signOut();
    clearTokenCache();
    await refetch();
  }, [refetch]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isPending,
      refetch: async () => {
        await refetch();
      },
      signOut,
    }),
    [user, isPending, refetch, signOut]
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
