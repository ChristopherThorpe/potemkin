import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Check if we're in development or production
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL or POSTGRES_URL environment variable not set');
}

// Create a Postgres client
const client = postgres(connectionString, {
  ssl: { rejectUnauthorized: false }
});

// Create a Drizzle instance
const db = drizzle(client, { schema });

export default db;
