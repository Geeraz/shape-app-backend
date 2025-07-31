import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";
import { auth } from "@/lib/auth";

/**
 * This middleware verifies the user's session.
 * If the session is valid, it attaches the user object to `req.user` and calls next().
 * If the session is invalid or missing, it responds with a 401 Unauthorized error.
 */
export const requireAuth = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const session = await auth.api.getSession({
			headers: fromNodeHeaders(req.headers),
		});
		console.log(req.headers);
		if (!session?.user) {
			return res.status(401).json({ error: "Unauthorized: No active session" });
		}

		// Attach the user object to the request
		req.user = session.user;

		// Proceed to the next middleware or route handler
		next();
	} catch (error) {
		console.error("Authentication error in middleware:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};
