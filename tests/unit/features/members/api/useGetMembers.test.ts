import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useCurrentMember } from "@/features/members/api/useGetMembers";
import { useQuery } from "convex/react";

vi.mock("convex/react", () => ({
  useQuery: vi.fn(),
}));

describe("useCurrentMember", () => {
  it("should return the current member", () => {
    const member = { name: "Test User", role: "admin" };
    (useQuery as vi.Mock).mockReturnValue(member);
    const { result } = renderHook(() => useCurrentMember({ workspaceId: "workspace1" as any }));
    expect(result.current.data).toEqual(member);
    expect(result.current.isLoading).toBe(false);
  });

  it("should return isLoading as true when data is not yet available", () => {
    (useQuery as vi.Mock).mockReturnValue(undefined);
    const { result } = renderHook(() => useCurrentMember({ workspaceId: "workspace1" as any }));
    expect(result.current.isLoading).toBe(true);
  });
});
