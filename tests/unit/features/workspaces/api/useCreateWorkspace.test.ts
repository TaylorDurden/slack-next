import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useCreateWorkspace } from "@/features/workspaces/api/useCreateWorkspace";

// Mock Convex
const mockMutation = vi.fn();
vi.mock("convex/react", () => ({
  useMutation: () => mockMutation,
}));

describe("useCreateWorkspace", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useCreateWorkspace());

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isPending).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isSettled).toBe(false);
  });

  it("should successfully create a workspace", async () => {
    const mockWorkspaceId = "workspace123";
    mockMutation.mockResolvedValue(mockWorkspaceId);

    const { result } = renderHook(() => useCreateWorkspace());
    const onSuccess = vi.fn();

    await act(async () => {
      await result.current.mutate({ name: "Test Workspace" }, { onSuccess });
    });

    expect(mockMutation).toHaveBeenCalledWith({ name: "Test Workspace" });
    expect(result.current.data).toBe(mockWorkspaceId);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isSettled).toBe(true);
    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBeNull();
    expect(onSuccess).toHaveBeenCalledWith(mockWorkspaceId);
  });

  it("should handle mutation errors", async () => {
    const mockError = new Error("Failed to create workspace");
    mockMutation.mockRejectedValue(mockError);

    const { result } = renderHook(() => useCreateWorkspace());
    const onError = vi.fn();

    await act(async () => {
      await result.current.mutate({ name: "Test Workspace" }, { onError });
    });

    expect(result.current.error).toBe(mockError);
    expect(result.current.isError).toBe(true);
    expect(result.current.isSettled).toBe(true);
    expect(result.current.isPending).toBe(false);
    expect(result.current.data).toBeNull();
    expect(onError).toHaveBeenCalledWith(mockError);
  });

  it("should handle non-Error exceptions", async () => {
    mockMutation.mockRejectedValue("String error");

    const { result } = renderHook(() => useCreateWorkspace());

    await act(async () => {
      await result.current.mutate({ name: "Test Workspace" });
    });

    expect(result.current.error?.message).toBe("Failed to create workspace");
    expect(result.current.isError).toBe(true);
  });

  it("should throw error when throwError option is true", async () => {
    const mockError = new Error("Failed to create workspace");
    mockMutation.mockRejectedValue(mockError);

    const { result } = renderHook(() => useCreateWorkspace());

    await expect(
      act(async () => {
        await result.current.mutate({ name: "Test Workspace" }, { throwError: true });
      })
    ).rejects.toThrow("Failed to create workspace");
  });

  it("should call onSettled callback", async () => {
    mockMutation.mockResolvedValue("workspace123");

    const { result } = renderHook(() => useCreateWorkspace());
    const onSettled = vi.fn();

    await act(async () => {
      await result.current.mutate({ name: "Test Workspace" }, { onSettled });
    });

    expect(onSettled).toHaveBeenCalled();
  });

  it("should reset state when reset is called", async () => {
    const mockWorkspaceId = "workspace123";
    mockMutation.mockResolvedValue(mockWorkspaceId);

    const { result } = renderHook(() => useCreateWorkspace());

    // First, create a workspace
    await act(async () => {
      await result.current.mutate({ name: "Test Workspace" });
    });

    expect(result.current.data).toBe(mockWorkspaceId);
    expect(result.current.isSuccess).toBe(true);

    // Then reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isPending).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isSettled).toBe(false);
  });

  it("should handle pending state correctly", async () => {
    let resolveMutation: (value: string) => void;
    const mutationPromise = new Promise<string>((resolve) => {
      resolveMutation = resolve;
    });
    mockMutation.mockReturnValue(mutationPromise);

    const { result } = renderHook(() => useCreateWorkspace());

    let mutatePromise: Promise<string>;
    act(() => {
      mutatePromise = result.current.mutate({ name: "Test Workspace" });
    });

    expect(result.current.isPending).toBe(true);
    expect(result.current.isSettled).toBe(false);

    // Resolve the mutation
    act(() => {
      resolveMutation!("workspace123");
    });

    await act(async () => {
      await mutatePromise;
    });

    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(true);
  });
});
