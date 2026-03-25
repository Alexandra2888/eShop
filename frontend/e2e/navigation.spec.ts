import { test, expect } from "@playwright/test";
import { mockApiRoutes } from "./mocks";

test.describe("Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page);
  });

  test("navigates directly to /shop URL", async ({ page }) => {
    await page.goto("/shop");
    await page.waitForSelector('text=Filter by', { timeout: 15_000 });
    await expect(page).toHaveURL("/shop");
  });

  test("navigates directly to /cart URL", async ({ page }) => {
    await page.goto("/cart");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL("/cart");
  });

  test("navigates directly to /contact URL", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL("/contact");
  });

  test("navigates directly to /login URL", async ({ page }) => {
    await page.goto("/login");
    await page.waitForSelector('input[name="email"]', { timeout: 15_000 });
    await expect(page).toHaveURL("/login");
  });

  test("navigates directly to /register URL", async ({ page }) => {
    await page.goto("/register");
    await page.waitForSelector('input[name="name"]', { timeout: 15_000 });
    await expect(page).toHaveURL("/register");
  });

  test("redirects unauthenticated user from /profile to /login", async ({ page }) => {
    await page.goto("/profile");
    await page.waitForSelector('input[name="email"]', { timeout: 15_000 });
    await expect(page).toHaveURL("/login");
  });

  test("shows NotFound page for unknown routes", async ({ page }) => {
    await page.goto("/this-page-does-not-exist-xyz");
    await page.waitForLoadState("networkidle");
    await expect(
      page
        .locator("text=not the page")
        .or(page.locator("text=404"))
        .or(page.locator("text=Not Found"))
        .first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test("clicking Shop nav link from home navigates to /shop", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector('a[href="/shop"]', { timeout: 15_000 });
    await page.locator('a[href="/shop"]').first().click();
    await expect(page).toHaveURL("/shop");
  });
});

test.describe("Contact Page", () => {
  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page);
    await page.goto("/contact");
    await page.waitForLoadState("networkidle");
  });

  test("loads contact page without errors", async ({ page }) => {
    await expect(page).toHaveURL("/contact");
    await expect(page.locator("text=There was an error")).not.toBeVisible();
  });

  test("shows contact form or message section", async ({ page }) => {
    await expect(
      page.locator("text=Drop us a message")
        .or(page.locator("textarea"))
        .or(page.locator('input[type="email"]'))
        .first()
    ).toBeVisible({ timeout: 10_000 });
  });
});
