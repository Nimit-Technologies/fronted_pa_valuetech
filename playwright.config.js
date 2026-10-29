import { defineConfig } from "@playwright/test";

// Point a run at a deployed environment with E2E_BASE_URL (staging, a preview
// deployment); with nothing set the run drives a local dev server, started by
// the webServer block below.
const DEFAULT_BASE_URL = "http://localhost:5173";
const baseURL = process.env.E2E_BASE_URL ?? DEFAULT_BASE_URL;

export default defineConfig({
  // ./tests, not ./tests/superAdmin: vite.config.js excludes tests/** from
  // vitest, so everything under here belongs to Playwright and specs outside
  // the superAdmin folder were silently never run.
  testDir: "./tests",
  reporter: "html",
  use: {
    baseURL,
    headless: true,
    trace: "on-first-retry",
  },
  // Start a server only for the local default — against a deployed URL there
  // is nothing to start. Without this the suite failed with connection errors
  // unless you happened to have `npm run dev` already running.
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "npm run dev -- --port 5173 --strictPort",
        url: DEFAULT_BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
