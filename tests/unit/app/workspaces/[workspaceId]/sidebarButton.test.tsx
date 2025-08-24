import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SidebarButton } from "@/app/workspaces/[workspaceId]/sidebarButton";
import { Home } from "lucide-react";
import React from "react";

describe("SidebarButton", () => {
  it("renders the button with the correct label", () => {
    render(<SidebarButton icon={Home} label="Home" />);
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("applies the active styles when isActive is true", () => {
    const { container } = render(<SidebarButton icon={Home} label="Home" isActive />);
    const button = container.querySelector("button");
    expect(button?.className).toMatch(/(?<!group-hover:)\bbg-accent\/20\b/);
  });

  it("does not apply the active styles when isActive is false", () => {
    const { container } = render(<SidebarButton icon={Home} label="Home" />);
    const button = container.querySelector("button");
    expect(button?.className).not.toMatch(/(?<!group-hover:)\bbg-accent\/20\b/);
  });
});
