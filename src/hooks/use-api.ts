"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiClientError } from "@/lib/api";

export function useApi<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [meta, setMeta] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(Boolean(path));
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!path) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await api.getWithMeta<T>(path);
      setData(response.data ?? null);
      setMeta(response.meta ?? null);
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err.message
          : "Could not load this data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    // Fetching on mount is intentional: this hook is the client data source for
    // dashboard routes. State updates happen inside the async loader.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  return { data, meta, loading, error, reload: load };
}
