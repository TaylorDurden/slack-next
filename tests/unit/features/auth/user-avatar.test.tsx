import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import UserAvatar from "@/features/auth/components/user-avatar";

vi.mock("@/features/auth/hooks/useCurrentUser", () => {
  return {
    useCurrentUser: () => ({
      isLoading: false,
      data: { name: "Taylor", email: "taylor@example.com", image: "" },
    }),
  };
});

describe("UserAvatar", () => {
  it("renders the avatar with fallback initial letter", () => {
    render(<UserAvatar />);
    expect(screen.getByText("T")).toBeInTheDocument();
  });
});
