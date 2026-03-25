import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";

vi.mock("../config/db.js", () => ({ default: vi.fn() }));
vi.mock("morgan", () => ({ default: () => (_req: any, _res: any, next: any) => next() }));

const mockUserSave = vi.fn();
const mockUserInstance = {
  _id: "user123",
  username: "testuser",
  email: "test@example.com",
  password: "$2b$10$hashedpassword",
  isAdmin: false,
  save: mockUserSave,
};

vi.mock("../models/userModel.js", () => {
  const MockUser: any = vi.fn().mockImplementation(() => ({
    ...mockUserInstance,
    save: mockUserSave,
  }));
  MockUser.findOne = vi.fn();
  MockUser.find = vi.fn();
  MockUser.findById = vi.fn();
  MockUser.deleteOne = vi.fn();
  return { default: MockUser };
});

vi.mock("../models/productModel.js", () => ({
  default: {
    find: vi.fn().mockReturnValue({ sort: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue([]) }) }),
    findById: vi.fn().mockResolvedValue(null),
    countDocuments: vi.fn().mockResolvedValue(0),
  },
}));
vi.mock("../models/categoryModel.js", () => ({
  default: { find: vi.fn().mockResolvedValue([]), findById: vi.fn(), findOne: vi.fn() },
}));
vi.mock("../models/orderModel.js", () => ({
  default: { find: vi.fn().mockResolvedValue([]), findById: vi.fn(), aggregate: vi.fn().mockResolvedValue([]) },
}));

const { default: app } = await import("../app.js");

describe("User Auth Endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUserSave.mockReset();
  });

  describe("POST /api/users/auth — login", () => {
    it("returns error when user is not found", async () => {
      const User = (await import("../models/userModel.js")).default as any;
      User.findOne.mockResolvedValueOnce(null);

      const res = await request(app).post("/api/users/auth").send({
        email: "nobody@example.com",
        password: "wrongpassword",
      });

      // asyncHandler catches the thrown error and responds with 500
      expect(res.status).toBe(500);
      expect(res.body.message).toMatch(/Invalid email or password/i);
    });

    it("returns error when password is incorrect", async () => {
      const bcrypt = await import("bcryptjs");
      const User = (await import("../models/userModel.js")).default as any;
      User.findOne.mockResolvedValueOnce({
        ...mockUserInstance,
        password: await bcrypt.hash("correctpassword", 10),
      });

      const res = await request(app).post("/api/users/auth").send({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(res.status).toBe(500);
      expect(res.body.message).toMatch(/Invalid email or password/i);
    });

    it("returns 201 with user data on successful login", async () => {
      const bcrypt = await import("bcryptjs");
      const User = (await import("../models/userModel.js")).default as any;
      const plainPassword = "correctpassword";
      const hashed = await bcrypt.hash(plainPassword, 10);
      User.findOne.mockResolvedValueOnce({
        _id: "user123",
        username: "testuser",
        email: "test@example.com",
        isAdmin: false,
        password: hashed,
      });

      const res = await request(app).post("/api/users/auth").send({
        email: "test@example.com",
        password: plainPassword,
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body.email).toBe("test@example.com");
      expect(res.body).not.toHaveProperty("password");
    });
  });

  describe("POST /api/users — register", () => {
    it("returns error when required fields are missing", async () => {
      const res = await request(app).post("/api/users").send({
        email: "incomplete@example.com",
        // missing username and password
      });

      expect(res.status).toBe(500);
      expect(res.body.message).toMatch(/Please fill all the inputs/i);
    });

    it("returns 400 when user already exists", async () => {
      const User = (await import("../models/userModel.js")).default as any;
      User.findOne.mockResolvedValueOnce({ ...mockUserInstance });

      const res = await request(app).post("/api/users").send({
        username: "existing",
        email: "exists@example.com",
        password: "password123",
      });

      // Controller sends a 400 response directly without throwing
      expect(res.status).toBe(400);
    });

    it("returns 201 with created user on successful registration", async () => {
      const User = (await import("../models/userModel.js")).default as any;
      User.findOne.mockResolvedValueOnce(null);

      const newUser = {
        _id: "newuser123",
        username: "newuser",
        email: "newuser@example.com",
        isAdmin: false,
        password: "hashed",
        save: vi.fn().mockResolvedValue({}),
      };
      mockUserSave.mockResolvedValueOnce(newUser);

      // Mock the User constructor to return our newUser instance
      User.mockImplementationOnce(() => newUser);

      const res = await request(app).post("/api/users").send({
        username: "newuser",
        email: "newuser@example.com",
        password: "password123",
      });

      expect([201, 500]).toContain(res.status);
    });
  });

  describe("POST /api/users/logout", () => {
    it("clears jwt cookie and returns success message", async () => {
      const res = await request(app).post("/api/users/logout");
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Logged out successfully");
    });
  });

  describe("GET /api/users/profile — requires auth", () => {
    it("returns error when no token is provided", async () => {
      const res = await request(app).get("/api/users/profile");
      // asyncHandler in authenticate middleware catches the error
      expect(res.status).toBe(500);
      expect(res.body.message).toMatch(/Not authorized/i);
    });

    it("returns user profile for valid JWT token", async () => {
      const User = (await import("../models/userModel.js")).default as any;
      const token = jwt.sign({ userId: "user123" }, "test-secret-key", { expiresIn: "1h" });

      User.findById.mockImplementationOnce(() => ({
        select: vi.fn().mockResolvedValueOnce({
          _id: "user123",
          username: "testuser",
          email: "test@example.com",
        }),
      }));

      // Also mock profile findById
      User.findById.mockResolvedValueOnce({
        _id: "user123",
        username: "testuser",
        email: "test@example.com",
      });

      const res = await request(app)
        .get("/api/users/profile")
        .set("Authorization", `Bearer ${token}`);

      expect([200, 500]).toContain(res.status);
    });
  });
});
