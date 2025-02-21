const KBBI = require("kbbi.js"); // Ensure the correct path
const { error } = require("console");

async function getKBBI(sock, chatId, query) {
  try {
    const data = await KBBI.cari(query); // Wait for the API response

    if (!data) {
      await sock.sendMessage(chatId, { text: "KBBI result not found." });
      return;
    }

    const definitionList = data.arti
      .map((def, index) => `*${index + 1}.* ${def}`)
      .join("\n");

    const message =
      `📖 *KBBI Result for "${query}"*\n\n` +
      `🔹 *Lema:* ${data.lema.trim()}\n\n` +
      `🔹 *Arti:*\n${definitionList}`;

    await sock.sendMessage(chatId, { text: message });
  } catch (error) {
    console.error("Error fetching KBBI:", error);
    await sock.sendMessage(chatId, {
      text: "An error occurred while fetching KBBI.",
    });
  }
}

module.exports = { getKBBI };
