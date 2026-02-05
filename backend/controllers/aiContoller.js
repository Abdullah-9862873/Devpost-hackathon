const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

const processCommand = async (req, res) => {
    const { transcript } = req.body;

    const prompt = `
    You are the VoiceBite AI Intent Engine. Convert this transcript: "${transcript}" 
    into a JSON object with "action" and "payload".
    Actions: GET_CATEGORY, ADD_TO_CART, SEARCH, NAVIGATE.
    Example: {"action": "NAVIGATE", "payload": {"page": "cart"}}
    `;

    try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();
        // Clean markdown backticks if Gemini adds them
        const cleanedJson = responseText.replace(/```json|```/g, "");
        res.json(JSON.parse(cleanedJson));
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "AI processing failed" });
    }
};

module.exports = { processCommand };