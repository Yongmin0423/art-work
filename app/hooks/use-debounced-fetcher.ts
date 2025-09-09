import { useFetcher } from "react-router";
import { useCallback, useRef } from "react";

export function useDebouncedFetcher(delay: number = 300) {
  const fetcher = useFetcher();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSubmit = useCallback((
    target: Parameters<typeof fetcher.submit>[0],
    options?: Parameters<typeof fetcher.submit>[1]
  ) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      fetcher.submit(target, options);
    }, delay);
  }, [fetcher, delay]);

  return {
    ...fetcher,
    debouncedSubmit,
  };
}