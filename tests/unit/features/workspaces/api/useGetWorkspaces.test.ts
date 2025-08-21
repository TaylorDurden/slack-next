import { renderHook } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useGetWorkspaces } from "@/features/workspaces/api/useGetWorkspaces";

// Mock Convex
const mockQuery = vi.fn();
vi.mock("convex/react", () => ({
  useQuery: () => mockQuery(),
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

    expect(mockQuery).toHaveBeenCalled();
    expect(result.current).toEqual(mockWorkspaces);
  });

  it("should return undefined when query returns undefined", () => {
    mockQuery.mockReturnValue(undefined);

    const { result } = renderHook(() => useGetWorkspaces());

    expect(result.current).toBeUndefined();
  });

  it("should return empty array when query returns empty array", () => {
    mockQuery.mockReturnValue([]);

    const { result } = renderHook(() => useGetWorkspaces());

    expect(result.current).toEqual([]);
  });

  it("should return null when query returns null", () => {
    mockQuery.mockReturnValue(null);

    const { result } = renderHook(() => useGetWorkspaces());

    expect(result.current).toBeNull();
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

    expect(result.current).toHaveLength(1);
    expect(result.current?.[0]).toMatchObject({
      _id: "workspace123",
      name: "Test Workspace",
      userId: "user456",
      joinCode: "ABC123",
    });
  });
});
