import { Router } from "express";
import { userController } from "@/controllers/user.controller";
import { requireAuth } from "@/middleware/auth.middleware";

const router = Router();

// All routes in this file require authentication
router.use(requireAuth);

// GET /api/user/me
router.get("/me", userController.getMyProfile);

// PUT /api/user/me
router.put("/me", userController.updateMyProfile);

export default router;
