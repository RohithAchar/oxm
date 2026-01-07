import { useEffect, useRef, useState, useCallback } from "react";

interface UseInfiniteScrollOptions {
  fetchFn: (page: number) => Promise<{ items: any[]; hasMore: boolean }>;
  initialPage?: number;
  rootMargin?: string;
  enabled?: boolean;
  skipInitialFetch?: boolean;
}

export function useInfiniteScroll<T>({
  fetchFn,
  initialPage = 1,
  rootMargin = "300px",
  enabled = true,
  skipInitialFetch = false,
}: UseInfiniteScrollOptions) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const fetchPage = useCallback(
    async (nextPage: number) => {
      if (loading || !enabled) return;
      setLoading(true);
      setError(null);
      try {
        const result = await fetchFn(nextPage);
        setItems((prev) => [...prev, ...result.items]);
        setHasMore(result.hasMore);
        setPage(nextPage);
      } catch (e) {
        setError(e instanceof Error ? e : new Error("Failed to fetch"));
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [fetchFn, loading, enabled]
  );

  const reset = useCallback(() => {
    setItems([]);
    setPage(initialPage);
    setHasMore(true);
    setError(null);
    fetchPage(initialPage);
  }, [initialPage, fetchPage]);

  useEffect(() => {
    if (enabled && !skipInitialFetch) {
      fetchPage(initialPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, skipInitialFetch]);

  useEffect(() => {
    if (!loaderRef.current || !enabled || !hasMore) return;
    const el = loaderRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loading) {
          fetchPage(page + 1);
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [page, hasMore, loading, rootMargin, fetchPage, enabled]);

  return {
    items,
    loading,
    hasMore,
    error,
    loaderRef,
    reset,
    fetchNext: () => fetchPage(page + 1),
  };
}

