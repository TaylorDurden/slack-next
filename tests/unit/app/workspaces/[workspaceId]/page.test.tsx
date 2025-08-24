import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import WorkspacePage from "@/app/workspaces/[workspaceId]/page";
import React from "react";

// Mocks
vi.mock("@/hooks/useWorkspaceId", () => ({
  useWorkspaceId: () => "workspace1",
}));

const mockReplace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  usePathname: () => "/",
}));

const mockUseGetWorkspaceById = vi.fn();
vi.mock("@/features/workspaces/api/useGetWorkspaces", () => ({
  useGetWorkspaceById: (args: any) => mockUseGetWorkspaceById(args),
  useGetWorkspaces: () => ({
    data: [],
    isLoading: false,
  }),
}));

describe("WorkspacePage", () => {
  it("renders a loader when loading", () => {
    mockUseGetWorkspaceById.mockReturnValue({ isLoading: true });
    render(<WorkspacePage />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("redirects to home if workspace is not found", () => {
    mockUseGetWorkspaceById.mockReturnValue({
      isLoading: false,
      data: null,
    });
    render(<WorkspacePage />);
    expect(mockReplace).toHaveBeenCalledWith("/");
  });

  it("renders the workspace details when found", () => {
    const workspace = {
      _id: "workspace1",
      name: "Test Workspace",
      joinCode: "123456",
    };
    mockUseGetWorkspaceById.mockReturnValue({
      isLoading: false,
      data: workspace,
    });
    render(<WorkspacePage />);
    expect(screen.getByText("Test Workspace")).toBeInTheDocument();
    expect(screen.getByText("Workspace ID: workspace1")).toBeInTheDocument();
    expect(screen.getByText("Join Code: 123456")).toBeInTheDocument();
  });
});
