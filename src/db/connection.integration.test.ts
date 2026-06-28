import { describe, it, expect } from "vitest";
import { neon } from "@neondatabase/serverless";

describe("database connection", () => {
  it("connects and runs a trivial query", async () => {
    const url = process.env.DATABASE_URL;
    expect(url, "DATABASE_URL must be set").toBeTruthy();
    const sql = neon(url!);
    const rows = await sql`SELECT 1 AS value`;
    expect(Number(rows[0].value)).toBe(1);
  });
});
