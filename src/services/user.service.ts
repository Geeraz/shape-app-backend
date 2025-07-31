import { eq } from "drizzle-orm";
import { db } from "@/db";
import { user, userSettings } from "@/schemas";
import type { UserUpdate } from "@/schemas/validation"; // Using your Zod type

/**
 * A service for user-related database operations, using relations and transactions.
 */
export const userService = {
	/**
	 * Fetches a single user by their ID, efficiently joining their settings.
	 *
	 * @param id The UUID of the user.
	 * @returns The user object with a nested settings object, or null if not found.
	 */
	async getById(id: string) {
		return db.query.user.findFirst({
			where: eq(user.id, id),
			with: {
				settings: true, // This tells Drizzle to JOIN and include userSettings
			},
		});
	},

	/**
	 * Updates a user's profile and/or settings within a single atomic transaction.
	 *
	 * @param id The UUID of the user to update.
	 * @param data An object containing profile and/or settings fields to update.
	 * @returns The fully updated user object with their settings.
	 */
	async updateProfile(id: string, data: UserUpdate) {
		const { settings, ...profileData } = data;

		// A transaction ensures that both updates succeed or neither do.
		return db.transaction(async (tx) => {
			// 1. Update the main user table if profile data is present.
			if (Object.keys(profileData).length > 0) {
				await tx.update(user).set(profileData).where(eq(user.id, id));
			}

			// 2. Upsert (insert or update) the user settings if present.
			if (settings && Object.keys(settings).length > 0) {
				await tx
					.insert(userSettings)
					.values({ userId: id, ...settings })
					.onConflictDoUpdate({
						target: userSettings.userId,
						set: settings,
					});
			}

			// 3. Fetch and return the fresh, complete user data.
			const updatedUser = await tx.query.user.findFirst({
				where: eq(user.id, id),
				with: {
					settings: true,
				},
			});

			if (!updatedUser) {
				throw new Error(
					"User not found after update, transaction rolled back.",
				);
			}

			return updatedUser;
		});
	},

	/**
	 * Deletes a user. All related data will be removed due to "on cascade" in your schema.
	 *
	 * @param id The UUID of the user to delete.
	 */
	async delete(id: string) {
		const [deletedUser] = await db
			.delete(user)
			.where(eq(user.id, id))
			.returning();
		return deletedUser;
	},
};
