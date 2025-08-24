import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { WorkspaceSwitcher } from "@/app/workspaces/[workspaceId]/workspaceSwitcher";
import React from "react";
import { renderWithConvex } from "../../../test-utils";

// Mocks
const mockPush = vi.fn();
const mockSetIsOpen = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useParams: () => ({
    workspaceId: "workspace1",
  }),
}));

vi.mock("@/features/workspaces/store/useCreateWorkspaceModal", () => ({
  useCreateWorkspaceModal: () => ({
    setIsOpen: mockSetIsOpen,
  }),
}));

const mockUseGetWorkspaceById = vi.fn();
const mockUseGetWorkspaces = vi.fn();
vi.mock("@/features/workspaces/api/useGetWorkspaces", () => ({
  useGetWorkspaceById: (args: any) => mockUseGetWorkspaceById(args),
  useGetWorkspaces: () => mockUseGetWorkspaces(),
}));

describe("WorkspaceSwitcher", () => {
  it("renders a loader when the workspace is loading", () => {
    mockUseGetWorkspaceById.mockReturnValue({ isLoading: true });
    mockUseGetWorkspaces.mockReturnValue({ isLoading: true });
    renderWithConvex(<WorkspaceSwitcher />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("renders the current workspace name", async () => {
    const user = userEvent.setup();
    const workspace = { _id: "workspace1", name: "Test Workspace" };
    mockUseGetWorkspaceById.mockReturnValue({ isLoading: false, data: workspace });
    mockUseGetWorkspaces.mockReturnValue({ isLoading: false, data: [] });
    renderWithConvex(<WorkspaceSwitcher />);
    await user.click(screen.getByRole("button"));
    expect(await screen.findByText("Test Workspace")).toBeInTheDocument();
  });

  it("renders a list of other workspaces", async () => {
    const user = userEvent.setup();
    const currentWorkspace = { _id: "workspace1", name: "Current Workspace" };
    const otherWorkspaces = [
      { _id: "workspace2", name: "Other Workspace 1" },
      { _id: "workspace3", name: "Other Workspace 2" },
    ];
    mockUseGetWorkspaceById.mockReturnValue({ isLoading: false, data: currentWorkspace });
    mockUseGetWorkspaces.mockReturnValue({ isLoading: false, data: [currentWorkspace, ...otherWorkspaces] });
    renderWithConvex(<WorkspaceSwitcher />);
    await user.click(screen.getByRole("button"));
    expect(await screen.findByText("Other Workspace 1")).toBeInTheDocument();
    expect(await screen.findByText("Other Workspace 2")).toBeInTheDocument();
  });

  it("calls setIsOpen when the 'New Workspace' button is clicked", async () => {
    const user = userEvent.setup();
    mockUseGetWorkspaceById.mockReturnValue({ isLoading: false, data: { _id: "workspace1", name: "Test" } });
    mockUseGetWorkspaces.mockReturnValue({ isLoading: false, data: [] });
    renderWithConvex(<WorkspaceSwitcher />);
    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText("New Workspace"));
    expect(mockSetIsOpen).toHaveBeenCalledWith(true);
  });

  it("calls router.push when a workspace is clicked", async () => {
    const user = userEvent.setup();
    const currentWorkspace = { _id: "workspace1", name: "Current Workspace" };
    const otherWorkspaces = [{ _id: "workspace2", name: "Other Workspace" }];
    mockUseGetWorkspaceById.mockReturnValue({ isLoading: false, data: currentWorkspace });
    mockUseGetWorkspaces.mockReturnValue({ isLoading: false, data: [currentWorkspace, ...otherWorkspaces] });
    renderWithConvex(<WorkspaceSwitcher />);
    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText("Other Workspace"));
    expect(mockPush).toHaveBeenCalledWith("/workspaces/workspace2");
  });
});
