import type { NextFunction, Request, Response } from "express";
import { foodAnalysisService } from "@/services/food.services";

export const foodController = {
	async analyze(req: Request, res: Response, next: NextFunction) {
		try {
			console.log(req.file);
			if (!req.file) {
				return res.status(400).json({ error: "No image file uploaded." });
			}
			// req.file.buffer is provided by multer's memoryStorage
			const analysisResult = await foodAnalysisService.analyzeImage(
				req.file.buffer,
			);
			res.status(200).json(analysisResult);
		} catch (error) {
			next(error);
		}
	},
};
