import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      reporter: ["text", "html"],
    },
    alias: {
      "~/": new URL("./src/", import.meta.url).pathname,
    },
  },
});
