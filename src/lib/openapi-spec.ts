import { z } from "zod";
import { createDocument } from "zod-openapi";
// Import all of your pure Zod schemas from the validation file
import {
	zCreateExerciseLog,
	zCreateFoodLog,
	zCreateSleepLog,
	zCreateWaterLog,
	zCreateWeightLog,
	zExerciseLogResponse,
	zFoodLogResponse,
	zSleepLogResponse,
	zUserResponse,
	zUserSettings,
	zUserUpdate,
	zWaterLogResponse,
	zWeightLogResponse,
} from "@/schemas/validation";

export const openApiDocument = createDocument({
	openapi: "3.1.0",
	info: {
		title: "ShapeApp API",
		version: "1.0.0",
		description:
			"The official API for the ShapeApp fitness tracker, providing endpoints for user management and health logging.",
	},
	servers: [{ url: "/api" }],
	components: {
		schemas: {
			UserSettings: zUserSettings,
			UserUpdate: zUserUpdate,
			UserResponse: zUserResponse,
			CreateFoodLog: zCreateFoodLog,
			FoodLogResponse: zFoodLogResponse,
			CreateWeightLog: zCreateWeightLog,
			WeightLogResponse: zWeightLogResponse,
			CreateWaterLog: zCreateWaterLog,
			WaterLogResponse: zWaterLogResponse,
			CreateExerciseLog: zCreateExerciseLog,
			ExerciseLogResponse: zExerciseLogResponse,
			CreateSleepLog: zCreateSleepLog,
			SleepLogResponse: zSleepLogResponse,
			LogsByDayResponse: z.object({
				user: zUserResponse,
				logsByDay: z.record(
					z.string(),
					z.object({
						foodLogs: z.array(zFoodLogResponse),
						waterLogs: z.array(zWaterLogResponse),
						exerciseLogs: z.array(zExerciseLogResponse),
						sleepLogs: z.array(zSleepLogResponse),
						weightLogs: z.array(zWeightLogResponse),
					}),
				),
			}),
		},
		securitySchemes: {
			cookieAuth: {
				type: "apiKey",
				in: "cookie",
				name: "better-auth.session-token",
			},
		},
	},
	security: [{ cookieAuth: [] }],
	paths: {
		"/user/me": {
			get: {
				summary: "Get current user profile",
				description:
					"Fetches the complete profile and settings for the currently authenticated user.",
				tags: ["User"],
				responses: {
					"200": {
						description: "Successful response with user data.",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/UserResponse" },
							},
						},
					},
					"401": { description: "Unauthorized" },
				},
			},
			put: {
				summary: "Update current user profile",
				description:
					"Updates the profile and/or settings for the currently authenticated user.",
				tags: ["User"],
				requestBody: {
					content: {
						"application/json": {
							schema: { $ref: "#/components/schemas/UserUpdate" },
						},
					},
				},
				responses: {
					"200": {
						description: "User profile updated successfully.",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/UserResponse" },
							},
						},
					},
					"400": { description: "Invalid input data" },
					"401": { description: "Unauthorized" },
				},
			},
		},
		"/logs/food": {
			post: {
				summary: "Log a new food item",
				tags: ["Logs"],
				requestBody: {
					content: {
						"application/json": {
							schema: { $ref: "#/components/schemas/CreateFoodLog" },
						},
					},
				},
				responses: {
					"201": {
						description: "Food log created successfully.",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/FoodLogResponse" },
							},
						},
					},
				},
			},
		},
		"/logs/water": {
			post: {
				summary: "Log a new water intake entry",
				tags: ["Logs"],
				requestBody: {
					content: {
						"application/json": {
							schema: { $ref: "#/components/schemas/CreateWaterLog" },
						},
					},
				},
				responses: {
					"201": {
						description: "Water log created successfully.",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/WaterLogResponse" },
							},
						},
					},
				},
			},
		},
		"/logs/weight": {
			post: {
				summary: "Log a new weight entry",
				tags: ["Logs"],
				requestBody: {
					content: {
						"application/json": {
							schema: { $ref: "#/components/schemas/CreateWeightLog" },
						},
					},
				},
				responses: {
					"201": {
						description: "Weight log created successfully.",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/WeightLogResponse" },
							},
						},
					},
				},
			},
		},
		"/logs/exercise": {
			post: {
				summary: "Log a new exercise entry",
				tags: ["Logs"],
				requestBody: {
					content: {
						"application/json": {
							schema: { $ref: "#/components/schemas/CreateExerciseLog" },
						},
					},
				},
				responses: {
					"201": {
						description: "Exercise log created successfully.",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/ExerciseLogResponse" },
							},
						},
					},
				},
			},
		},
		"/logs/sleep": {
			post: {
				summary: "Log a new sleep entry",
				tags: ["Logs"],
				requestBody: {
					content: {
						"application/json": {
							schema: { $ref: "#/components/schemas/CreateSleepLog" },
						},
					},
				},
				responses: {
					"201": {
						description: "Sleep log created successfully.",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/SleepLogResponse" },
							},
						},
					},
				},
			},
		},
		"/logs/by-day": {
			get: {
				summary: "Get logs grouped by day",
				description:
					"Fetches all log types for the last 7 days, grouped by the user's local calendar date.",
				tags: ["Logs"],
				parameters: [
					{
						name: "X-Timezone",
						in: "header",
						description:
							"The user's IANA timezone name (e.g., 'America/New_York').",
						required: true,
						schema: {
							type: "string",
							example: "Europe/London",
						},
					},
				],
				responses: {
					"200": {
						description: "A map of dates to a collection of logs for that day.",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										user: { $ref: "#/components/schemas/UserResponse" },
										logsByDay: {
											type: "object",
											additionalProperties: {
												type: "object",
												properties: {
													foodLogs: {
														type: "array",
														items: {
															$ref: "#/components/schemas/FoodLogResponse",
														},
													},
													waterLogs: {
														type: "array",
														items: {
															$ref: "#/components/schemas/WaterLogResponse",
														},
													},
													exerciseLogs: {
														type: "array",
														items: {
															$ref: "#/components/schemas/ExerciseLogResponse",
														},
													},
													sleepLogs: {
														type: "array",
														items: {
															$ref: "#/components/schemas/SleepLogResponse",
														},
													},
													weightLogs: {
														type: "array",
														items: {
															$ref: "#/components/schemas/WeightLogResponse",
														},
													},
												},
											},
										},
									},
								},
							},
						},
					},
				},
			},
		},
	},
});
