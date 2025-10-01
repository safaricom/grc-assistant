import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import * as schema from "./schema";
import { users } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import path from "path";

const { POSTGRES_HOST, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_PORT } = process.env;

// Create a placeholder for the database instance
export let db: NodePgDatabase<typeof schema>;
export let pool: Pool;

export const connectDb = async () => {
  if (db) {
    console.log("Database already connected.");
    return;
  }

  console.log("Connecting to database...");

  if (!POSTGRES_HOST || !POSTGRES_DB || !POSTGRES_USER || !POSTGRES_PASSWORD) {
    throw new Error("Missing PostgreSQL connection environment variables");
  }

  pool = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    port: POSTGRES_PORT ? parseInt(POSTGRES_PORT, 10) : 5432,
    ssl: false,
  });

  // Test the connection
  await pool.query("SELECT 1");

  db = drizzle(pool, { schema });
  console.log("Database connected successfully.");

  // Run migrations
  console.log("Running database migrations...");
  const migrationsFolder = path.join(__dirname, "../../../drizzle");
  await migrate(db, { migrationsFolder });
  console.log("Database migrations completed.");

  // Seed initial data
  await seedDatabase();
};

// Seed function to create initial users
async function seedDatabase() {
  const SALT_ROUNDS = 10;

  console.log("Checking for initial data...");

  // Create admin user if not exists
  const adminEmail = "admin@grc.com";
  const existingAdmin = await db.query.users.findFirst({
    where: (fields: any) => eq(fields.email, adminEmail),
  });

  if (!existingAdmin) {
    const provided = process.env.ADMIN_PASSWORD;
    const adminPlain = provided && provided.length > 0 ? provided : "admin@321";
    const adminPasswordHash = await bcrypt.hash(adminPlain, SALT_ROUNDS);
    await db.insert(users).values({
      email: adminEmail,
      name: "Admin User",
      passwordHash: adminPasswordHash,
      role: "admin",
    });
    console.log(`Admin user created: ${adminEmail}`);
  } else {
    console.log("Admin user already exists.");
  }

  // Create sample user if not exists
  const sampleEmail = "user@grc.com";
  const existingUser = await db.query.users.findFirst({
    where: (fields: any) => eq(fields.email, sampleEmail),
  });

  if (!existingUser) {
    const userPasswordHash = await bcrypt.hash("user123", SALT_ROUNDS);
    await db.insert(users).values({
      email: sampleEmail,
      name: "Sample User",
      passwordHash: userPasswordHash,
      role: "user",
    });
    console.log(`Sample user created: ${sampleEmail}`);
  } else {
    console.log("Sample user already exists.");
  }

  console.log("Database seeding completed.");
}
