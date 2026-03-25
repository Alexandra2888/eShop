import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

vi.mock("../config/db.js", () => ({ default: vi.fn() }));
vi.mock("morgan", () => ({ default: () => (_req: any, _res: any, next: any) => next() }));
vi.mock("../models/userModel.js", () => ({
  default: { findOne: vi.fn(), find: vi.fn(), findById: vi.fn(), deleteOne: vi.fn() },
}));
vi.mock("../models/categoryModel.js", () => ({
  default: { find: vi.fn().mockResolvedValue([]), findById: vi.fn(), findOne: vi.fn() },
}));
vi.mock("../models/orderModel.js", () => ({
  default: { find: vi.fn().mockResolvedValue([]), findById: vi.fn(), aggregate: vi.fn().mockResolvedValue([]) },
}));

/** Build a chainable query mock that resolves to `data` */
const chainable = (data: any) => {
  const q: any = {};
  ["sort", "limit", "populate", "select", "lean"].forEach((m) => {
    q[m] = vi.fn().mockReturnValue(q);
  });
  q.then = (resolve: any) => Promise.resolve(data).then(resolve);
  // Make it thenable so await works
  Object.defineProperty(q, Symbol.toStringTag, { value: "Promise" });
  return q;
};

const mockProductFind = vi.fn();
const mockProductCountDocuments = vi.fn();
const mockProductFindById = vi.fn();

vi.mock("../models/productModel.js", () => {
  const MockProduct: any = vi.fn().mockImplementation((data: any) => ({
    ...data,
    _id: "prod123",
    save: vi.fn().mockResolvedValue({ ...data, _id: "prod123" }),
  }));
  MockProduct.find = mockProductFind;
  MockProduct.findById = mockProductFindById;
  MockProduct.countDocuments = mockProductCountDocuments;
  return { default: MockProduct };
});

const { default: app } = await import("../app.js");

const SAMPLE_PRODUCTS = [
  {
    _id: "prod1",
    name: "Laptop Pro",
    price: 1299,
    category: "cat1",
    countInStock: 10,
    rating: 4.5,
    numReviews: 12,
    image: "/uploads/laptop.jpg",
    brand: "TechBrand",
    description: "A powerful laptop",
    reviews: [],
  },
  {
    _id: "prod2",
    name: "Wireless Headphones",
    price: 199,
    category: "cat1",
    countInStock: 25,
    rating: 4.2,
    numReviews: 8,
    image: "/uploads/headphones.jpg",
    brand: "AudioBrand",
    description: "Crystal clear sound",
    reviews: [],
  },
];

describe("Products API Endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/products/top", () => {
    it("returns an array of top rated products", async () => {
      // fetchTopProducts: Product.find({}).sort(...).limit(4) → resolves to array
      mockProductFind.mockReturnValueOnce(chainable(SAMPLE_PRODUCTS));

      const res = await request(app).get("/api/products/top");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /api/products/new", () => {
    it("returns an array of newest products", async () => {
      // fetchNewProducts: Product.find().sort(...).limit(5) → resolves to array
      mockProductFind.mockReturnValueOnce(chainable(SAMPLE_PRODUCTS));

      const res = await request(app).get("/api/products/new");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /api/products/allproducts", () => {
    it("returns all products populated with category", async () => {
      // fetchAllProducts: Product.find({}).populate(...).limit(12).sort(...) → resolves
      mockProductFind.mockReturnValueOnce(chainable(SAMPLE_PRODUCTS));

      const res = await request(app).get("/api/products/allproducts");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /api/products — paginated list", () => {
    it("returns products with pagination metadata", async () => {
      // fetchProducts: Product.countDocuments + Product.find({}).limit(pageSize)
      mockProductCountDocuments.mockResolvedValueOnce(2);
      mockProductFind.mockReturnValueOnce(chainable(SAMPLE_PRODUCTS));

      const res = await request(app).get("/api/products");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("products");
      expect(res.body).toHaveProperty("pages");
    });
  });

  describe("GET /api/products/:id", () => {
    it("returns 404 for non-existent product", async () => {
      mockProductFindById.mockResolvedValueOnce(null);

      const res = await request(app).get("/api/products/nonexistentid");
      expect(res.status).toBe(404);
    });

    it("returns product data when product exists", async () => {
      mockProductFindById.mockResolvedValueOnce(SAMPLE_PRODUCTS[0]);

      const res = await request(app).get("/api/products/prod1");
      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Laptop Pro");
    });
  });

  describe("POST /api/products/filtered-products", () => {
    it("returns filtered products array", async () => {
      mockProductFind.mockReturnValueOnce(chainable(SAMPLE_PRODUCTS));

      const res = await request(app)
        .post("/api/products/filtered-products")
        .send({ checked: [], radio: [0, 2000] });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
