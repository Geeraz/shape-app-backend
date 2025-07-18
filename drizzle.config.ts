import type { Config } from "drizzle-kit";

export default {
	dialect: "postgresql",
	schema: "./auth-schema.ts",
	out: "./drizzle",
	dbCredentials: {
		url: process.env.DATABASE_URL as string,
	},
} satisfies Config;
