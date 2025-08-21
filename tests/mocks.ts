import { vi } from "vitest";

export const signInMock = vi.fn();
export const signOutMock = vi.fn();

export function registerAuthMocks() {
  vi.mock("@convex-dev/auth/react", () => {
    return {
      __esModule: true,
      useAuthActions: () => ({
        signIn: signInMock,
        signOut: signOutMock,
      }),
    };
  });
}

