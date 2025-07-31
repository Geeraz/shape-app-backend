/** biome-ignore-all lint/style/noNonNullAssertion: <It is safe to use it here> */
import type { NextFunction, Request, Response } from "express";
import { zUserUpdate } from "@/schemas/validation";
import { userService } from "@/services/user.service";

export const userController = {
	/**
	 * Gets the currently authenticated user's profile.
	 */
	async getMyProfile(req: Request, res: Response) {
		// The user ID comes from the requireAuth middleware
		const user = await userService.getById(req.user!.id);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		return res.status(200).json(user);
	},

	/**
	 * Updates the currently authenticated user's profile.
	 */
	async updateMyProfile(req: Request, res: Response, next: NextFunction) {
		try {
			// 1. Validate the incoming request body
			const validatedData = zUserUpdate.parse(req.body);

			// 2. Call the service with the user's ID and validated data
			const updatedUser = await userService.updateProfile(
				req.user!.id,
				validatedData,
			);

			// 3. Send the successful response
			return res.status(200).json(updatedUser);
		} catch (error) {
			// 3. Pass any errors (including Zod validation errors) to the global error handler
			next(error);
		}
	},
};
