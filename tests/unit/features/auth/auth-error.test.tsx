import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AuthError } from "@/features/auth/components/auth-error";

describe("AuthError", () => {
  it("renders nothing when message is empty", () => {
    const { container } = render(<AuthError message="" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders message when provided", () => {
    render(<AuthError message="Invalid credentials" />);
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });
});
