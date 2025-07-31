import type { Config } from "drizzle-kit";

export default {
	dialect: "postgresql",
	schema: "./src/schemas",
	out: "./drizzle",
	dbCredentials: {
		url: process.env.DATABASE_URL as string,
	},
} satisfies Config;
