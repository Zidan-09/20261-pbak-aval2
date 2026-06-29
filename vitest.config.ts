import { defineConfig } from "vitest/config";
import dotenv from "dotenv";

dotenv.config({
    path: ".env.example"
});

export default defineConfig({
  test: {
    environment: "node",
  },
  resolve: {
    tsconfigPaths: true
  }
});