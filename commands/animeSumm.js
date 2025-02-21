const fetch = require("node-fetch");

async function animeSumm(sock, chatId, query) {
  try {
    if (!query) {
      await sock.sendMessage(chatId, {
        text: "input an anime title you want to search!",
      });
      return;
    }

    const url = `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(
      query
    )}`;
    const response = await fetch(url);

    if (!response.ok) {
      await sock.sendMessage(chatId, {
        text: "failed to ger response from Kitsu API.",
      });
      return;
    }

    const data = await response.json();

    if (!data || !data.data || data.data.length === 0) {
      await sock.sendMessage(chatId, {
        text: `Anime with title "${query}" not found.`,
      });
      return;
    }

    const anime = data.data[0].attributes; // Ambil hasil pertama
    const message = `✨ *Anime Summary* ✨\n\n📜 *Title*: ${
      anime.titles.en || anime.titles.ja_jp || "Not found"
    }\n📺 *Episode*: ${anime.episodeCount || "Unknown"}\n⭐ *Rating*: ${
      anime.averageRating || "N/A"
    }\n📝 *Description*: ${
      anime.synopsis || "No description"
    }\n🔗 [Lihat di Kitsu](https://kitsu.io/anime/${data.data[0].id})`;

    await sock.sendMessage(chatId, { text: message });
  } catch (error) {
    console.error("Error fetching anime summary:", error);
    await sock.sendMessage(chatId, {
      text: "Failed while searching anime.",
    });
  }
}

module.exports = { animeSumm };
