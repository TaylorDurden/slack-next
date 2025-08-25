import { render, screen } from "@testing-library/react";
import { ToolBar } from "@/app/workspaces/[workspaceId]/toolbar";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import * as useGetWorkspaces from "@/features/workspaces/api/useGetWorkspaces";
import { ConvexReactClient } from "convex/react";
import { renderWithConvex } from "../../../test-utils";

const convex = new ConvexReactClient("https://dummy.convex.dev");

vi.mock("@/hooks/useWorkspaceId", () => ({
  useWorkspaceId: () => "workspace1",
}));

describe("ToolBar", () => {
  it("renders the toolbar with the workspace name", () => {
    vi.spyOn(useGetWorkspaces, "useGetWorkspaceById").mockReturnValue({
      data: { name: "Test Workspace" },
    } as any);

    renderWithConvex(<ToolBar />);
    const searchButton = screen.getByText("Search Test Workspace Workspace");
    expect(searchButton).toBeInTheDocument();
  });
});
