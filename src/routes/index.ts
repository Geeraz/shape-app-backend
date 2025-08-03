import { Router } from "express";
import authRouter from "./auth.routes";
import foodRouter from "./food.routes";
import logRouter from "./log.routes";
import userRouter from "./user.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/logs", logRouter);
router.use("/user", userRouter);
router.use("/food", foodRouter);

export default router;
