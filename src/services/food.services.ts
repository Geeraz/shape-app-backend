/** biome-ignore-all lint/complexity/noUselessLoneBlockStatements: <explanation> */
import axios from "axios";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"; // :contentReference[oaicite:8]{index=8}
const AI_MODEL = "mistralai/mistral-small-3.2-24b-instruct:free";

export const foodAnalysisService = {
	/**
	 * Analyze a food image buffer via OpenRouter.
	 * @param imageBuffer - Raw image bytes.
	 * @returns Parsed JSON: { items: Array<{ name: string; amount_g: number }> }
	 */
	async analyzeImage(imageBuffer: Buffer) {
		// 1. Base64-encode and build Data URL
		const base64 = imageBuffer.toString("base64"); // Buffer → Base64 :contentReference[oaicite:9]{index=9}
		const imageUrl = `data:image/jpeg;base64,${base64}`; // Data URL :contentReference[oaicite:10]{index=10}

		// 2. Craft prompt enforcing JSON-only
		const prompt = `
      You are a nutritional assistant. Analyze the food below and return ONLY ingredients as
    	single valid JSON object with key "items" (array of { name, amount_g }) of lasagna recipe.
    `;

		// 3. Build request body
		const payload = {
			model: AI_MODEL,
			messages: [
				{
					role: "user",
					content: [
						{ type: "text", text: prompt },
						{ type: "image_url", image_url: { url: imageUrl } },
					],
				},
			],
		};

		// 4. Send request with optional attribution headers
		try {
			const response = await axios.post(OPENROUTER_URL, payload, {
				headers: {
					Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, // Auth :contentReference[oaicite:11]{index=11}
					"Content-Type": "application/json",
					"HTTP-Referer": process.env.APP_URL || "", // Optional attribution :contentReference[oaicite:12]{index=12}
					"X-Title": process.env.APP_NAME || "", // Optional attribution :contentReference[oaicite:13]{index=13}
				},
			});

			// 5. Extract and parse JSON-only response
			const content = response.data.choices[0].message.content; // API schema :contentReference[oaicite:14]{index=14}
			try {
				return JSON.parse(content) as {
					items: { name: string; amount_g: number }[];
				};
			} catch {
				throw new Error("AI returned invalid JSON.");
			}
		} catch (err: any) {
			console.error("OpenRouter API error:", err.response?.data || err.message);
			throw new Error("Image analysis failed.");
		}
	},
};
