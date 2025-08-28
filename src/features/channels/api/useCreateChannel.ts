import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

export interface CreateChannelOptions {
  onSuccess?: (channelId: Id<"channels"> | null) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
}

export interface CreateChannelRequest {
  name: string;
  workspaceId: Id<"workspaces">;
}

export interface CreateChannelState {
  data: Id<"channels"> | null;
  error: Error | null;
  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
  isSettled: boolean;
}

export const useCreateChannel = () => {
  const [data, setData] = useState<Id<"channels"> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");

  const isPending = useMemo(() => status === "pending", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isSettled = useMemo(() => status === "success" || status === "error", [status]);

  const mutation = useMutation(api.channels.create);

  const mutate = useCallback(
    async (values: CreateChannelRequest, options?: CreateChannelOptions) => {
      try {
        setData(null);
        setError(null);
        setStatus("pending");

        const channelId = await mutation(values);

        setData(channelId);
        setStatus("success");
        options?.onSuccess?.(channelId);

        return channelId;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to create channel");
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
