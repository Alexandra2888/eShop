import type { Page } from "@playwright/test";

export const MOCK_PRODUCTS = [
  {
    _id: "prod1",
    name: "Laptop Pro X",
    price: 1299,
    image: "https://via.placeholder.com/200",
    brand: "TechBrand",
    category: { _id: "cat1", name: "Electronics" },
    countInStock: 10,
    numReviews: 5,
    rating: 4.5,
    description: "A powerful laptop",
    reviews: [],
  },
  {
    _id: "prod2",
    name: "Wireless Headphones Z",
    price: 199,
    image: "https://via.placeholder.com/200",
    brand: "AudioBrand",
    category: { _id: "cat1", name: "Electronics" },
    countInStock: 20,
    numReviews: 3,
    rating: 4.2,
    description: "Crystal clear audio",
    reviews: [],
  },
];

export const MOCK_CATEGORIES = [
  { _id: "cat1", name: "Electronics" },
  { _id: "cat2", name: "Clothing" },
  { _id: "cat3", name: "Books" },
];

export const MOCK_USER = {
  _id: "user123",
  username: "testuser",
  email: "test@example.com",
  isAdmin: false,
  token: "mock-jwt-token",
};

/**
 * Register a SINGLE catch-all handler for all /api/ requests.
 * Uses a regex to match ONLY actual API endpoints (not Vite module paths).
 */
export async function mockApiRoutes(page: Page) {
  // Only match URLs where /api/ is at the ROOT path level (e.g. localhost:5001/api/...)
  // This avoids matching Vite module paths like /src/redux/api/apiSlice.ts
  await page.route(/^https?:\/\/localhost:\d+\/api\//, async (route) => {
    const url = new URL(route.request().url());
    const pathname = url.pathname;
    const method = route.request().method();

    // --- Products ---
    if (pathname === "/api/products/top") {
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(MOCK_PRODUCTS) });
    }
    if (pathname === "/api/products/new") {
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(MOCK_PRODUCTS) });
    }
    if (pathname === "/api/products/allproducts") {
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(MOCK_PRODUCTS) });
    }
    if (pathname === "/api/products/filtered-products") {
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(MOCK_PRODUCTS) });
    }
    // Paginated products list
    if (pathname === "/api/products" && method === "GET") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ products: MOCK_PRODUCTS, page: 1, pages: 1, hasMore: false }),
      });
    }
    // Single product
    if (pathname.startsWith("/api/products/")) {
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(MOCK_PRODUCTS[0]) });
    }

    // --- Categories ---
    if (pathname === "/api/category/categories") {
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(MOCK_CATEGORIES) });
    }
    if (pathname.startsWith("/api/category/")) {
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(MOCK_CATEGORIES[0]) });
    }

    // --- PayPal ---
    if (pathname === "/api/config/paypal") {
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ clientId: "test-paypal-id" }) });
    }

    // --- Users ---
    if (pathname === "/api/users/auth" && method === "POST") {
      return route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify(MOCK_USER) });
    }
    if (pathname === "/api/users/logout") {
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ message: "Logged out successfully" }) });
    }
    if (pathname === "/api/users" && method === "POST") {
      return route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify(MOCK_USER) });
    }
    if (pathname === "/api/users/profile") {
      return route.fulfill({ status: 401, contentType: "application/json", body: JSON.stringify({ message: "Not authorized" }) });
    }

    // --- Orders ---
    if (pathname.startsWith("/api/orders")) {
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([]) });
    }

    // --- Chat ---
    if (pathname.startsWith("/api/chat")) {
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ reply: "Hello!" }) });
    }

    // --- Health ---
    if (pathname === "/api/health") {
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ status: "OK" }) });
    }

    // Fallback: let unknown API routes through (or fulfill with 404)
    await route.fulfill({ status: 404, contentType: "application/json", body: JSON.stringify({ message: "Not found" }) });
  });
}
