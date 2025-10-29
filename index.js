import express from "express";

const app = express();
app.use(express.json());

// 🔹 Rota para verificar o webhook (usada pela Meta para validar)
app.get("/webhook", (req, res) => {
  const verifyToken = process.env.VERIFY_TOKEN;
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === verifyToken) {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// 🔹 Rota para receber mensagens do WhatsApp
app.post("/webhook", (req, res) => {
  console.log("📩 Mensagem recebida:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// 🔹 Porta padrão do Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
