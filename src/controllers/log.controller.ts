/** biome-ignore-all lint/style/noNonNullAssertion: <(It is safe to use it here)> */
import type { NextFunction, Request, Response } from "express";
import {
	zCreateExerciseLog,
	zCreateFoodLog,
	zCreateSleepLog,
	zCreateWaterLog,
	zCreateWeightLog,
} from "@/schemas/validation"; // Import all necessary Zod schemas
import { logService } from "@/services/log.services";

/**
 * A wrapper for async route handlers to catch errors and pass them to the global error handler.
 * This avoids repeating try...catch blocks in every controller.
 * @param fn The async controller function.
 */
const asyncHandler =
	// FIX: Replaced Promise<any> with Promise<unknown> for type safety
		(
			fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
		) =>
		(req: Request, res: Response, next: NextFunction) => {
			return Promise.resolve(fn(req, res, next)).catch(next);
		};

export const logController = {
	/**
	 * Creates a new food log entry after validating the request body.
	 */
	logFood: asyncHandler(async (req, res) => {
		// 1. Validate input - Zod throws an error if validation fails
		const validatedData = zCreateFoodLog.parse(req.body);

		// 2. Call service - req.user is guaranteed by requireAuth middleware
		const newLog = await logService.createFoodLog(req.user!.id, validatedData);

		// 3. Send response
		res.status(201).json(newLog);
	}),

	/**
	 * Creates a new water log entry after validating the request body.
	 */
	logWater: asyncHandler(async (req, res) => {
		const validatedData = zCreateWaterLog.parse(req.body);
		const newLog = await logService.createWaterLog(req.user!.id, validatedData);
		res.status(201).json(newLog);
	}),

	/**
	 * Creates a new exercise log entry after validating the request body.
	 */
	logExercise: asyncHandler(async (req, res) => {
		const validatedData = zCreateExerciseLog.parse(req.body);
		const newLog = await logService.createExerciseLog(
			req.user!.id,
			validatedData,
		);
		res.status(201).json(newLog);
	}),

	/**
	 * Creates a new sleep log entry after validating the request body..
	 */
	logSleep: asyncHandler(async (req, res) => {
		const validatedData = zCreateSleepLog.parse(req.body);
		const newLog = await logService.createSleepLog(req.user!.id, validatedData);
		res.status(201).json(newLog);
	}),

	/**
	 * Creates a new weight log entry after validating the request body.
	 */
	logWeight: asyncHandler(async (req, res) => {
		const validatedData = zCreateWeightLog.parse(req.body);
		const newLog = await logService.createWeightLog(
			req.user!.id,
			validatedData,
		);
		res.status(201).json(newLog);
	}),

	/**
	 * Gets logs from the last 7 days, grouped by day according to the user's timezone.
	 * The timezone is read from the 'X-Timezone' request header.
	 */
	getLogsByDay: asyncHandler(async (req, res) => {
		// Best Practice: Get the timezone from a custom header.
		// Provide 'UTC' as a safe fallback if the header is not present.
		const clientTimezone = (req.headers["x-timezone"] as string) || "UTC";

		const logs = await logService.getLogsGroupedByDay(
			req.user!.id,
			clientTimezone,
		);

		if (!logs) {
			// Handle the case where the user exists but has no logs.
			return res
				.status(200)
				.json({ user: { id: req.user!.id }, logsByDay: {} });
		}

		res.status(200).json(logs);
	}),

	/**
	 * Gets all logs for the authenticated user.
	 */
	getAllLogs: asyncHandler(async (req, res) => {
		const logs = await logService.getAllLogsForUser(req.user!.id);
		if (!logs) {
			// You might want to return an empty object or just the user info
			return res.status(200).json({ user: { id: req.user!.id }, logs: {} });
		}
		res.status(200).json(logs);
	}),
};
