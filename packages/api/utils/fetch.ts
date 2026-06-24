import {
  DefaultError,
  useInfiniteQuery,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { Meta } from "../types";

export function useFetch() {
  const queryClient = useQueryClient();

  function query<T>(key: Array<string>, queryFunction, options = {}) {
    return useQuery<T>({
      queryKey: key,
      queryFn: queryFunction,
      staleTime: 1000 * 60 * 5, // Default to 5 minutes freshness
      // refetchOnMount: false,
      // refetchOnReconnect: true,
      // refetchOnWindowFocus: false,
      retry: 1,
      ...options,
    });
  }

  function infiniteQuery(key: Array<string>, queryFunction, options = {}) {
    return useInfiniteQuery({
      queryKey: key,
      queryFn: queryFunction,
      initialPageParam: 1,
      getNextPageParam: (lastPage: { meta: Meta }) => {
        if (lastPage.meta.page < lastPage.meta.total_pages) {
          return lastPage.meta.page + 1;
        } else {
          return undefined;
        }
      },
    });
  }

  function mutate<T, V>(
    key: Array<string>,
    invalidateKey: Array<string> | Array<Array<string>>,
    mutationFunction,
    options: UseMutationOptions<T, DefaultError, V, unknown> = {},
  ) {
    return useMutation<T, DefaultError, V | void, unknown>({
      mutationKey: key,
      mutationFn: mutationFunction,
      onSettled: () => {
        if (Array.isArray(invalidateKey)) {
          // Check if it's a single query key or multiple query keys
          if (
            invalidateKey.length > 0 &&
            typeof invalidateKey[0] === "string"
          ) {
            // Single query key
            queryClient.invalidateQueries({
              queryKey: invalidateKey as Array<string>,
              refetchType: "active",
            });
          } else if (
            invalidateKey.length > 0 &&
            Array.isArray(invalidateKey[0])
          ) {
            // Multiple query keys
            (invalidateKey as Array<Array<string>>).forEach((queryKey) => {
              queryClient.invalidateQueries({
                queryKey,
                refetchType: "active",
              });
            });
          } else if (invalidateKey.length === 0) {
            // Empty array - invalidate all queries (backward compatibility)
            queryClient.invalidateQueries({ refetchType: "none" });
          }
        }
      },
      ...options,
    });
  }

  return { query, infiniteQuery, mutate };
}
