const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/chat", async (req, res) => {
  try {
    const conversation = req.body.messages;

    if (!conversation) {
      return res.status(400).json({ reply: "No se recibió conversación." });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Mi GPT Verde"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: conversation,
        temperature: 0.7,
        max_tokens: 1000  // Aumentado para permitir respuestas largas cuando se pidan
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("ERROR OPENROUTER:", data);
      return res.status(500).json({ reply: "Error del modelo." });
    }

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    console.error("ERROR SERVIDOR:", error);
    res.status(500).json({ reply: "Error interno del servidor." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});