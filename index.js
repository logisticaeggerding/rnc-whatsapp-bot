import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// 🔧 Configurações principais
const PORT = process.env.PORT || 10000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "meu_token_de_verificacao";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// ✅ Verificação do webhook (GET)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado com sucesso!");
    res.status(200).send(challenge);
  } else {
    console.error("❌ Falha na verificação do webhook");
    res.sendStatus(403);
  }
});

// 📩 Recebendo mensagens (POST)
app.post("/webhook", async (req, res) => {
  try {
    console.log("📩 Dados recebidos:", JSON.stringify(req.body, null, 2));

    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    // Se houver mensagem recebida (não apenas status)
    if (messages && messages.length > 0) {
      const message = messages[0];
      const from = message.from; // número do remetente
      const msgBody = message.text?.body || "";

      console.log(`📨 Mensagem de ${from}: ${msgBody}`);

      // 🔁 Enviar resposta automática
      await axios.post(
        `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: "whatsapp",
          to: from,
          text: {
            body: "👋 Olá! Recebi sua mensagem e logo entrarei em contato. 📋"
          }
        },
        {
          headers: {
            Authorization: `Bearer ${WHATSAPP_TOKEN}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("✅ Resposta enviada com sucesso!");
    }

    // Confirma recebimento
    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Erro ao processar mensagem:", error.response?.data || error.message);
    res.sendStatus(500);
  }
});

// 🚀 Inicializando servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});





















































