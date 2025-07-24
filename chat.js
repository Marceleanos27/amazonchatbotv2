let chatHistory = [
  {
    role: "system",
    content: "You are a smart and friendly virtual assistant for an online store similar to Amazon. You help customers with questions about products, restocks, sizes, shipping, returns, and general shopping info. Do not say you're an AI. Respond as a helpful support assistant. Keep responses very short, offer product suggestions, and ask if they'd like a link from Amazon."
  }
];

const chatbox = document.getElementById("chat-messages");
const inputField = document.getElementById("user-input");

// Set your backend URL here:
const BACKEND_URL = "https://your-deployed-backend-url.com/chat";
// For local testing, you can switch to:
// const BACKEND_URL = "http://localhost:3000/chat";

function toggleChatbot() {
  const container = document.getElementById("chatbot-container");
  container.classList.toggle("closed");
  const icon = document.getElementById("toggle-icon");
  icon.innerText = container.classList.contains("closed") ? "+" : "−";
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendMessage() {
  const message = inputField.value.trim();
  if (!message) return;

  appendMessage("You", message, "user");
  chatHistory.push({ role: "user", content: message });
  inputField.value = "";
  appendMessage("Marcel", "Thinking...", "bot", true);

  try {
    await delay(1000);

    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ chatHistory })
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "No response.";

    chatHistory.push({ role: "assistant", content: reply });

    removeLastBotMessage();
    appendMessage("Marcel", reply, "bot");
  } catch (error) {
    console.error("Error:", error);
    removeLastBotMessage();
    appendMessage("Marcel", `Error: ${error.message}`, "bot");
  }
}

function appendMessage(sender, message, role, isTemp = false) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", role);
  if (isTemp) msgDiv.classList.add("temp");
  msgDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatbox.appendChild(msgDiv);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function removeLastBotMessage() {
  const tempMsg = chatbox.querySelector(".bot.temp");
  if (tempMsg) chatbox.removeChild(tempMsg);
}
