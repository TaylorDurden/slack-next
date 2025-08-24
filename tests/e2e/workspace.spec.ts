import { test, expect } from "@playwright/test";

test.describe("Workspace", () => {
  test("should allow a user to create a new workspace", async ({ page }) => {
    await page.goto("/");

    // Click the workspace switcher to open the dropdown
    await page.click('button[aria-haspopup="menu"]');

    // Click the "New Workspace" button
    await page.click('text=New Workspace');

    // Fill in the workspace name
    await page.fill('input[name="name"]', "My Test Workspace");

    // Click the "Create workspace" button
    await page.click('button:has-text("Create workspace")');

    // Wait for the navigation and check for the new workspace name
    await expect(page.locator("h1")).toHaveText("My Test Workspace");
  });
});
