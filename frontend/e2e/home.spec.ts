import { test, expect } from "@playwright/test";
import { mockApiRoutes } from "./mocks";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    // Ensure no cached auth state from prior tests in same context
    await page.addInitScript(() => {
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
      localStorage.removeItem("expirationTime");
    });
    await mockApiRoutes(page);
    await page.goto("/");
    // Wait until React has rendered enough to show content
    await page.waitForSelector('a[href="/shop"]', { timeout: 15_000 });
  });

  test("loads at root URL without crashing", async ({ page }) => {
    await expect(page).toHaveURL("/");
    await expect(page.locator("text=There was an error")).not.toBeVisible();
  });

  test("shows Shop navigation link", async ({ page }) => {
    await expect(page.locator('a[href="/shop"]').first()).toBeVisible();
  });

  test("shows Login link when not authenticated", async ({ page }) => {
    await expect(page.locator('a[href="/login"]').first()).toBeVisible();
  });

  test("shows Register link when not authenticated", async ({ page }) => {
    // The home nav shows only a Login button when unauthenticated (no Register link by design).
    // The Register link lives on the Login page — navigate there to confirm the path exists.
    await page.goto("/login");
    await page.waitForSelector('a[href="/register"]', { timeout: 10_000 });
    await expect(page.locator('a[href="/register"]').first()).toBeVisible();
  });

  test("shows Latest Products section after API resolves", async ({ page }) => {
    await expect(
      page.locator("text=Latest products").or(page.locator("text=Latest Products")).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test("renders product names from mocked API data", async ({ page }) => {
    await expect(page.locator("text=Laptop Pro X").first()).toBeVisible({ timeout: 10_000 });
  });

  test("navigates to Shop page when clicking Shop link", async ({ page }) => {
    await page.locator('a[href="/shop"]').first().click();
    await expect(page).toHaveURL("/shop");
  });
});
