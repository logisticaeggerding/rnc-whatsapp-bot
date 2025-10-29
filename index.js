import express from "express";

const app = express();
app.use(express.json());

// Verificação do webhook (GET)
app.get("/webhook", (req, res) => {
  const verifyToken = process.env.VERIFY_TOKEN;
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === verifyToken) {
    console.log("✅ Webhook verificado com sucesso");
    return res.status(200).send(challenge);
  } else {
    console.warn("❌ Falha na verificação do webhook");
    return res.sendStatus(403);
  }
});

// Recebimento de mensagens (POST)
app.post("/webhook", (req, res) => {
  console.log("📩 Corpo recebido do WhatsApp:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// Porta padrão da Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
