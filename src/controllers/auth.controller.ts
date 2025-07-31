import { fromNodeHeaders } from "better-auth/node";
import type { Request, Response } from "express";
import { auth } from "@/lib/auth";

export const getMeHandler = async (req: Request, res: Response) => {
	try {
		const session = await auth.api.getSession({
			headers: fromNodeHeaders(req.headers),
		});

		if (!session?.user) {
			return res.status(401).json({ error: "Not authenticated" });
		}

		// Here you could call a user service to get more user details if needed
		// const userDetails = await UserService.findById(session.user.id);

		return res.status(200).json({ user: session.user });
	} catch (error) {
		console.error("Error in getMeHandler:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};
