import { test, expect } from "@playwright/test";
import { mockApiRoutes } from "./mocks";

/** Clear auth-related localStorage keys so each test starts unauthenticated. */
async function clearAuth(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
  });
}

test.describe("Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await clearAuth(page);
    await mockApiRoutes(page);
    await page.goto("/login");
    await page.waitForSelector('input[name="email"]', { timeout: 15_000 });
  });

  test("renders login form with email and password fields", async ({ page }) => {
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="passowrd"]')).toBeVisible();
  });

  test("shows Sign In heading", async ({ page }) => {
    await expect(page.locator("h2").filter({ hasText: /sign.?in/i }).first()).toBeVisible();
  });

  test("shows validation error for empty form submission", async ({ page }) => {
    await page.locator('button[type="submit"]').click();
    await expect(page.locator(".text-red-500").first()).toBeVisible({ timeout: 5_000 });
  });

  test("shows validation error for empty password", async ({ page }) => {
    // Valid email passes browser validation; empty password fails Zod min(1)
    await page.locator('input[name="email"]').fill("valid@example.com");
    // Leave password empty
    await page.locator('button[type="submit"]').click();
    await expect(page.locator(".text-red-500").first()).toBeVisible({ timeout: 5_000 });
  });

  test("navigates to register page via the register link", async ({ page }) => {
    await page.locator('a[href="/register"]').click();
    await expect(page).toHaveURL("/register");
  });

  test("submits login form and redirects to home on success", async ({ page }) => {
    await page.locator('input[name="email"]').fill("test@example.com");
    await page.locator('input[name="passowrd"]').fill("password123");
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL("/", { timeout: 10_000 });
  });
});

test.describe("Register Page", () => {
  test.beforeEach(async ({ page }) => {
    await clearAuth(page);
    await mockApiRoutes(page);
    await page.goto("/register");
    await page.waitForSelector('input[name="name"]', { timeout: 15_000 });
  });

  test("renders register form with all required fields", async ({ page }) => {
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });

  test("shows Register heading", async ({ page }) => {
    await expect(page.locator("h2").filter({ hasText: /register/i }).first()).toBeVisible();
  });

  test("shows validation error when password is too short", async ({ page }) => {
    await page.locator('input[name="name"]').fill("Test User");
    await page.locator('input[name="email"]').fill("new@example.com");
    // Password less than 6 chars → Zod fails, mismatch check also runs
    const passwordInputs = page.locator('input[type="password"]');
    await passwordInputs.nth(0).fill("abc");
    await passwordInputs.nth(1).fill("different");
    await page.locator('button[type="submit"]').click();
    await expect(page.locator(".text-red-500").first()).toBeVisible({ timeout: 5_000 });
  });

  test("navigates to login page via the login link", async ({ page }) => {
    // Two a[href="/login"] exist (nav button + form link) — target only the form's inline link
    await page.getByRole("main").getByRole("link", { name: "Login" }).click();
    await expect(page).toHaveURL("/login");
  });

  test("submits register form successfully and redirects home", async ({ page }) => {
    await page.locator('input[name="name"]').fill("New User");
    await page.locator('input[name="email"]').fill("newuser@example.com");
    const passwordInputs = page.locator('input[type="password"]');
    await passwordInputs.nth(0).fill("ValidPass123!");
    await passwordInputs.nth(1).fill("ValidPass123!");
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL("/", { timeout: 10_000 });
  });
});
