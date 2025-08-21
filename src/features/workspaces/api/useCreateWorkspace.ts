import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Doc, Id } from "../../../../convex/_generated/dataModel";

export interface CreateWorkspaceOptions {
  onSuccess?: (workspaceId: Id<"workspaces">) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
}

export interface CreateWorkspaceRequest {
  name: string;
}

export interface CreateWorkspaceState {
  data: Id<"workspaces"> | null;
  error: Error | null;
  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
  isSettled: boolean;
}

export const useCreateWorkspace = () => {
  const [data, setData] = useState<Id<"workspaces"> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");

  const isPending = useMemo(() => status === "pending", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isSettled = useMemo(() => status === "success" || status === "error", [status]);

  const mutation = useMutation(api.workspaces.create);

  const mutate = useCallback(
    async (values: CreateWorkspaceRequest, options?: CreateWorkspaceOptions) => {
      try {
        setData(null);
        setError(null);
        setStatus("pending");

        const workspaceId = await mutation(values);

        setData(workspaceId);
        setStatus("success");
        options?.onSuccess?.(workspaceId);

        return workspaceId;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to create workspace");
        setError(error);
        setStatus("error");
        options?.onError?.(error);

        if (options?.throwError) {
          throw error;
        }
      } finally {
        options?.onSettled?.();
      }
    },
    [mutation]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setStatus("idle");
  }, []);

  return {
    mutate,
    data,
    error,
    isPending,
    isError,
    isSuccess,
    isSettled,
    reset,
  };
};
