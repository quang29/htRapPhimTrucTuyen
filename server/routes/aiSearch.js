const express = require('express');
const router = express.Router();
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;// Lấy API key từ biến môi trường env
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

router.post('/', async (req, res) => { // tao mot api route de nhan request POST
  const { query } = req.body; // nhan query tu client gui len

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(
      `Given this movie description: "${query}", respond ONLY with a valid and strict JSON object containing exactly the following fields: "genre", "actor", "year", and "keywords" (as an array of strings). Do NOT include any explanation, comments, or additional text.`
    ); // gui query den AI de nhan ket qua

    const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text || ''; // lay noi dung tu phan hoi AI va gan vao bien text

    // lay ket qua trong ngoac {}
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    const jsonString = text.substring(jsonStart, jsonEnd);

 let parsed;
    try {
      parsed = JSON.parse(jsonString);// Chuyen doi chuoi JSON thanh object
    } catch (jsonErr) {
      console.error('❌ JSON parse error:', jsonErr.message);
      return res.status(500).json({ error: 'Failed to parse AI response as JSON' });
    }

    res.json(parsed);// tra ket qua ve frontend
  } catch (err) {
    console.error('❌ AI search error:', err.message);

    if (err?.response?.status === 429) {// Neu loi 429 (Too Many Requests) thi hien thi thong bao loi
      return res.status(429).json({ error: "You're making too many requests. Please wait and try again later." });
    }

    res.status(500).json({ error: 'AI search failed' });
  }
});

module.exports = router;
