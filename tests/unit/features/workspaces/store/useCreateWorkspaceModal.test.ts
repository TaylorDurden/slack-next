import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/useCreateWorkspaceModal";

describe("useCreateWorkspaceModal", () => {
  beforeEach(() => {
    // Reset Jotai atoms between tests
    // This is a simple approach - in a real app you might want to use a more sophisticated reset mechanism
  });

  it("should initialize with modal closed", () => {
    const { result } = renderHook(() => useCreateWorkspaceModal());

    expect(result.current.isOpen).toBe(false);
  });

  it("should open modal when open() is called", () => {
    const { result } = renderHook(() => useCreateWorkspaceModal());

    act(() => {
      result.current.open();
    });

    expect(result.current.isOpen).toBe(true);
  });

  it("should close modal when close() is called", () => {
    const { result } = renderHook(() => useCreateWorkspaceModal());

    // First open the modal
    act(() => {
      result.current.open();
    });
    expect(result.current.isOpen).toBe(true);

    // Then close it
    act(() => {
      result.current.close();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it("should toggle modal state when toggle() is called", () => {
    const { result } = renderHook(() => useCreateWorkspaceModal());

    // Initially closed
    expect(result.current.isOpen).toBe(false);

    // Toggle to open
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(true);

    // Toggle to close
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it("should set modal state when setIsOpen() is called", () => {
    const { result } = renderHook(() => useCreateWorkspaceModal());

    act(() => {
      result.current.setIsOpen(true);
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.setIsOpen(false);
    });
    expect(result.current.isOpen).toBe(false);
  });

  it("should maintain state between renders", () => {
    const { result, rerender } = renderHook(() => useCreateWorkspaceModal());

    act(() => {
      result.current.open();
    });

    // Rerender the hook
    rerender();

    expect(result.current.isOpen).toBe(true);
  });

  it("should provide all expected methods", () => {
    const { result } = renderHook(() => useCreateWorkspaceModal());

    expect(typeof result.current.isOpen).toBe("boolean");
    expect(typeof result.current.setIsOpen).toBe("function");
    expect(typeof result.current.open).toBe("function");
    expect(typeof result.current.close).toBe("function");
    expect(typeof result.current.toggle).toBe("function");
  });
});
