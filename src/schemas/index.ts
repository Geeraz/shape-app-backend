import {
	boolean,
	integer,
	pgTable,
	real,
	serial,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

// src/schemas/index.ts

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").notNull().default(false),
	image: text("image"),
	dateOfBirth: timestamp("date_of_birth"),
	heightCm: integer("height_cm"),
	gender: varchar("gender", { length: 20 }), // Increased length for more options

	// New suggested fields
	activityLevel: varchar("activity_level", { length: 50 })
		.notNull()
		.default("sedentary"), // e.g., 'sedentary', 'lightly_active', 'moderately_active', 'very_active'

	startingWeightKg: real("weekly_weight_goal_kg"), // e.g., -0.5 for losing 0.5kg/week
	weeklyWeightGoalKg: real("weekly_weight_goal_kg").notNull().default(0), // e.g., -0.5 for losing 0.5kg/week
	targetWeightKg: real("target_weight_kg"),

	// Storing calculated or user-set macronutrient goals
	targetCalories: integer("target_calories"),
	targetProteinG: integer("target_protein_g"),
	targetCarbsG: integer("target_carbs_g"),
	targetFatG: integer("target_fat_g"),

	onboarded: boolean("onboarded").notNull().default(false),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userSettings = pgTable("user_settings", {
	userId: text("user_id")
		.notNull()
		.primaryKey()
		.references(() => user.id, { onDelete: "cascade" }),
	notificationsEnabled: boolean("notifications_enabled")
		.notNull()
		.default(true),
	measurementUnit: varchar("measurement_unit", { length: 10 })
		.notNull()
		.default("metric"), // or "imperial"
	themePreference: varchar("theme_preference", { length: 10 })
		.notNull()
		.default("light"), // or "dark"
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").$defaultFn(
		() => /* @__PURE__ */ new Date(),
	),
	updatedAt: timestamp("updated_at").$defaultFn(
		() => /* @__PURE__ */ new Date(),
	),
});

/** Food logging: free‐form or linked to API‐fetched product */
export const foodLog = pgTable("food_log", {
	id: serial("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	description: text("description").notNull(), // e.g., "Banana, medium"

	// New suggested fields
	mealType: varchar("meal_type", { length: 50 }), // 'breakfast', 'lunch', 'dinner', 'snack'
	foodApiId: text("food_api_id"), // To link to an external food database
	quantity: real("quantity").notNull().default(1),
	unit: varchar("unit", { length: 50 }).notNull().default("serving"), // e.g., 'g', 'ml', 'oz', 'cup', 'serving'

	calories: integer("calories").notNull(),
	proteinG: real("protein_g").notNull().default(0),
	carbsG: real("carbs_g").notNull().default(0),
	fatG: real("fat_g").notNull().default(0),
	loggedAt: timestamp("logged_at").defaultNow().notNull(),
});

/** Weight logging */
export const weightLog = pgTable("weight_log", {
	id: serial("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	weightKg: real("weight_kg").notNull(),
	loggedAt: timestamp("logged_at").defaultNow().notNull(),
});

/** Water intake logging */
export const waterLog = pgTable("water_log", {
	id: serial("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	volumeMl: integer("volume_ml").notNull(), // e.g. 200, 500
	loggedAt: timestamp("logged_at").defaultNow().notNull(),
});

/** Exercise logging */
// src/schemas/index.ts

export const exerciseLog = pgTable("exercise_log", {
	id: serial("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	type: varchar("type", { length: 100 }).notNull(), // e.g. "running", "yoga"
	durationMin: integer("duration_min").notNull(), // in minutes
	caloriesBurned: integer("calories_burned"), // optional estimate

	// New suggested fields
	intensity: varchar("intensity", { length: 50 }), // 'low', 'medium', 'high'
	notes: text("notes"), // For user comments about the workout

	loggedAt: timestamp("logged_at").defaultNow().notNull(),
});

/** Sleep logging */
export const sleepLog = pgTable("sleep_log", {
	id: serial("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	startTime: timestamp("start_time").notNull(),
	endTime: timestamp("end_time").notNull(),
	quality: varchar("quality", { length: 50 }), // e.g. "good", "poor"

	// New suggested fields
	interruptions: integer("interruptions").notNull().default(0),
	notes: text("notes"), // User comments on sleep quality

	loggedAt: timestamp("logged_at").defaultNow().notNull(),
});
