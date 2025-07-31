import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { env } from "./env";

export const auth = betterAuth({
	// --- Your existing, working configuration ---
	trustedOrigins: [env.AUTH_TRUST_ORIGIN],
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	emailAndPassword: {
		enabled: true,
	},
	plugins: [expo()], // Keep the expo plugin
});
