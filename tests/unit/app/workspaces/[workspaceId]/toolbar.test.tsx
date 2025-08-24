import { render, screen } from "@testing-library/react";
import { ToolBar } from "@/app/workspaces/[workspaceId]/toolbar";
import { describe, it, expect } from "vitest";
import React from "react";

describe("ToolBar", () => {
  it("renders the toolbar with a search button", () => {
    render(<ToolBar />);
    const searchButton = screen.getByText("Search workspace");
    expect(searchButton).toBeInTheDocument();
  });
});
