import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useParams: () => ({
    workspaceId: "test-workspace-id",
  }),
}));

describe("useWorkspaceId", () => {
  it("should return the workspaceId from useParams", () => {
    const { result } = renderHook(() => useWorkspaceId());
    expect(result.current).toBe("test-workspace-id");
  });
});
