import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Mock Convex
const mockQuery = vi.fn();
vi.mock("convex/react", () => ({
  useQuery: () => mockQuery(),
}));

// Mock auth actions
vi.mock("@convex-dev/auth/react", () => ({
  useAuthActions: () => ({
    signOut: vi.fn(),
  }),
}));

import UserAvatar from "@/features/auth/components/user-avatar";

describe("UserAvatar", () => {
  it("renders the avatar with fallback initial letter", () => {
    // Mock user data
    mockQuery.mockReturnValue({
      name: "John Doe",
      email: "john@example.com",
    });

    render(<UserAvatar />);

    // Should show the first letter of the name
    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("renders avatar with email fallback when name is not available", () => {
    // Mock user data with only email
    mockQuery.mockReturnValue({
      email: "john@example.com",
    });

    render(<UserAvatar />);

    // Should show the first letter of the email (always uppercase)
    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("renders nothing when no user data", () => {
    // Mock no user data
    mockQuery.mockReturnValue(null);

    const { container } = render(<UserAvatar />);

    // Should render nothing (null)
    expect(container.firstChild).toBeNull();
  });

  it("shows loading spinner when loading", () => {
    // Mock loading state
    mockQuery.mockReturnValue(undefined);

    const { container } = render(<UserAvatar />);

    // Should show loading spinner (SVG element)
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
