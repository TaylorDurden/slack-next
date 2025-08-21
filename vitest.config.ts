import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "#testSetup": fileURLToPath(new URL("./vitest.setup.ts", import.meta.url)),
    },
  },
  esbuild: {
    jsx: "automatic",
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    css: true,
    globals: true,
    include: ["tests/unit/**/*.{ts,tsx}"],
  },
});
