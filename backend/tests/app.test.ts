import { describe, it, expect, vi } from "vitest";
import request from "supertest";

vi.mock("../config/db.js", () => ({ default: vi.fn() }));
vi.mock("morgan", () => ({ default: () => (_req: any, _res: any, next: any) => next() }));

/** Build a thenable chainable query mock that resolves to `data` */
const makeQuery = (data: any) => {
  const q: any = {};
  ["sort", "limit", "populate", "select", "lean"].forEach((m) => {
    q[m] = vi.fn().mockReturnValue(q);
  });
  // Make it awaitable
  q.then = (resolve: any, reject: any) => Promise.resolve(data).then(resolve, reject);
  q.catch = (fn: any) => Promise.resolve(data).catch(fn);
  return q;
};

vi.mock("../models/userModel.js", () => ({
  default: {
    find: vi.fn(),
    findOne: vi.fn(),
    findById: vi.fn(),
    deleteOne: vi.fn(),
  },
}));

vi.mock("../models/productModel.js", () => {
  const MockProduct: any = vi.fn();
  MockProduct.find = vi.fn().mockReturnValue(makeQuery([]));
  MockProduct.findById = vi.fn().mockResolvedValue(null);
  MockProduct.countDocuments = vi.fn().mockResolvedValue(0);
  return { default: MockProduct };
});

vi.mock("../models/categoryModel.js", () => ({
  default: {
    find: vi.fn().mockReturnValue(makeQuery([])),
    findById: vi.fn().mockResolvedValue(null),
    findOne: vi.fn().mockResolvedValue(null),
  },
}));

vi.mock("../models/orderModel.js", () => ({
  default: {
    find: vi.fn().mockReturnValue(makeQuery([])),
    findById: vi.fn().mockResolvedValue(null),
    aggregate: vi.fn().mockResolvedValue([]),
  },
}));

const { default: app } = await import("../app.js");

describe("Health & Root Endpoints", () => {
  describe("GET /api/health", () => {
    it("returns 200 with status OK", async () => {
      const res = await request(app).get("/api/health");
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("OK");
      expect(res.body).toHaveProperty("timestamp");
    });
  });

  describe("GET /", () => {
    it("returns API info with endpoint links", async () => {
      const res = await request(app).get("/");
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("eShop API is running...");
      expect(res.body.endpoints).toMatchObject({
        health: "/api/health",
        products: "/api/products",
        users: "/api/users",
        orders: "/api/orders",
      });
    });
  });

  describe("GET /api/config/paypal", () => {
    it("returns PayPal client id from env", async () => {
      const res = await request(app).get("/api/config/paypal");
      expect(res.status).toBe(200);
      expect(res.body.clientId).toBe("test-paypal-client-id");
    });
  });
});

describe("Products Public Endpoints", () => {
  describe("GET /api/products/top", () => {
    it("returns an array", async () => {
      const Product = (await import("../models/productModel.js")).default as any;
      Product.find.mockReturnValueOnce(makeQuery([{ _id: "p1", name: "Laptop", rating: 5 }]));

      const res = await request(app).get("/api/products/top");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /api/products/new", () => {
    it("returns an array", async () => {
      const Product = (await import("../models/productModel.js")).default as any;
      Product.find.mockReturnValueOnce(makeQuery([{ _id: "p1", name: "New Product" }]));

      const res = await request(app).get("/api/products/new");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /api/products/allproducts", () => {
    it("returns an array", async () => {
      const Product = (await import("../models/productModel.js")).default as any;
      Product.find.mockReturnValueOnce(makeQuery([{ _id: "p1", name: "All Product" }]));

      const res = await request(app).get("/api/products/allproducts");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});

describe("Category Public Endpoints", () => {
  describe("GET /api/category/categories", () => {
    it("returns list of categories", async () => {
      const Category = (await import("../models/categoryModel.js")).default as any;
      Category.find.mockReturnValueOnce(
        makeQuery([{ _id: "cat1", name: "Electronics" }, { _id: "cat2", name: "Clothing" }])
      );

      const res = await request(app).get("/api/category/categories");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
