import { useMutation } from "convex/react";
import { useCallback, useMemo, useState } from "react";
import { FunctionReference, DefaultFunctionArgs } from "convex/server";

interface ApiMutationOptions<T> {
  onSuccess?: (result: T) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
}

export const useApiMutation = <TArgs extends DefaultFunctionArgs, TResult>(
  mutation: FunctionReference<"mutation", "public", TArgs, TResult>
) => {
  const [data, setData] = useState<TResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");

  const isPending = useMemo(() => status === "pending", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isSettled = useMemo(() => status === "success" || status === "error", [status]);

  const convexMutation = useMutation(mutation);

  const mutate = useCallback(
    async (values: TArgs, options?: ApiMutationOptions<TResult>) => {
      try {
        setData(null);
        setError(null);
        setStatus("pending");

        const result = await convexMutation(values as any);

        setData(result);
        setStatus("success");
        options?.onSuccess?.(result);

        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("An unknown error occurred");
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
    [convexMutation]
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
