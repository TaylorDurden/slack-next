import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";

const signInSpy = vi.fn(() => Promise.resolve());
vi.mock("@convex-dev/auth/react", () => ({
  __esModule: true,
  useAuthActions: () => ({ signIn: signInSpy, signOut: vi.fn(() => Promise.resolve()) }),
}));

const { SignUpCard } = await import("@/features/auth/components/signup-card");

describe("SignUpCard", () => {
  beforeEach(() => {
    signInSpy.mockReset();
    signInSpy.mockImplementation(() => Promise.resolve());
  });

  it("shows error when passwords do not match and does not call signIn", () => {
    render(<SignUpCard setSignFlow={() => {}} />);
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "John" } });
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: "j@e.com" } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: "a" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "b" } });

    const submit = screen.getByRole("button", { name: /^sign up$/i });
    fireEvent.submit(submit.closest("form")!);

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    expect(signInSpy).not.toHaveBeenCalled();
  });

  it("submits signup with name/email/password and flow signUp", async () => {
    render(<SignUpCard setSignFlow={() => {}} />);
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "Jane" } });
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: "jane@example.com" } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: "secret" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "secret" } });

    const submit = screen.getByRole("button", { name: /^sign up$/i });
    fireEvent.submit(submit.closest("form")!);

    await waitFor(() => {
      expect(signInSpy).toHaveBeenCalled();
    });
    expect(signInSpy).toHaveBeenCalledWith("password", {
      name: "Jane",
      email: "jane@example.com",
      password: "secret",
      flow: "signUp",
    });
  });
});
