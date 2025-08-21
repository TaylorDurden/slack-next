import { test, expect } from "@playwright/test";

test.describe("Auth redirects", () => {
  test("unauthenticated user is redirected to /auth from /", async ({ page }) => {
    const response = await page.goto("/");
    // Middleware should redirect
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/\/auth$/);
    await expect(page.locator('[data-slot="card-title"]', { hasText: /login to your account/i })).toBeVisible();
  });

  test("auth page toggles between sign in and sign up", async ({ page }) => {
    await page.goto("/auth");
    await expect(page.locator('[data-slot="card-title"]', { hasText: /login to your account/i })).toBeVisible();
    await page.getByRole("button", { name: /sign up/i }).click();
    await expect(page.locator('[data-slot="card-title"]', { hasText: /sign up to continue/i })).toBeVisible();
  });
});
