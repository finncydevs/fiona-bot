const nhentai = require("nhentai-js");

async function nhenCommand(sock, chatId, code) {
  try {
    const stringCode = String(code);
    const doujin = await nhentai.getDoujin(stringCode);

    const { title, tags = [], pages, link } = doujin;
    const thumbnail = doujin.thumbnails[0] || doujin.pages[0];

    let result = `📚 *nHentai Found!*\n`;
    result += `🔖 *Code*: ${stringCode}\n`;
    result += `📚 *Title*: ${title}\n`;

    result += `🏷️ *Tags*: ${
      tags.length > 0 ? tags.join(", ") : "No tags available"
    }\n`;
    result += `🖼️ *Pages*: ${pages.length}\n`;
    result += `🔗 *Link*: ${link}\n`;

    await sock.sendMessage(chatId, {
      image: { url: thumbnail },
      caption: result,
    });
  } catch (error) {
    console.error(error);
    await sock.sendMessage(chatId, {
      text: "Gagal menemukan doujin! Pastikan kodenya benar atau coba lagi nanti.",
    });
  }
}

module.exports = { nhenCommand };
