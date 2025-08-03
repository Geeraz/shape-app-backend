import { z } from "zod";

// --- For validating incoming data to UPDATE user settings ---
export const zUserSettings = z.object({
	notificationsEnabled: z.boolean().optional(),
	measurementUnit: z.enum(["metric", "imperial"]).optional(),
	themePreference: z.enum(["light", "dark"]).optional(),
});
export type UserSettings = z.infer<typeof zUserSettings>;

// --- For validating incoming data to UPDATE a user ---
export const zUserUpdate = z.object({
	name: z.string().min(1, "Name cannot be empty.").optional(),
	dateOfBirth: z
		.preprocess(
			(val) => (typeof val === "string" ? new Date(val) : val),
			z.date().optional(),
		)
		.nullable(),
	heightCm: z
		.number()
		.int()
		.positive("Height must be positive.")
		.optional()
		.nullable(),
	gender: z
		.enum(["male", "female", "other", "prefer_not_to_say"])
		.optional()
		.nullable(),
	activityLevel: z
		.enum(["sedentary", "lightly_active", "moderately_active", "very_active"])
		.optional(),
	weeklyWeightGoalKg: z.number().optional(),
	startWeightKg: z.number().positive().optional().nullable(),
	targetWeightKg: z.number().positive().optional().nullable(),
	targetCalories: z.number().int().positive().optional().nullable(),
	targetProteinG: z.number().int().positive().optional().nullable(),
	targetCarbsG: z.number().int().positive().optional().nullable(),
	targetFatG: z.number().int().positive().optional().nullable(),
	onboarded: z.boolean().optional(),
	settings: zUserSettings.optional(), // Nest the settings schema
});
export type UserUpdate = z.infer<typeof zUserUpdate>;

// --- For formatting the user object SENT TO THE CLIENT ---
export const zUserResponse = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().email(),
	emailVerified: z.boolean(),
	image: z.string().nullable(),
	dateOfBirth: z.date().nullable(),
	heightCm: z.number().nullable(),
	gender: z.string().nullable(),
	activityLevel: z.string(),
	weeklyWeightGoalKg: z.number(),
	targetWeightKg: z.number().nullable(),
	targetCalories: z.number().nullable(),
	targetProteinG: z.number().nullable(),
	targetCarbsG: z.number().nullable(),
	targetFatG: z.number().nullable(),
	onboarded: z.boolean(),
	settings: zUserSettings, // Nesting the settings object
	createdAt: z.date(),
	updatedAt: z.date(),
});
export type UserResponse = z.infer<typeof zUserResponse>;

const mealTypes = z.enum(["breakfast", "lunch", "dinner", "snack"]);
const units = z.enum(["serving", "g", "ml", "oz", "cup", "item"]);

// --- For validating incoming data to CREATE a food log ---
export const zCreateFoodLog = z.object({
	description: z.string().min(1, "Description is required."),
	calories: z.number().int().min(0, "Calories must be 0 or more."),
	proteinG: z.number().min(0).default(0),
	carbsG: z.number().min(0).default(0),
	fatG: z.number().min(0).default(0),
	mealType: mealTypes.optional().nullable(),
	foodApiId: z.string().optional().nullable(),
	quantity: z.number().positive("Quantity must be positive.").default(1),
	unit: units.default("serving"),
	loggedAt: z
		.preprocess(
			(val) => (typeof val === "string" ? new Date(val) : val),
			z.date().optional(),
		)
		.default(() => new Date()),
});
export type CreateFoodLog = z.infer<typeof zCreateFoodLog>;

// --- For formatting the food log object SENT TO THE CLIENT ---
export const zFoodLogResponse = z.object({
	id: z.number().int(),
	userId: z.string(),
	description: z.string(),
	calories: z.number().int(),
	proteinG: z.number(),
	carbsG: z.number(),
	fatG: z.number(),
	mealType: mealTypes.nullable(),
	foodApiId: z.string().nullable(),
	quantity: z.number(),
	unit: units,
	loggedAt: z.date(),
});
export type FoodLogResponse = z.infer<typeof zFoodLogResponse>;

// --- For validating incoming data to CREATE a weight log ---
export const zCreateWeightLog = z.object({
	weightKg: z.number().positive("Weight must be a positive number."),
	loggedAt: z
		.preprocess(
			(val) => (typeof val === "string" ? new Date(val) : val),
			z.date().optional(),
		)
		.default(() => new Date()),
});
export type CreateWeightLog = z.infer<typeof zCreateWeightLog>;

// --- For formatting the weight log object SENT TO THE CLIENT ---
export const zWeightLogResponse = z.object({
	id: z.number().int(),
	userId: z.string(),
	weightKg: z.number(),
	loggedAt: z.date(),
});
export type WeightLogResponse = z.infer<typeof zWeightLogResponse>;

// --- For validating incoming data to CREATE a water log ---
export const zCreateWaterLog = z.object({
	volumeMl: z.number().int().positive("Volume must be a positive number."),
	loggedAt: z
		.preprocess(
			(val) => (typeof val === "string" ? new Date(val) : val),
			z.date().optional(),
		)
		.default(() => new Date()),
});
export type CreateWaterLog = z.infer<typeof zCreateWaterLog>;

// --- For formatting the water log object SENT TO THE CLIENT ---
export const zWaterLogResponse = z.object({
	id: z.number().int(),
	userId: z.string(),
	volumeMl: z.number().int(),
	loggedAt: z.date(),
});
export type WaterLogResponse = z.infer<typeof zWaterLogResponse>;

const intensityLevels = z.enum(["low", "medium", "high"]);

// --- For validating incoming data to CREATE an exercise log ---
export const zCreateExerciseLog = z.object({
	type: z.string().min(1, "Exercise type is required."),
	durationMin: z.number().int().positive("Duration must be positive."),
	caloriesBurned: z
		.number()
		.int()
		.min(0, "Calories burned must be 0 or more.")
		.optional()
		.nullable(),
	intensity: intensityLevels.optional().nullable(),
	notes: z.string().optional().nullable(),
	loggedAt: z
		.preprocess(
			(val) => (typeof val === "string" ? new Date(val) : val),
			z.date().optional(),
		)
		.default(() => new Date()),
});
export type CreateExerciseLog = z.infer<typeof zCreateExerciseLog>;

// --- For formatting the exercise log object SENT TO THE CLIENT ---
export const zExerciseLogResponse = z.object({
	id: z.number().int(),
	userId: z.string(),
	type: z.string(),
	durationMin: z.number().int(),
	caloriesBurned: z.number().int().nullable(),
	intensity: intensityLevels.nullable(),
	notes: z.string().nullable(),
	loggedAt: z.date(),
});
export type ExerciseLogResponse = z.infer<typeof zExerciseLogResponse>;

const qualityLevels = z.enum(["poor", "average", "good", "excellent"]);

// --- For validating incoming data to CREATE a sleep log ---
export const zCreateSleepLog = z
	.object({
		startTime: z.preprocess(
			(val) => (typeof val === "string" ? new Date(val) : val),
			z.date(),
		),
		endTime: z.preprocess(
			(val) => (typeof val === "string" ? new Date(val) : val),
			z.date(),
		),
		quality: qualityLevels.optional().nullable(),
		interruptions: z.number().int().min(0).default(0),
		notes: z.string().optional().nullable(),
	})
	.refine((data) => data.endTime > data.startTime, {
		message: "End time must be after start time.",
		path: ["endTime"], // Path of the error
	});
export type CreateSleepLog = z.infer<typeof zCreateSleepLog>;

// --- For formatting the sleep log object SENT TO THE CLIENT ---
export const zSleepLogResponse = z.object({
	id: z.number().int(),
	userId: z.string(),
	startTime: z.date(),
	endTime: z.date(),
	quality: qualityLevels.nullable(),
	interruptions: z.number().int(),
	notes: z.string().nullable(),
	loggedAt: z.date(),
});
export type SleepLogResponse = z.infer<typeof zSleepLogResponse>;
