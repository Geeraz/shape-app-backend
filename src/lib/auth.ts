import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { database } from "../db";

export const auth = betterAuth({
	trustedOrigins: ["shapeapp://"],
	database: drizzleAdapter(database, {
		provider: "pg", // or "mysql", "sqlite"
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
