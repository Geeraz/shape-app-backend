import { relations } from "drizzle-orm";
import {
	account,
	exerciseLog,
	foodLog,
	session,
	sleepLog,
	user,
	userSettings,
	waterLog,
	weightLog,
} from "./index"; // Assuming your schemas are in an index.ts file

// --- User Relations ---
// A user has one settings profile and can have many of all other items.
export const userRelations = relations(user, ({ one, many }) => ({
	settings: one(userSettings, {
		fields: [user.id],
		references: [userSettings.userId],
	}),
	accounts: many(account),
	sessions: many(session),
	foodLogs: many(foodLog),
	weightLogs: many(weightLog),
	waterLogs: many(waterLog),
	exerciseLogs: many(exerciseLog),
	sleepLogs: many(sleepLog),
}));

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
	user: one(user, {
		fields: [userSettings.userId],
		references: [user.id],
	}),
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}));

export const foodLogRelations = relations(foodLog, ({ one }) => ({
	user: one(user, {
		fields: [foodLog.userId],
		references: [user.id],
	}),
}));

export const weightLogRelations = relations(weightLog, ({ one }) => ({
	user: one(user, {
		fields: [weightLog.userId],
		references: [user.id],
	}),
}));

export const waterLogRelations = relations(waterLog, ({ one }) => ({
	user: one(user, {
		fields: [waterLog.userId],
		references: [user.id],
	}),
}));

export const exerciseLogRelations = relations(exerciseLog, ({ one }) => ({
	user: one(user, {
		fields: [exerciseLog.userId],
		references: [user.id],
	}),
}));

export const sleepLogRelations = relations(sleepLog, ({ one }) => ({
	user: one(user, {
		fields: [sleepLog.userId],
		references: [user.id],
	}),
}));
