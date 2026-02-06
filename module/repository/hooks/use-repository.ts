"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchRepositories } from "..";

export const useRepositories = () => {
  return useInfiniteQuery({
    queryKey: ["repositories", "infinite"],

    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetchRepositories(pageParam, 10)

      return res
    },

    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < 10) return undefined
      return allPages.length + 1
    },

    initialPageParam: 1,
  })
}
