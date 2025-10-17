import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} from "../userService";
import { db } from "../../../drizzle/db";
import {
  ValidationError,
  ConflictError,
  MethodNotAllowedError,
} from "../../types/user";
import bcrypt from "bcrypt";

// Mock functions
const mockSelectQuery = {
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  returning: vi.fn(),
};

const mockUpdateQuery = {
  set: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  returning: vi.fn(),
};

const mockDeleteQuery = {
  where: vi.fn().mockReturnThis(),
  returning: vi.fn(),
};

const mockInsertQuery = {
  values: vi.fn().mockReturnThis(),
  returning: vi.fn(),
};

// Mock the database and bcrypt
vi.mock("../../../drizzle/db", () => ({
  db: {
    select: vi.fn(() => mockSelectQuery),
    insert: vi.fn(() => mockInsertQuery),
    update: vi.fn(() => mockUpdateQuery),
    delete: vi.fn(() => mockDeleteQuery),
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

  const validUserData = {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    role: "PATIENT" as const,
  };

  const mockUser = {
    id: "123",
    name: "John Doe",
    email: "john@example.com",
    role: "PATIENT" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe("getUsers", () => {
    it("should return all users", async () => {
      mockSelectQuery.returning.mockResolvedValue([mockUser]);

      const result = await getUsers();

      expect(result).toEqual([mockUser]);
      expect(db.select).toHaveBeenCalled();
    });
  });

  describe("getUser", () => {
    it("should return a user by id", async () => {
      mockSelectQuery.returning.mockResolvedValue([mockUser]);

      const result = await getUser("123");

      expect(result).toEqual(mockUser);
      expect(db.select).toHaveBeenCalled();
    });

    it("should return null if user not found", async () => {
      mockSelectQuery.returning.mockResolvedValue([]);

      const result = await getUser("456");

      expect(result).toBeNull();
      expect(db.select).toHaveBeenCalled();
    });
  });

  describe("updateUser", () => {
    const updateData = {
      name: "Jane Doe",
      email: "jane@example.com",
    };

    it("should update user successfully", async () => {
      mockSelectQuery.returning.mockResolvedValue([]);
      mockUpdateQuery.returning.mockResolvedValue([
        { ...mockUser, ...updateData },
      ]);

      const result = await updateUser("123", updateData);

      expect(result).toMatchObject(updateData);
      expect(db.update).toHaveBeenCalled();
    });

    it("should throw ValidationError for invalid email", async () => {
      await expect(
        updateUser("123", { email: "invalid-email" })
      ).rejects.toThrow(ValidationError);
    });

    it("should throw ConflictError if email exists", async () => {
      mockSelectQuery.returning.mockResolvedValue([
        { id: "456", email: updateData.email },
      ]);

      await expect(updateUser("123", updateData)).rejects.toThrow(
        ConflictError
      );
    });
  });

  describe("deleteUser", () => {
    it("should delete user successfully", async () => {
      mockDeleteQuery.returning.mockResolvedValue([{ id: "123" }]);

      const result = await deleteUser("123");

      expect(result).toBe(true);
      expect(db.delete).toHaveBeenCalled();
    });

    it("should return false if user not found", async () => {
      mockDeleteQuery.returning.mockResolvedValue([]);

      const result = await deleteUser("456");

      expect(result).toBe(false);
      expect(db.delete).toHaveBeenCalled();
    });
  });

  describe("createUser", () => {
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

    it("should throw MethodNotAllowedError for non-PATIENT roles", async () => {
      const adminData = { ...validUserData, role: "ADMIN" as const };
      const doctorData = { ...validUserData, role: "DOCTOR" as const };
      const receptionistData = {
        ...validUserData,
        role: "RECEPTIONIST" as const,
      };

      await expect(createUser(adminData)).rejects.toThrow(
        MethodNotAllowedError
      );
      await expect(createUser(doctorData)).rejects.toThrow(
        MethodNotAllowedError
      );
      await expect(createUser(receptionistData)).rejects.toThrow(
        MethodNotAllowedError
      );

      expect(db.select).not.toHaveBeenCalled();
      expect(db.insert).not.toHaveBeenCalled();
    });
  });
});
