import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import { WorkspaceSidebar } from "@/app/workspaces/[workspaceId]/workspaceSidebar";
import * as useGetMembers from "@/features/members/api/useGetMembers";
import * as useGetWorkspaces from "@/features/workspaces/api/useGetWorkspaces";
import { renderWithConvex } from "../../../test-utils";

vi.mock("@/hooks/useWorkspaceId", () => ({
  useWorkspaceId: () => "workspace1",
}));

describe("WorkspaceSidebar", () => {
  it("should display a loader when loading", () => {
    vi.spyOn(useGetMembers, "useCurrentMember").mockReturnValue({ isLoading: true } as any);
    vi.spyOn(useGetWorkspaces, "useGetWorkspaceById").mockReturnValue({ isLoading: true } as any);
    renderWithConvex(<WorkspaceSidebar />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("should display 'Workspace not found' when workspace or member is not found", () => {
    vi.spyOn(useGetMembers, "useCurrentMember").mockReturnValue({ data: null, isLoading: false } as any);
    vi.spyOn(useGetWorkspaces, "useGetWorkspaceById").mockReturnValue({ data: null, isLoading: false } as any);
    renderWithConvex(<WorkspaceSidebar />);
    expect(screen.getByText("Workspace not found")).toBeInTheDocument();
  });

  it("should render the WorkspaceHeader with correct props", () => {
    const workspace = { name: "Test Workspace" };
    const member = { role: "admin" };
    vi.spyOn(useGetMembers, "useCurrentMember").mockReturnValue({ data: member, isLoading: false } as any);
    vi.spyOn(useGetWorkspaces, "useGetWorkspaceById").mockReturnValue({ data: workspace, isLoading: false } as any);
    renderWithConvex(<WorkspaceSidebar />);
    expect(screen.getByText(workspace.name)).toBeInTheDocument();
  });
});
