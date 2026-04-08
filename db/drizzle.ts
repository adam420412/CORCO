import * as schema from "./schema";

function createDb() {
  const url = process.env.DATABASE_URL;

  // During build without DATABASE_URL, return a dummy that will fail at runtime
  if (!url) {
    const { neon } = require("@neondatabase/serverless");
    const { drizzle } = require("drizzle-orm/neon-http");
    const sql = neon("postgresql://placeholder:placeholder@placeholder/placeholder");
    return drizzle(sql, { schema });
  }

  // Use Neon serverless for production/Vercel, pg for local dev
  if (url.includes("neon.tech") || process.env.VERCEL) {
    const { neon } = require("@neondatabase/serverless");
    const { drizzle } = require("drizzle-orm/neon-http");
    const sql = neon(url);
    return drizzle(sql, { schema });
  }

  const { Pool } = require("pg");
  const { drizzle } = require("drizzle-orm/node-postgres");
  const pool = new Pool({ connectionString: url });
  return drizzle(pool, { schema });
}

const db = createDb();

export default db;
