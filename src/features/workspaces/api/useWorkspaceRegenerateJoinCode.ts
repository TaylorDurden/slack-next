import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

export interface CreateWorkspaceRegenerateJoinCodeOptions {
  onSuccess?: (newCode: string | null) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
}

export interface CreateWorkspaceRegenerateJoinCodeRequest {
  workspaceId: Id<"workspaces">;
}

export interface CreateWorkspaceRegenerateJoinCodeState {
  data: string | null;
  error: Error | null;
  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
  isSettled: boolean;
}

export const useWorkspaceRegenerateJoinCode = () => {
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");

  const isPending = useMemo(() => status === "pending", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isSettled = useMemo(() => status === "success" || status === "error", [status]);

  const mutation = useMutation(api.workspaces.regenerateJoinCode);

  const mutate = useCallback(
    async (values: CreateWorkspaceRegenerateJoinCodeRequest, options?: CreateWorkspaceRegenerateJoinCodeOptions) => {
      try {
        setData(null);
        setError(null);
        setStatus("pending");

        const newJoinCode = await mutation(values);

        setData(newJoinCode);
        setStatus("success");
        options?.onSuccess?.(newJoinCode);

        return newJoinCode;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to regenerate join code");
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
