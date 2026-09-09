import { test, expect } from "@playwright/test";

// This test assumes your NestJS backend is running and has a test user in PostgreSQL
test("User can log in successfully", async ({ page }) => {
  // 1. Navigate to the Next.js login page
  await page.goto("/login");

  // 2. Fill out the form using accessible locators
  await page.getByLabel("Email").fill("shifat@example.com");
  await page
    .getByRole("textbox", { name: "Password" })
    .fill("Securepassword123!");

  // 3. Click the submit button
  await page.getByRole("button", { name: "Sign In" }).click();

  // 4. Verify the user is redirected and the dashboard loads
  // Playwright automatically waits for this text to appear from your backend
  await expect(
    page.getByRole("heading", { name: "Welcome back, Test User" }),
  ).toBeVisible();
});
