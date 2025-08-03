import { Router } from "express";
import multer from "multer";
import { foodController } from "@/controllers/food.controller";
import { requireAuth } from "@/middleware/auth.middleware";

const router = Router();
// Use multer's memoryStorage to handle the file in memory without saving to disk.
const upload = multer({ storage: multer.memoryStorage() });
router.use(requireAuth);

// POST /api/food/analyze
router.post("/analyze", upload.single("foodImage"), foodController.analyze);
export default router;
