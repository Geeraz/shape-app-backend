import { Router } from "express";
import { getMeHandler } from "@/controllers/auth.controller";
import { requireAuth } from "@/middleware/auth.middleware";

const router = Router();

router.get("/me", requireAuth, getMeHandler);

export default router;
