import { test, expect } from "@playwright/test";
import { mockApiRoutes } from "./mocks";

test.describe("Shop Page", () => {
  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page);
    await page.goto("/shop");
    // Wait for the filter sidebar to appear (it renders when categories load)
    await page.waitForSelector("text=Filter by", { timeout: 15_000 });
  });

  test("loads without crashing", async ({ page }) => {
    await expect(page).toHaveURL("/shop");
    await expect(page.locator("text=There was an error")).not.toBeVisible();
  });

  test("shows filter sidebar categories section", async ({ page }) => {
    await expect(
      page
        .locator("text=Filter by categories")
        .or(page.locator("text=Filter by brands"))
        .or(page.locator("text=Filter by price"))
        .first(),
    ).toBeVisible();
  });

  test("shows mocked category names in filters", async ({ page }) => {
    await expect(page.locator("text=Electronics").first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test("shows mocked product cards", async ({ page }) => {
    await expect(
      page
        .locator("text=Laptop Pro X")
        .or(page.locator("text=Wireless Headphones Z"))
        .first(),
    ).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("Cart Page", () => {
  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page);
    await page.goto("/cart");
    await page.waitForLoadState("networkidle");
  });

  test("loads without crashing", async ({ page }) => {
    await expect(page).toHaveURL("/cart");
    await expect(page.locator("text=There was an error")).not.toBeVisible();
  });

  test("shows shopping cart content area", async ({ page }) => {
    await expect(
      page
        .locator("text=Shopping cart")
        .or(page.locator("text=Your cart is empty"))
        .or(page.locator("text=cart is empty"))
        .first(),
    ).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("Favorites Page", () => {
  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page);
    await page.goto("/favorite");
    await page.waitForLoadState("networkidle");
  });

  test("loads without crashing", async ({ page }) => {
    await expect(page).toHaveURL("/favorite");
    await expect(page.locator("text=There was an error")).not.toBeVisible();
  });

  test("shows favorites heading or empty state", async ({ page }) => {
    await expect(
      page
        .locator("text=FAVORITE PRODUCTS")
        .or(page.locator("text=Favorite Products"))
        .or(page.locator("text=No favorites"))
        .first(),
    ).toBeVisible({ timeout: 10_000 });
  });
});
