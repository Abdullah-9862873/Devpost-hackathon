const { GoogleGenerativeAI } = require("@google/generative-ai");
const MenuItem = require("../models/MenuItem");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

// cache to reduce DB queries
let menuCache = null;
let cacheTime = 0;
const CACHE_TTL = 60 * 1000; 

function buildPrompt(transcript, menuItems) {
    const categories = [...new Set(menuItems.map(i => i.category))];
    const menuContext = menuItems.map(item =>
        `- ${item.name}: ${item.description} (Category: ${item.category})`
    ).join('\n');

    return `
You are the VoiceBite Elite AI Concierge. 
Your goal is to guide the user through their ordering journey with precision and salesmanship.

### MENU DATA:
${menuContext}
Available Categories: [${categories.join(', ')}]

### HANDBOOK RULES:
1. **DISCOUNTS**: If asked for "offers", "deals", or "discounts", use action "GET_OFFERS".
2. **DRINKS**: If asked for "drinks" or being "thirsty", map directly to the "beverages" category. Use action "GET_CATEGORY" with payload { category: "beverages" }.
3. **MENU QUERY**: If asked "what is there to eat" or "what do you have", use action "LIST_CATEGORIES". Payload: { categories: ["${categories.join('", "')}"], hasOffers: true }.
4. **CHECKOUT**: 
   - To open cart/checkout: Action "NAVIGATE", page "cart".
   - To finish/pay: If prompt implies completing order (e.g., "process payment", "finalize", "pay now"), use action "PROCESS_PAYMENT".
5. **NAVIGATION**: "Open [page]" -> Action "NAVIGATE".
6. **GUIDANCE**: If the command is unclear or not related to the app, use action "GUIDE_USER". Payload: { message: "I can help you browse categories, find deals, add items to your cart, or handle your checkout. Try saying 'What's for dinner?' or 'Show me beverages'." }
7. **THE YES POLICY**: Always suggest a category or item if an exact match isn't found.

### OUTPUT FORMAT:
Return ONLY a JSON object:
{
  "action": "GET_CATEGORY" | "SEARCH" | "NAVIGATE" | "ADD_TO_CART" | "GET_OFFERS" | "PROCESS_PAYMENT" | "LIST_CATEGORIES" | "GUIDE_USER",
  "payload": {
    "category": "string",
    "categories": ["string"],
    "query": "string",
    "page": "string",
    "name": "string",
    "message": "string"
  }
}

### TRANSCRIPT:
"${transcript}"
`;
}

const processCommand = async (req, res) => {
    const { transcript } = req.body;

    if (!transcript) {
        return res.status(400).json({ error: "No transcript provided" });
    }

    try {
        // use cached items if available
        if (!menuCache || Date.now() - cacheTime > CACHE_TTL) {
            menuCache = await MenuItem.find({}, 'name description category');
            cacheTime = Date.now();
        }

        const prompt = buildPrompt(transcript, menuCache);

        // ai log response time for monitoring
        const startTime = Date.now();
        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();
        console.log(`response time: ${Date.now() - startTime} ms`);

        let jsonContent;
        try {
            jsonContent = JSON.parse(responseText);
        } catch {
            console.error("AI returned malformed JSON:", responseText);
            return res.json({
                action: 'SEARCH',
                payload: { query: transcript }
            });
        }

        res.json(jsonContent);
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "AI processing failed", details: error.message });
    }
};

module.exports = { processCommand };
