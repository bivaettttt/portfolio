import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests/browser",
  fullyParallel: true,
  workers: 2,
  reporter: "list",
  use: {
    baseURL: process.env.PORTFOLIO_URL ?? "http://127.0.0.1:44111/portfolio/",
    colorScheme: "light",
  },
  webServer: process.env.PORTFOLIO_URL
    ? undefined
    : {
        command: "npm run preview -- --port 44111",
        url: "http://127.0.0.1:44111/portfolio/",
        reuseExistingServer: !process.env.CI,
        timeout: 20000,
      },
});
