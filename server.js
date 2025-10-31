require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateContent = async (prompt) => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });
        return response.text;
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw new Error('Failed to communicate with the AI model.');
    }
};

// 1. POST ROUTE: Free-Form Question (Used by the Modal)
app.post('/api/ask', async (req, res) => {
    const userQuestion = req.body.question;
    
    if (!userQuestion) {
        return res.status(400).json({ error: 'Question is required.' });
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: userQuestion }] }],
        });

        // Use 'answer' key for compatibility, frontend will handle this
        res.json({ 
            answer: response.text 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to communicate with the Gemini API.' });
    }
});

// 2. GET ROUTE: Daily Joke
app.get('/api/joke', async (req, res) => {
    try {
        const prompt = "Generate a short, funny, family-friendly joke.";
        const joke = await generateContent(prompt);
        res.json({ content: joke });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. GET ROUTE: Motivation Boost
app.get('/api/motivation', async (req, res) => {
    try {
        const prompt = "Generate a concise, powerful motivational quote suitable for a tip of the day.";
        const quote = await generateContent(prompt);
        res.json({ content: quote });
    } catch (error) {
        res.status(500).json({ error: message });
    }
});

// 4. GET ROUTE: Tip of the Day
app.get('/api/tip-of-the-day', async (req, res) => {
    try {
        const prompt = "Provide one useful, actionable productivity tip for the day.";
        const tip = await generateContent(prompt);
        res.json({ content: tip });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});