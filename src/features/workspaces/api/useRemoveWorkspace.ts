import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

export interface RemoveWorkspaceOptions {
  onSuccess?: (removed: boolean) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
}

export interface RemoveWorkspaceRequest {
  id: Id<"workspaces">;
}

export interface RemoveWorkspaceState {
  data: boolean;
  error: Error | null;
  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
  isSettled: boolean;
}

export const useRemoveWorkspace = () => {
  const [data, setData] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");

  const isPending = useMemo(() => status === "pending", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isSettled = useMemo(() => status === "success" || status === "error", [status]);

  const mutation = useMutation(api.workspaces.remove);

  const mutate = useCallback(
    async (values: RemoveWorkspaceRequest, options?: RemoveWorkspaceOptions) => {
      try {
        setData(false);
        setError(null);
        setStatus("pending");

        const removed = await mutation(values);

        setData(removed);
        setStatus("success");
        options?.onSuccess?.(removed);

        return removed;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to update workspace");
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
    setData(false);
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
