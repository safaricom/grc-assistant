import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

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
};
