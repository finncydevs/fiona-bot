const nhentai = require("nhentai-js");

async function nhenCommand(sock, chatId, code) {
  if (!code) {
    await sock.sendMessage(chatId, { text: "coba lagi" });
    return;
  }

  try {
    const stringCode = String(code);
    const doujin = await nhentai.getDoujin(stringCode);
    const { title, tags = [], pages, link } = doujin; //default
    const thumbnail = doujin.thumbnails[0] || doujin.pages[0];
    let resultMessage = `📚 *nHentai Found!*\n`;
    resultMessage += `🔖 *Code*: ${stringCode}\n`;
    resultMessage += `📚 *Title*: ${title}\n`;

    resultMessage += `🏷️ *Tags*: ${
      tags.length > 0 ? tags.join(", ") : "No tags available"
    }\n`;

    resultMessage += `🖼️ *Pages*: ${pages.length}\n`;
    resultMessage += `🔗 *Link*: ${link}\n`;

    await sock.sendMessage(chatId, {
      image: { url: thumbnail },
      caption: resultMessage,
    });
  } catch (error) {
    console.error(error);
    await sock.sendMessage(chatId, {
      text: "coba lagi.",
    });
  }
}

module.exports = { nhenCommand };
