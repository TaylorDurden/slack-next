import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import React from "react";
import { WorkspaceHeader } from "@/app/workspaces/[workspaceId]/workspaceHeader";
import { Doc } from "../../../../convex/_generated/dataModel";

describe("WorkspaceHeader", () => {
  const workspace = { name: "Test Workspace" } as Doc<"workspaces">;

  it("should display the workspace name", () => {
    render(<WorkspaceHeader workspace={workspace} isAdmin={false} />);
    expect(screen.getByText("Test Workspace")).toBeInTheDocument();
  });

  it("should display admin-only menu items when isAdmin is true", async () => {
    render(<WorkspaceHeader workspace={workspace} isAdmin={true} />);
    await userEvent.click(screen.getByText("Test Workspace"));
    expect(screen.getByText("Invite People")).toBeInTheDocument();
    expect(screen.getByText("Preferences")).toBeInTheDocument();
  });

  it("should not display admin-only menu items when isAdmin is false", async () => {
    render(<WorkspaceHeader workspace={workspace} isAdmin={false} />);
    await userEvent.click(screen.getByText("Test Workspace"));
    expect(screen.queryByText("Invite People")).not.toBeInTheDocument();
    expect(screen.queryByText("Preferences")).not.toBeInTheDocument();
  });
});
