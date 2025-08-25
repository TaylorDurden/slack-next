import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import React from "react";
import { Hint } from "@/components/hint";

describe("Hint", () => {
  it("should display the hint on hover", async () => {
    render(
      <Hint label="Test Hint">
        <button>Hover me</button>
      </Hint>
    );
    await userEvent.hover(screen.getByText("Hover me"));
    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toHaveTextContent("Test Hint");
  });
});
