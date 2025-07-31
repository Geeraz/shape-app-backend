import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { env } from "./env";

export const auth = betterAuth({
	trustedOrigins: [env.AUTH_TRUST_ORIGIN],
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	emailAndPassword: {
		enabled: true,
	},
	plugins: [expo()],
	// socialProviders: {
	// 	github: {
	// 		clientId: process.env.GITHUB_CLIENT_ID as string,
	// 		clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
	// 	},
	// google: {
	// 	clientId: process.env.GOOGLE_CLIENT_ID as string,
	// 	clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
	// },
	// },
});
