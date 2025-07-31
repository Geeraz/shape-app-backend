import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import type { NextFunction, Request, Response } from "express";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { ZodError } from "zod";
import { auth } from "./lib/auth";
// --> Local Imports
import { env } from "./lib/env"; // Use the validated environment variables
// Import the OpenAPI document you created
import { openApiDocument } from "./lib/openapi-spec";
import apiRouter from "./routes"; // Your main application router

// --- 1. App Initialization ---
const app = express();
const port = env.PORT; // Use the safe, validated port from your env file

// Enable CORS with validated origins
app.use(
	cors({
		// Use the validated env var. Add a fallback for flexibility.
		origin: [env.EXPO_BASE_URL],
		credentials: true,
	}),
);
if (env.NODE_ENV === "development") {
	app.use((req: Request, _, next: NextFunction) => {
		console.log(
			`[REQUEST RECEIVED] Method: ${req.method}, URL: ${req.originalUrl}`,
		);
		next();
	});
}
// Better auth handler needs to be before any middlware
app.all("/api/auth/*splat", toNodeHandler(auth));
// Parse incoming JSON request bodies
app.use(express.json());

app.get("/openapi.json", (_, res) => {
	res.json(openApiDocument);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

// --- 3. Application Routes ---
// Mount all your API routes under the /api prefix.
app.use("/api", apiRouter);

// A simple, public health check endpoint.
app.get("/health", (_, res: Response) => {
	res.status(200).json({ status: "ok" });
});

// --- 4. Global Error Handling Middleware ---
// This is the CATCH-ALL for errors. It MUST be the last `app.use()` call.
// It will catch any errors passed to `next()` from your controllers.
app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
	console.error(`[GLOBAL ERROR] at ${req.method} ${req.url}:`, err);

	// Handle Zod validation errors specifically
	if (err instanceof ZodError) {
		return res.status(400).json({
			error: "Invalid input provided.",
			details: err.flatten().fieldErrors,
		});
	}

	// You could add more custom error types here
	// if (err instanceof AuthenticationError) {
	//   return res.status(401).json({ error: "Not authenticated" });
	// }

	// Fallback for any other unexpected errors
	return res.status(500).json({
		error: "An unexpected internal server error occurred.",
	});
});

// --- 5. Start Server ---
app.listen(port, "0.0.0.0", () => {
	console.log(
		`🚀 Server running on http://localhost:${port} in ${env.NODE_ENV} mode`,
	);
});
