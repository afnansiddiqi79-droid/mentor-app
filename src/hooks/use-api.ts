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
      const response = (await api.get(path)) as unknown as {
        data?: T;
        meta?: Record<string, unknown>;
      };
      // api.get unwraps the JSON body, which includes data/meta for list routes.
      if (response && typeof response === "object" && "data" in response) {
        setData((response.data as T) ?? null);
        setMeta(response.meta ?? null);
      } else {
        setData(response as unknown as T);
        setMeta(null);
      }
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
