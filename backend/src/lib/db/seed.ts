import { db, connectDb, pool } from "./index";
import { users } from "./schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

const SALT_ROUNDS = 10;

async function seed() {
  console.log("Connecting to database for seeding...");
  await connectDb();
  console.log("Database connected. Seeding...");

  // Create admin user if not exists
  const adminEmail = "admin@grc.com";
  const existingAdmin = await db.query.users.findFirst({
    where: eq(users.email, adminEmail),
  });

  if (!existingAdmin) {
    // Prefer a user-provided admin password via env var; otherwise generate one
    const provided = process.env.ADMIN_PASSWORD;
    const adminPlain = provided && provided.length > 0 ? provided : (Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6));
    const adminPasswordHash = await bcrypt.hash(adminPlain, SALT_ROUNDS);
    await db.insert(users).values({
      email: adminEmail,
      name: "Admin User",
      passwordHash: adminPasswordHash,
      role: "admin",
    });
    if (provided) {
      console.log("Admin user created: admin@grc.com (password from ADMIN_PASSWORD env)");
    } else {
      console.log("Admin user created: admin@grc.com (generated password)\nPlease note the generated password was printed to stdout for convenience but you should change it immediately in production.");
      console.log(`Generated admin password: ${adminPlain}`);
    }
  } else {
    console.log("Admin user already exists. Skipping.");
  }

  // Create sample user if not exists
  const sampleEmail = "user@grc.com";
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, sampleEmail),
  });

  if (!existingUser) {
    const userPasswordHash = await bcrypt.hash("user123", SALT_ROUNDS);
    await db.insert(users).values({
      email: sampleEmail,
      name: "Sample User",
      passwordHash: userPasswordHash,
      role: "user",
    });
    console.log("Sample user created: user@grc.com / user123");
  } else {
    console.log("Sample user already exists. Skipping.");
  }

  console.log("Database seeded successfully!");
}

seed()
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  })
  .finally(async () => {
    if (pool) {
      await pool.end();
      console.log("Database connection closed.");
    }
    process.exit(0);
  });
