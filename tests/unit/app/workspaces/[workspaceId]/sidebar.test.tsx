import { screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SideBar } from "@/app/workspaces/[workspaceId]/sidebar";
import React from "react";
import { renderWithConvex } from "../../../test-utils";

// Mocks
vi.mock("next/navigation", () => ({
  usePathname: () => "/workspaces/workspace1",
  useParams: () => ({ workspaceId: "workspace1" }),
  useRouter: () => ({}),
}));

vi.mock("@/features/auth/components/user-avatar", () => ({
  __esModule: true,
  default: () => <div data-testid="user-avatar" />,
}));

vi.mock("@/app/workspaces/[workspaceId]/workspaceSwitcher", () => ({
  WorkspaceSwitcher: () => <div data-testid="workspace-switcher" />,
}));

vi.mock("@/app/workspaces/[workspaceId]/sidebarButton", () => ({
  SidebarButton: ({ label, isActive }: { label: string; isActive: boolean }) => (
    <div data-testid={`sidebar-button-${label}`} data-active={isActive}>
      {label}
    </div>
  ),
}));

describe("SideBar", () => {
  it("renders the sidebar with buttons", () => {
    renderWithConvex(<SideBar />);
    expect(screen.getByTestId("workspace-switcher")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("DMs")).toBeInTheDocument();
    expect(screen.getByText("Activity")).toBeInTheDocument();
    expect(screen.getByText("More")).toBeInTheDocument();
    expect(screen.getByTestId("user-avatar")).toBeInTheDocument();
  });

  it("sets the correct button as active", () => {
    renderWithConvex(<SideBar />);
    expect(screen.getByTestId("sidebar-button-Home").dataset.active).toBe("true");
    expect(screen.getByTestId("sidebar-button-DMs").dataset.active).toBe("false");
  });
});
