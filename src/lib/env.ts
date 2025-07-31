import dotenv from "dotenv";
import { z } from "zod";

// Load .env file in development
if (process.env.NODE_ENV !== "production") {
	dotenv.config();
}

const envSchema = z.object({
	DATABASE_URL: z.string().url(),
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	PORT: z.coerce.number().default(3000),
	EXPO_BASE_URL: z.string().url().default("http://localhost:19006"),
	BETTER_AUTH_SECRET: z.string(),
	AUTH_TRUST_HOST: z.string().optional().default("true"), // Should be true for dev
	AUTH_TRUST_ORIGIN: z.string(),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
