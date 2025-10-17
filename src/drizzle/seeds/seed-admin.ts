import "dotenv/config";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { hash } from "bcryptjs";
import { db } from "../db";

async function seedAdmin() {
  const adminName = process.env.ADMIN_NAME;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const salt = process.env.SALT;

  if (!adminName || !adminEmail || !adminPassword) {
    console.error("❌ Missing ADMIN_* environment variables.");
    process.exit(1);
  }

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, adminEmail))
    .limit(1);

  if (existing.length === 0) {
    const hashedPassword = await hash(adminPassword, salt || 10);
    await db.insert(users).values({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
    });
    console.log("✅ Admin user created successfully");
  } else {
    console.log("ℹ️ Admin user already exists");
  }
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
