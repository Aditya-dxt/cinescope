import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  expect: { timeout: 5000 },
  fullyParallel: false,
  retries: 0,
  use: { baseURL: "http://localhost:4173", trace: "on-first-retry" },
  webServer: { command: "npm run preview -- --port 4173 --host 0.0.0.0", url: "http://localhost:4173", reuseExistingServer: !process.env.CI, timeout: 60_000 },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
