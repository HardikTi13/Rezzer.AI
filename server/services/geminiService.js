const { GoogleGenAI } = require("@google/genai");
const dotenv = require('dotenv');

dotenv.config();

// Initialize with new SDK syntax
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL_NAME = "gemini-2.5-flash"; // User requested model

exports.analyzeFood = async (imageBuffer, mimeType) => {
    try {
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

        const response = await genAI.models.generateContent({
            model: MODEL_NAME,
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

        // Handle response safely
        const responseText = response.text || '';
        
        // Robust JSON extraction
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
