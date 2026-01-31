"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { connectRepository } from "..";

type ConnectRepositoryInput = {
  owner: string;
  repo: string;
  githubId: number;
};

export const useConnectRepository = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ owner, repo, githubId }: ConnectRepositoryInput) => {
      return connectRepository(owner, repo, githubId);
    },

    onSuccess: () => {
      toast.success("Repository connected successfully");
      queryClient.invalidateQueries({
        queryKey: ["repositories"],
      });
    },

    onError: (error) => {
      toast.error("Failed to connect repository");
      console.error(error);
    },
  });
};
