import { test, expect } from "@playwright/test";

test.describe("Workspace Management", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page
    await page.goto("/");
  });

  test("should show create workspace modal when no workspaces exist", async ({ page }) => {
    // Mock empty workspaces response
    await page.route("**/api/workspaces", (route) => {
      route.fulfill({ status: 200, body: JSON.stringify([]) });
    });

    await page.goto("/");

    // Should show the create workspace modal
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("Create a new workspace")).toBeVisible();
    await expect(page.getByText(/Create a new workspace to organize your projects/)).toBeVisible();
  });

  test("should create a new workspace successfully", async ({ page }) => {
    // Mock the create workspace API call
    await page.route("**/api/workspaces/create", (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ workspaceId: "workspace123" }),
      });
    });

    // Mock empty workspaces initially
    await page.route("**/api/workspaces", (route) => {
      route.fulfill({ status: 200, body: JSON.stringify([]) });
    });

    await page.goto("/");

    // Fill in the workspace name
    const nameInput = page.getByLabel("Workspace name");
    await nameInput.fill("My Test Workspace");

    // Submit the form
    await page.getByRole("button", { name: "Create workspace" }).click();

    // Should show success message
    await expect(page.getByText("Workspace created successfully!")).toBeVisible();

    // Should redirect to the workspace page
    await expect(page).toHaveURL(/\/workspaces\/workspace123/);
  });

  test("should validate workspace name requirements", async ({ page }) => {
    // Mock empty workspaces
    await page.route("**/api/workspaces", (route) => {
      route.fulfill({ status: 200, body: JSON.stringify([]) });
    });

    await page.goto("/");

    const nameInput = page.getByLabel("Workspace name");
    const submitButton = page.getByRole("button", { name: "Create workspace" });

    // Test empty name
    await nameInput.fill("");
    await nameInput.blur();
    await expect(page.getByText("Workspace name is required")).toBeVisible();
    await expect(submitButton).toBeDisabled();

    // Test short name
    await nameInput.fill("ab");
    await nameInput.blur();
    await expect(page.getByText("Workspace name must be at least 3 characters")).toBeVisible();
    await expect(submitButton).toBeDisabled();

    // Test valid name
    await nameInput.fill("Valid Workspace");
    await nameInput.blur();
    await expect(page.queryByText(/Workspace name must be at least 3 characters/)).not.toBeVisible();
    await expect(submitButton).not.toBeDisabled();
  });

  test("should handle workspace creation errors", async ({ page }) => {
    // Mock the create workspace API to return an error
    await page.route("**/api/workspaces/create", (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: "Failed to create workspace" }),
      });
    });

    // Mock empty workspaces
    await page.route("**/api/workspaces", (route) => {
      route.fulfill({ status: 200, body: JSON.stringify([]) });
    });

    await page.goto("/");

    // Fill in the workspace name
    const nameInput = page.getByLabel("Workspace name");
    await nameInput.fill("Test Workspace");

    // Submit the form
    await page.getByRole("button", { name: "Create workspace" }).click();

    // Should show error message
    await expect(page.getByText("Failed to create workspace")).toBeVisible();

    // Modal should still be open
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("should redirect to existing workspace when available", async ({ page }) => {
    // Mock existing workspaces
    const mockWorkspaces = [{ _id: "workspace123", name: "Existing Workspace", userId: "user1", joinCode: "123456" }];

    await page.route("**/api/workspaces", (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(mockWorkspaces),
      });
    });

    await page.goto("/");

    // Should redirect to the existing workspace
    await expect(page).toHaveURL(/\/workspaces\/workspace123/);

    // Should not show the create workspace modal
    await expect(page.queryByRole("dialog")).not.toBeVisible();
  });

  test("should display workspace details correctly", async ({ page }) => {
    // Mock existing workspace
    const mockWorkspace = {
      _id: "workspace123",
      name: "Test Workspace",
      userId: "user1",
      joinCode: "ABC123",
    };

    await page.route("**/api/workspaces", (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify([mockWorkspace]),
      });
    });

    await page.goto("/workspaces/workspace123");

    // Should display workspace information
    await expect(page.getByText("Test Workspace")).toBeVisible();
    await expect(page.getByText("Workspace ID: workspace123")).toBeVisible();
    await expect(page.getByText("Join Code: ABC123")).toBeVisible();
    await expect(page.getByText("Workspace Overview")).toBeVisible();
  });

  test("should handle non-existent workspace", async ({ page }) => {
    // Mock empty workspaces
    await page.route("**/api/workspaces", (route) => {
      route.fulfill({ status: 200, body: JSON.stringify([]) });
    });

    await page.goto("/workspaces/nonexistent");

    // Should show workspace not found message
    await expect(page.getByText("Workspace not found")).toBeVisible();
    await expect(page.getByText(/The workspace you&apos;re looking for doesn&apos;t exist/)).toBeVisible();

    // Should have a button to go back home
    const goBackButton = page.getByRole("button", { name: "Go back home" });
    await expect(goBackButton).toBeVisible();

    // Clicking the button should navigate back to home
    await goBackButton.click();
    await expect(page).toHaveURL("/");
  });

  test("should close modal when cancel button is clicked", async ({ page }) => {
    // Mock empty workspaces
    await page.route("**/api/workspaces", (route) => {
      route.fulfill({ status: 200, body: JSON.stringify([]) });
    });

    await page.goto("/");

    // Modal should be visible
    await expect(page.getByRole("dialog")).toBeVisible();

    // Click cancel button
    await page.getByRole("button", { name: "Cancel" }).click();

    // Modal should be closed
    await expect(page.queryByRole("dialog")).not.toBeVisible();
  });

  test("should trim whitespace from workspace name", async ({ page }) => {
    // Mock the create workspace API call
    await page.route("**/api/workspaces/create", (route) => {
      const requestBody = JSON.parse(route.request().postData() || "{}");
      expect(requestBody.name).toBe("Trimmed Workspace");
      route.fulfill({
        status: 200,
        body: JSON.stringify({ workspaceId: "workspace123" }),
      });
    });

    // Mock empty workspaces
    await page.route("**/api/workspaces", (route) => {
      route.fulfill({ status: 200, body: JSON.stringify([]) });
    });

    await page.goto("/");

    // Fill in the workspace name with leading/trailing whitespace
    const nameInput = page.getByLabel("Workspace name");
    await nameInput.fill("  Trimmed Workspace  ");

    // Submit the form
    await page.getByRole("button", { name: "Create workspace" }).click();

    // Should redirect to the workspace page
    await expect(page).toHaveURL(/\/workspaces\/workspace123/);
  });

  test("should show loading state during workspace creation", async ({ page }) => {
    // Mock a slow API response
    await page.route("**/api/workspaces/create", (route) => {
      // Delay the response to simulate loading
      setTimeout(() => {
        route.fulfill({
          status: 200,
          body: JSON.stringify({ workspaceId: "workspace123" }),
        });
      }, 1000);
    });

    // Mock empty workspaces
    await page.route("**/api/workspaces", (route) => {
      route.fulfill({ status: 200, body: JSON.stringify([]) });
    });

    await page.goto("/");

    // Fill in the workspace name
    const nameInput = page.getByLabel("Workspace name");
    await nameInput.fill("Test Workspace");

    // Submit the form
    await page.getByRole("button", { name: "Create workspace" }).click();

    // Should show loading state
    await expect(page.getByRole("button", { name: "Creating..." })).toBeVisible();
    await expect(nameInput).toBeDisabled();
  });
});
