import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { users } from "../../drizzle/schema/users";
import { db } from "../../drizzle/db";
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponse,
  ValidationError,
  ConflictError,
} from "../types/user";

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const getUsers = async (): Promise<UserResponse[]> => {
  const users_list = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users);

  return users_list;
};

export const getUser = async (id: string): Promise<UserResponse | null> => {
  const user = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, id));

  return user[0] || null;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const result = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning({ id: users.id });

  return result.length > 0;
};

export const updateUser = async (
  id: string,
  data: UpdateUserDto
): Promise<UserResponse | null> => {
  // Validate input if provided
  if (data.email && !validateEmail(data.email)) {
    throw new ValidationError("Invalid email format");
  }

  if (data.password && !validatePassword(data.password)) {
    throw new ValidationError("Password must be at least 8 characters long");
  }

  if (data.name && data.name.length < 2) {
    throw new ValidationError("Name must be at least 2 characters long");
  }

  // Check if email is being updated and if it already exists
  if (data.email) {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email));
    if (existingUser.length > 0 && existingUser[0].id !== id) {
      throw new ConflictError("Email already exists");
    }
  }

  // Hash new password if provided
  const updateData: Partial<typeof data> = { ...data };
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  // Update user
  const updatedUser = await db
    .update(users)
    .set({
      ...updateData,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    });

  return updatedUser[0] || null;
};

export const createUser = async (
  data: CreateUserDto
): Promise<UserResponse> => {
  // Validate input
  if (!data.name || data.name.length < 2) {
    throw new ValidationError("Name must be at least 2 characters long");
  }

  if (!validateEmail(data.email)) {
    throw new ValidationError("Invalid email format");
  }

  if (!validatePassword(data.password)) {
    throw new ValidationError("Password must be at least 8 characters long");
  }

  // Check if email already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email));
  if (existingUser.length > 0) {
    throw new ConflictError("Email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Create user
  const newUser = await db
    .insert(users)
    .values({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    });

  return newUser[0];
};
