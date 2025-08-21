import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AuthScreen } from "@/features/auth/components/auth-screen";

describe("AuthScreen", () => {
  it("renders sign in view by default and toggles to sign up", () => {
    render(<AuthScreen />);
    expect(screen.getByText("Login to your account", { exact: true })).toBeInTheDocument();
    const signUpButton = screen.getByRole("button", { name: /sign up/i });
    fireEvent.click(signUpButton);
    expect(screen.getByText("Sign up to continue", { exact: true })).toBeInTheDocument();
  });
});
