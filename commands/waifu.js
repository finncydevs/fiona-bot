const fetch = require("node-fetch");

async function getWaifuImage(sock, chatId, type, category) {
  try {
    const url = `https://api.waifu.pics/${type}/${category}`;
    const response = await fetch(url);
    console.log(response);

    if (!response.ok) {
      await sock.sendMessage(chatId, { text: "Couldn't fetch waifu image." });
      return;
    }

    const data = await response.json();
    console.log("Waifu image data:", data);
    const imageUrl = data.url;

    await sock.sendMessage(chatId, {
      image: { url: imageUrl },
      caption: `Here's a ${category} image for you! 🖼️`,
    });
  } catch (error) {
    console.error("Error fetching waifu image:", error);
    await sock.sendMessage(chatId, { text: "Error fetching waifu image." });
  }
}

module.exports = { getWaifuImage };
