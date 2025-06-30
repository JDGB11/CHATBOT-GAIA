const apiKey = "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";
const chatDiv = document.getElementById("chat");
const imageInput = document.getElementById("imageInput");

let messages = [
  { role: "system", content: "Eres G.A.I.A., una inteligencia artificial amigable que responde preguntas en español." }
];

function appendMessage(content, role) {
  const msg = document.createElement("div");
  msg.className = "msg " + role;
  msg.innerText = content;
  chatDiv.appendChild(msg);
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("prompt");
  const text = input.value.trim();
  if (!text) return;

  appendMessage(text, "user");
  messages.push({ role: "user", content: text });
  input.value = "";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: messages,
        temperature: 0.7
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;
    appendMessage(reply, "bot");
    messages.push({ role: "assistant", content: reply });

  } catch (error) {
    appendMessage("[Error de conexión con la API]", "bot");
    console.error(error);
  }
}

function sendImage() {
  const file = imageInput.files[0];
  if (!file) {
    alert("Por favor, selecciona una imagen primero.");
    return;
  }

  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64Image = reader.result.split(",")[1];

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: "Describe esta imagen." },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`
                  }
                }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      const reply = data.choices[0].message.content;
      appendMessage("Imagen procesada: " + reply, "bot");
    } catch (error) {
      appendMessage("[Error al enviar imagen a la API]", "bot");
      console.error(error);
    }
  };

  reader.readAsDataURL(file);
}
