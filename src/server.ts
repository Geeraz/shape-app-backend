import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import { auth } from "./lib/auth";

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

// ─── CORS ────────────────────────────────────────────────────────────────
app.use(
	cors({
		origin: [process.env.EXPO_BASE_URL || "http://192.168.2.2:19000"],
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE"],
	}),
);

// Middlware for loging all requests in console
app.use((req, _, next) => {
	// console.log(req.headers);
	console.log(req.method, req.url);
	next();
});

// ─── Better Auth handler ───────────────────────────────────────────────────
// catch-all for /api/auth/*
app.all("/api/auth/*splat", toNodeHandler(auth));

// ─── JSON parsing for your other routes ───────────────────────────────────
app.use(express.json());

// ─── Example protected endpoint ───────────────────────────────────────────
app.get("/api/me", async (req, res) => {
	const session = await auth.api.getSession({
		headers: fromNodeHeaders(req.headers),
	});
	if (!session) return res.status(401).json({ error: "Not authenticated" });
	return res.json({ user: session.user });
});
app.get("/api/health", async (_, res) => {
	return res.json({ status: "ok" });
});

// ─── Start server ─────────────────────────────────────────────────────────
app.listen(3000, "0.0.0.0", () => {
	console.log(`🚀 Auth server running on http://localhost:${port}`);
});
