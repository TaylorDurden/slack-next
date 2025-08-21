import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Stable mocks for auth actions, importable in tests
export const signInMock = vi.fn(() => Promise.resolve());
export const signOutMock = vi.fn(() => Promise.resolve());

vi.mock("@convex-dev/auth/react", () => {
  return {
    __esModule: true,
    useAuthActions: () => ({
      signIn: signInMock,
      signOut: signOutMock,
    }),
  } as unknown as typeof import("@convex-dev/auth/react");
});
