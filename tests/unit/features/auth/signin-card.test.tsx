import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";

const signInSpy = vi.fn(() => Promise.resolve());
vi.mock("@convex-dev/auth/react", () => ({
  __esModule: true,
  useAuthActions: () => ({ signIn: signInSpy, signOut: vi.fn(() => Promise.resolve()) }),
}));

const { SignInCard } = await import("@/features/auth/components/signin-card");

describe("SignInCard", () => {
  beforeEach(() => {
    signInSpy.mockReset();
    signInSpy.mockImplementation(() => Promise.resolve());
  });

  it("submits email/password and calls signIn with flow signIn", () => {
    render(<SignInCard setSignFlow={() => {}} />);

    const email = screen.getByLabelText(/email/i);
    const password = screen.getByLabelText(/^password$/i);
    fireEvent.change(email, { target: { value: "user@example.com" } });
    fireEvent.change(password, { target: { value: "secret" } });

    const submit = screen.getByRole("button", { name: /^login$/i });
    fireEvent.submit(submit.closest("form")!);

    expect(signInSpy).toHaveBeenCalledWith("password", {
      email: "user@example.com",
      password: "secret",
      flow: "signIn",
    });
  });

  it("shows error message when signIn rejects", async () => {
    signInSpy.mockRejectedValueOnce(new Error("bad creds"));
    render(<SignInCard setSignFlow={() => {}} />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "u@e.com" } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: "x" } });
    const submit = screen.getByRole("button", { name: /^login$/i });
    fireEvent.submit(submit.closest("form")!);

    // Wait for the error banner to appear
    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();
  });

  it("first provider button calls signIn with google", async () => {
    render(<SignInCard setSignFlow={() => {}} />);
    const buttons = screen.getAllByRole("button", { name: /login with/i });
    const googleBtn = buttons[0];
    fireEvent.click(googleBtn);
    await Promise.resolve();
    expect(signInSpy).toHaveBeenCalledWith("google");
  });
});
