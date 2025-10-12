import { describe, it, expect, vi, beforeEach } from "vitest";
import { createUser } from "../userService";
import { db } from "../../../drizzle/db";
import { ValidationError, ConflictError } from "../../types/user";
import bcrypt from "bcrypt";

// Mock the database and bcrypt
vi.mock("../../db", () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
  },
}));

vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn(),
  },
}));

describe("userService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createUser", () => {
    const validUserData = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      role: "PATIENT" as const,
    };

    it("should create a user successfully", async () => {
      // const hashedPassword = "hashedPassword123";
      const expectedUser = {
        id: "123",
        ...validUserData,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      };

      // Mock DB responses
      // vi.mocked(db.select).mockResolvedValue([]);
      // vi.mocked(bcrypt.hash).mockResolvedValue(hashedPassword);
      // vi.mocked(db.insert).mockResolvedValue([expectedUser]);

      const result = await createUser(validUserData);

      expect(result).toEqual(expectedUser);
      expect(db.select).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(validUserData.password, 10);
      expect(db.insert).toHaveBeenCalled();
    });

    it("should throw ValidationError for invalid email", async () => {
      const invalidData = { ...validUserData, email: "invalid-email" };

      await expect(createUser(invalidData)).rejects.toThrow(ValidationError);
      expect(db.select).not.toHaveBeenCalled();
    });

    it("should throw ValidationError for short password", async () => {
      const invalidData = { ...validUserData, password: "123" };

      await expect(createUser(invalidData)).rejects.toThrow(ValidationError);
      expect(db.select).not.toHaveBeenCalled();
    });

    it("should throw ConflictError if email exists", async () => {
      // vi.mocked(db.select).mockResolvedValue([
      //   { id: "123", email: validUserData.email },
      // ]);

      await expect(createUser(validUserData)).rejects.toThrow(ConflictError);
      expect(db.select).toHaveBeenCalled();
      expect(db.insert).not.toHaveBeenCalled();
    });
  });
});
