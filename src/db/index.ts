import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";

import * as schema from "./schema";

type Database = NeonHttpDatabase<typeof schema>;

let dbInstance: Database | null = null;

function getDb(): Database {
  if (!dbInstance) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error(
        "DATABASE_URL is not set. A database connection is required at runtime.",
      );
    }

    const sql = neon(connectionString);
    dbInstance = drizzle({ client: sql, schema });
  }

  return dbInstance;
}

export const db = new Proxy({} as Database, {
  get(_target, prop) {
    const instance = getDb();
    const value = instance[prop as keyof Database];
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
