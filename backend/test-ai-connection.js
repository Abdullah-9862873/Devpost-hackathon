const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const modelName = "gemini-3-flash-preview";

async function testAI() {
    try {
        console.log(`Testing AI with model: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello, respond with 'OK'");
        console.log("Success! Response:", result.response.text());
    } catch (error) {
        console.error("AI Connection Failed:");
        console.error(error);
    }
}

testAI();