"use client";

import { useState, useEffect, useCallback } from "react";

interface UseApiFetchOptions {
  enabled?: boolean;
  refreshKey?: number;
}

interface UseApiFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useApiFetch<T>(
  url: string,
  options: UseApiFetchOptions = {}
): UseApiFetchResult<T> {
  const { enabled = true, refreshKey = 0 } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      const json = await res.json();
      setData(json);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao buscar dados";
      setError(message);
      console.error(message, err);
    } finally {
      setLoading(false);
    }
  }, [url, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]);

  return { data, loading, error, refetch: fetchData };
}
