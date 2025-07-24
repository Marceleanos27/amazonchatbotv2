const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = 3000;
const API_KEY = process.env.API_KEY;

app.use(cors());
app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
  const chatHistory = req.body.chatHistory;

  console.log("📥 Received from frontend:", chatHistory);
  console.log("🔑 API Key is:", API_KEY ? "Loaded ✅" : "❌ MISSING");

  if (!API_KEY) {
    return res.status(500).json({ error: "API key is missing." });
  }

  try {
    const response = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "Qwen/Qwen3-235B-A22B-Instruct-2507-tput",
        messages: chatHistory
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API Response Error:", errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("❌ Backend crash:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
