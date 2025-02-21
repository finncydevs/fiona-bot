const fetch = require("node-fetch"); // Ensure fetch is available in Node.js

async function animeQuotes(sock, chatId) {
  try {
    const url = "https://animechan.io/api/v1/quotes/random";
    const response = await fetch(url);

    if (!response.ok) {
      await sock.sendMessage(chatId, { text: "Couldn't fetch quotes." });
      return;
    }

    const data = await response.json();

    const { content } = data.data;
    const { name, altName } = data.data.anime;
    const { name: character } = data.data.character;

    // Format message
    const message = `✨ Random Anime Quote ✨\n\n📜 Quote: "${content}"\n🎬 Anime: ${name} (or ${altName})\n👤 Character: ${character}`;

    await sock.sendMessage(chatId, { text: message });
  } catch (error) {
    console.error("Error fetching quotes:", error);
    await sock.sendMessage(chatId, { text: "Error fetching quotes data." });
  }
}

module.exports = { animeQuotes };
