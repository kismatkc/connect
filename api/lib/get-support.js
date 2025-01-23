import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();
const API_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";
const API_KEY = process.env.HUGGINGFACE_TOKEN; // Sign up at Hugging Face for a free API key
export default async function support(message) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: message }),
        });
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("Error:", error);
    }
}
