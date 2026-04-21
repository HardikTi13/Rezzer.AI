const { GoogleGenAI } = require("@google/genai");
require('dotenv').config({ path: './.env' });

async function test() {
    console.log('Testing Gemini API with Key:', process.env.GEMINI_API_KEY ? 'Present' : 'Missing');
    try {
        const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const model = genAI.models.get({ model: 'gemini-1.5-flash' });
        console.log('Model info retrieved successfully');
        
        const response = await genAI.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: [{ role: 'user', parts: [{ text: 'Say hello' }] }]
        });
        console.log('Response:', response.text);
    } catch (error) {
        console.error('Test Failed:', error);
    }
}

test();
