const apiKey = "sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"; // ← Solo para pruebas privadas

async function handleSend() {
  const promptInput = document.getElementById("prompt");
  const chatContainer = document.getElementById("chat");
  const imageFile = document.getElementById("imageInput").files[0];
  const prompt = promptInput.value.trim();

  if (!prompt && !imageFile) return;

  chatContainer.innerHTML += `<div class="user-message">${prompt || "[Imagen enviada]"}</div>`;
  promptInput.value = "";

  const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  let body;

  if (imageFile) {
    const base64Image = await toBase64(imageFile);
    body = JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt || "¿Qué ves en esta imagen?" },
            {
              type: "image_url",
              image_url: {
                url: base64Image,
              },
            },
          ],
        },
      ],
    });
  } else {
    body = JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers,
      body,
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "[Sin respuesta]";
    chatContainer.innerHTML += `<div class="gaia-message">${reply}</div>`;
  } catch (error) {
    console.error(error);
    chatContainer.innerHTML += `<div class="gaia-message error">Error al procesar la solicitud.</div>`;
  }
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
