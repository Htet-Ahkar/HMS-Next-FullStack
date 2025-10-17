import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcrypt";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function hashedPassword(pw: string) {
  const salt = process.env.SALT;
  return await bcrypt.hash(pw, salt || 10);
}
