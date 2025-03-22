const axios = require("axios");

async function nhenCommand(sock, chatId, code) {
  try {
    const apiUrl = `https://nhentai.net/api/gallery/${code}`;
    const response = await axios.get(apiUrl, {timeout: 10000});
    const doujin = response.data;

    const { title, media_id, num_pages, tags } = doujin;

    let result = `📚 *nHentai Found!*\n`;
    result += `🔖 *Code*: ${code}\n`;
    result += `📚 *Title*: ${title.english || title.japanese || "Unknown"}\n`;
    result += `🏷️ *Tags*: ${
      tags.length > 0
        ? tags.map((tag) => tag.name).join(", ")
        : "No tags available"
    }\n`;
    result += `🖼️ *Pages*: ${num_pages}\n`;
    result += `🔗 *Main Link*: https://nhentai.net/g/${code}/\n\n`;

    // Generate image URLs
    const imageUrls = Array.from(
      { length: num_pages },
      (_, i) => `https://i.nhentai.net/galleries/${media_id}/${i + 1}.jpg`
    );

    // Send text first
    await sock.sendMessage(chatId, { text: result });

    // Send each image
    for (const imageUrl of imageUrls) {
      await sock.sendMessage(chatId, {
        image: { url: imageUrl },
        caption: `Page ${imageUrls.indexOf(imageUrl) + 1}`,
      });
    }
  } catch (error) {
    console.error(error);
    await sock.sendMessage(chatId, {
      text: "Failed to fetch doujin images.",
    });
  }
}

module.exports = { nhenCommand };
