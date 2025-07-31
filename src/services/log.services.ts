import { startOfDay } from "date-fns";
import { format, toZonedTime } from "date-fns-tz";
import { desc, eq, gte } from "drizzle-orm";

import { db } from "@/db";
import {
	exerciseLog,
	foodLog,
	sleepLog,
	user,
	waterLog,
	weightLog,
} from "@/schemas";
import type {
	CreateExerciseLog,
	CreateFoodLog,
	CreateSleepLog,
	CreateWaterLog,
	CreateWeightLog,
} from "@/schemas/validation"; // Your Zod types

// Define the shape of our final, grouped-by-day object for type safety
type LogType =
	| typeof foodLog.$inferSelect
	| typeof waterLog.$inferSelect
	| typeof exerciseLog.$inferSelect
	| typeof weightLog.$inferSelect
	| typeof sleepLog.$inferSelect;

type GroupedLogs = Record<
	string,
	{
		foodLogs: (typeof foodLog.$inferSelect)[];
		waterLogs: (typeof waterLog.$inferSelect)[];
		exerciseLogs: (typeof exerciseLog.$inferSelect)[];
		weightLogs: (typeof weightLog.$inferSelect)[];
		sleepLogs: (typeof sleepLog.$inferSelect)[];
	}
>;

/**
 * A service for creating and retrieving various types of user logs.
 */
export const logService = {
	/** Creates a new food log entry. */
	createFoodLog: async (userId: string, data: CreateFoodLog) => {
		const [newLog] = await db
			.insert(foodLog)
			.values({ ...data, userId })
			.returning();
		return newLog;
	},

	/** Creates a new water log entry. */
	createWaterLog: async (userId: string, data: CreateWaterLog) => {
		const [newLog] = await db
			.insert(waterLog)
			.values({ ...data, userId })
			.returning();
		return newLog;
	},

	/** Creates a new weight log entry. */
	createWeightLog: async (userId: string, data: CreateWeightLog) => {
		const [newLog] = await db
			.insert(weightLog)
			.values({ ...data, userId })
			.returning();
		return newLog;
	},

	/** Creates a new exercise log entry. */
	createExerciseLog: async (userId: string, data: CreateExerciseLog) => {
		const [newLog] = await db
			.insert(exerciseLog)
			.values({ ...data, userId })
			.returning();
		return newLog;
	},

	/** Creates a new sleep log entry. */
	createSleepLog: async (userId: string, data: CreateSleepLog) => {
		const [newLog] = await db
			.insert(sleepLog)
			.values({ ...data, userId })
			.returning();
		return newLog;
	},

	/**
	 * Fetches all logs for a specific user.
	 * Demonstrates fetching multiple types of related data in one go.
	 *
	 * @param userId The user's ID.
	 */
	getAllLogsForUser: async (userId: string) => {
		// This now works because 'user' is imported.
		return db.query.user.findFirst({
			where: eq(user.id, userId),
			columns: {
				id: true, // Only select columns you need
				name: true,
			},
			with: {
				foodLogs: { orderBy: [desc(foodLog.loggedAt)] },
				weightLogs: { orderBy: [desc(weightLog.loggedAt)] },
				waterLogs: { orderBy: [desc(waterLog.loggedAt)] },
				exerciseLogs: { orderBy: [desc(exerciseLog.loggedAt)] },
				sleepLogs: { orderBy: [desc(sleepLog.loggedAt)] },
			},
		});
	},
	/**
	 * Fetches logs from the last 7 days and groups them by calendar date.
	 *
	 * @param userId The user's ID.
	 * @returns An object where keys are dates (YYYY-MM-DD) and values are the logs for that day.
	 */
	async getLogsGroupedByDay(userId: string, clientTimezone: string = "UTC") {
		// --- 1. CALCULATE THE START DATE FOR THE DATABASE QUERY ---

		// Get the current moment in time.
		const now = new Date();

		// Create a `Date` object that represents the start of "today" in the user's timezone.
		// `startOfDay` zeroes the time. `toZonedTime` ensures the underlying UTC value
		// correctly corresponds to the start of day in the target timezone.
		const startOfTodayInUserTz = startOfDay(toZonedTime(now, clientTimezone));

		// Now, subtract 7 days from this point. The resulting `Date` object will hold the
		// exact UTC timestamp for the beginning of the query window.
		const queryStartDate = new Date(startOfTodayInUserTz);
		queryStartDate.setDate(startOfTodayInUserTz.getDate() - 7);

		// --- 2. FILTERING IN THE DATABASE ---
		const flatLogs = await db.query.user.findFirst({
			where: eq(user.id, userId),
			columns: { id: true, name: true },
			with: {
				foodLogs: {
					where: gte(foodLog.loggedAt, queryStartDate),
					orderBy: [desc(foodLog.loggedAt)],
				},
				weightLogs: {
					where: gte(weightLog.loggedAt, queryStartDate),
					orderBy: [desc(weightLog.loggedAt)],
				},
				waterLogs: {
					where: gte(waterLog.loggedAt, queryStartDate),
					orderBy: [desc(waterLog.loggedAt)],
				},
				exerciseLogs: {
					where: gte(exerciseLog.loggedAt, queryStartDate),
					orderBy: [desc(exerciseLog.loggedAt)],
				},
				sleepLogs: {
					where: gte(sleepLog.loggedAt, queryStartDate),
					orderBy: [desc(sleepLog.loggedAt)],
				},
			},
		});

		if (!flatLogs) {
			return null;
		}

		// --- 3. GROUPING IN THE SERVICE ---
		const allLogs: [string, LogType[]][] = [
			["foodLogs", flatLogs.foodLogs],
			["waterLogs", flatLogs.waterLogs],
			["weightLogs", flatLogs.weightLogs],
			["exerciseLogs", flatLogs.exerciseLogs],
			["sleepLogs", flatLogs.sleepLogs],
		];

		const groupedLogs = allLogs.reduce((acc, [logTypeName, logs]) => {
			logs.forEach((log) => {
				// For each UTC timestamp from the database...
				// 1. Convert it to a `Date` object representing the user's local time.
				const zonedDate = toZonedTime(log.loggedAt, clientTimezone);

				// 2. Format that local time into the "YYYY-MM-DD" key.
				const dateKey = format(zonedDate, "yyyy-MM-dd");

				// The rest of the logic is the same.
				if (!acc[dateKey]) {
					acc[dateKey] = {
						foodLogs: [],
						waterLogs: [],
						exerciseLogs: [],
						weightLogs: [],
						sleepLogs: [],
					};
				}
				acc[dateKey][logTypeName as keyof (typeof acc)[string]].push(
					log as never,
				);
			});
			return acc;
		}, {} as GroupedLogs);

		return {
			user: { id: flatLogs.id, name: flatLogs.name },
			logsByDay: groupedLogs,
		};
	},
};
