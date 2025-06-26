const express = require('express');
const router = express.Router();
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

router.post('/', async (req, res) => {
  const { query } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(
      `Given this movie description: "${query}", respond ONLY with a valid and strict JSON object containing exactly the following fields: "genre", "actor", "year", and "keywords" (as an array of strings). Do NOT include any explanation, comments, or additional text.`
    );

    const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    const jsonString = text.substring(jsonStart, jsonEnd);

 let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch (jsonErr) {
      console.error('❌ JSON parse error:', jsonErr.message);
      return res.status(500).json({ error: 'Failed to parse AI response as JSON' });
    }

    res.json(parsed);
  } catch (err) {
    console.error('❌ AI search error:', err.message);

    if (err?.response?.status === 429) {
      return res.status(429).json({ error: "You're making too many requests. Please wait and try again later." });
    }

    res.status(500).json({ error: 'AI search failed' });
  }
});

module.exports = router;
