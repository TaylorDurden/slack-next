import { test, expect } from "@playwright/test";

test.describe("Home page (unauthenticated)", () => {
  test("redirects to /auth and shows auth screen", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/auth$/);
    await expect(page.locator('[data-slot="card-title"]', { hasText: /login to your account/i })).toBeVisible();
  });
});
