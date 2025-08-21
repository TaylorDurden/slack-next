import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("handles conditional and dedupes using tailwind-merge", () => {
    expect(cn("px-2", false && "hidden", "px-4")).toBe("px-4");
  });
});

