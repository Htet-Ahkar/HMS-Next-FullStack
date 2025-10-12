import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createUser } from "@/lib/services/userService";
import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema/users";

describe("POST /api/users", () => {
  const testUser = {
    name: "Test User",
    email: "test@example.com",
    password: "testpass123",
    role: "PATIENT" as const,
  };

  beforeEach(async () => {
    // Clean up the database before each test
    await db.delete(users);
  });

  afterEach(async () => {
    // Clean up the database after each test
    await db.delete(users);
  });

  it("should create a new user successfully", async () => {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testUser),
    });

    expect(response.status).toBe(201);

    const data = await response.json();
    expect(data).toMatchObject({
      name: testUser.name,
      email: testUser.email,
      role: testUser.role,
    });
    expect(data.id).toBeDefined();
    expect(data.password).toBeUndefined();
  });

  it("should return 400 for invalid input", async () => {
    const invalidUser = {
      ...testUser,
      email: "invalid-email",
    };

    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invalidUser),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBeDefined();
  });

  it("should return 409 for duplicate email", async () => {
    // First create a user
    await createUser(testUser);

    // Try to create another user with the same email
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testUser),
    });

    expect(response.status).toBe(409);
    const data = await response.json();
    expect(data.error).toBeDefined();
  });
});
