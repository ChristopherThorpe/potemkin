import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema.ts";
import "dotenv/config";

// Get the connection string from environment variables
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  console.error("Missing DATABASE_URL or POSTGRES_URL environment variable");
  process.exit(1);
}

async function main() {
  console.log("Running migrations...");
  
  // Create a Postgres client for migrations
  const migrationClient = postgres(connectionString || "", {
    max: 1,
    ssl: { rejectUnauthorized: false },
  });
  
  // Create a Drizzle instance for migrations
  const db = drizzle(migrationClient, { schema });
  
  // Run migrations
  await migrate(db, { migrationsFolder: "./src/db/migrations" });
  
  console.log("Migrations complete!");
  process.exit(0);
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
