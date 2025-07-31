import { Router } from "express";
import { logController } from "@/controllers/log.controller";
import { requireAuth } from "@/middleware/auth.middleware";

const router = Router();

// Use the requireAuth middleware for ALL routes defined in this file.
// Any request to /api/log/* will now first go through this check.
router.use(requireAuth);

// --- Routes for creating new logs ---
router.post("/food", logController.logFood);
router.post("/water", logController.logWater);
router.post("/exercise", logController.logExercise);
router.post("/sleep", logController.logSleep);
router.post("/weight", logController.logWeight);

// --- NEW ROUTE for fetching logs grouped by day ---
// GET /api/log/by-day
// This will be the primary endpoint for your app's main dashboard/log view.
router.get("/by-day", logController.getLogsByDay);

// --- Deprecated or simple list route ---
// GET /api/log/all
// A flat list of all logs, without grouping.
router.get("/all", logController.getAllLogs);

export default router;
