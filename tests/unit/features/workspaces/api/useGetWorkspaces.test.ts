import { renderHook } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useGetWorkspaces } from "@/features/workspaces/api/useGetWorkspaces";
import { api } from "../../../../../convex/_generated/api";

// Mock Convex
const mockQuery = vi.fn();
vi.mock("convex/react", () => ({
  useQuery: (query: any, args: any) => mockQuery(query, args),
}));

describe("useGetWorkspaces", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call useQuery with correct API endpoint", () => {
    const mockWorkspaces = [
      { _id: "workspace1", name: "Workspace 1", userId: "user1", joinCode: "123456" },
      { _id: "workspace2", name: "Workspace 2", userId: "user1", joinCode: "789012" },
    ];

    mockQuery.mockReturnValue(mockWorkspaces);

    const { result } = renderHook(() => useGetWorkspaces());

    expect(mockQuery).toHaveBeenCalledWith(api.workspaces.get, undefined);
    expect(result.current.data).toEqual(mockWorkspaces);
    expect(result.current.isLoading).toBe(false);
  });

  it("should return undefined data and isLoading true when query returns undefined", () => {
    mockQuery.mockReturnValue(undefined);

    const { result } = renderHook(() => useGetWorkspaces());

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
  });

  it("should return empty array and isLoading false when query returns empty array", () => {
    mockQuery.mockReturnValue([]);

    const { result } = renderHook(() => useGetWorkspaces());

    expect(result.current.data).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it("should return null data and isLoading true when query returns null", () => {
    mockQuery.mockReturnValue(null);

    const { result } = renderHook(() => useGetWorkspaces());

    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(true);
  });

  it("should handle workspace data structure correctly", () => {
    const mockWorkspaces = [
      {
        _id: "workspace123",
        name: "Test Workspace",
        userId: "user456",
        joinCode: "ABC123",
      },
    ];

    mockQuery.mockReturnValue(mockWorkspaces);

    const { result } = renderHook(() => useGetWorkspaces());

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0]).toMatchObject({
      _id: "workspace123",
      name: "Test Workspace",
      userId: "user456",
      joinCode: "ABC123",
    });
    expect(result.current.isLoading).toBe(false);
  });
});
