import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../schemas";
import * as relations from "../schemas/relations"; // 1. Import the new relations file

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

// 2. Combine schemas and relations for the Drizzle instance
const db = drizzle(pool, {
	schema: { ...schema, ...relations },
	casing: "snake_case",
});

export { db, pool };
