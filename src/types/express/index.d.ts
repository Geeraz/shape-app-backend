import type { User } from "better-auth"; // Import the User type from your auth library

declare global {
	namespace Express {
		export interface Request {
			user?: User; // We use 'User' from better-auth, or you can define your own.
		}
	}
}
