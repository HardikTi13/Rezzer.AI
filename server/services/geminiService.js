const { GoogleGenAI } = require("@google/genai");
const dotenv = require('dotenv');

dotenv.config();

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const PRIMARY_MODEL = "gemini-2.5-flash";
const FALLBACK_MODEL = "gemini-2.5-pro";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function callGeminiWithRetry(modelName, imageBuffer, mimeType, prompt, maxRetries = 3) {
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`🤖 [Attempt ${attempt}] Calling ${modelName}...`);
            const response = await genAI.models.generateContent({
                model: modelName,
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: prompt },
                            {
                                inlineData: {
                                    data: imageBuffer.toString("base64"),
                                    mimeType: mimeType,
                                },
                            }
                        ]
                    }
                ]
            });
            return response;
        } catch (error) {
            lastError = error;
            const is503 = error.message.includes("503") || error.message.includes("Service Unavailable") || (error.status === 503);
            const is429 = error.message.includes("429") || error.message.includes("Too Many Requests") || (error.status === 429);

            if ((is503 || is429) && attempt < maxRetries) {
                const delay = Math.pow(2, attempt) * 1000;
                console.warn(`⚠️ Gemini ${modelName} returned temporary error (${is503 ? '503' : '429'}). Retrying in ${delay}ms...`);
                await sleep(delay);
                continue;
            }
            throw error;
        }
    }
    throw lastError;
}

exports.analyzeFood = async (imageBuffer, mimeType) => {
    const prompt = `
    Analyze this image and identify the food.
    Return ONLY a JSON object with this exact structure:
    {
        "foodName": "Name of the food",
        "calories": 0,
        "macronutrients": {
            "protein": 0,
            "carbs": 0,
            "fats": 0
        },
        "healthyVerdict": true,
        "analysisText": "Brief analysis of nutritional value."
    }
    Do not include markdown backticks like \`\`\`json.
    `;

    try {
        let response;
        try {
            // Try Primary Model first
            response = await callGeminiWithRetry(PRIMARY_MODEL, imageBuffer, mimeType, prompt);
        } catch (primaryError) {
            const is503 = primaryError.message.includes("503") || primaryError.message.includes("Service Unavailable") || (primaryError.status === 503);
            if (is503) {
                console.warn(`🚨 Primary model ${PRIMARY_MODEL} failed with 503 after retries. Falling back to ${FALLBACK_MODEL}...`);
                response = await callGeminiWithRetry(FALLBACK_MODEL, imageBuffer, mimeType, prompt);
            } else {
                throw primaryError;
            }
        }

        const responseText = response.text || '';
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("AI response did not contain valid JSON: " + responseText);
        }
        
        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        throw new Error("Failed to analyze image with Gemini: " + error.message);
    }
};
