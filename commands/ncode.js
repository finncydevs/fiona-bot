const nhentai = require("nhentai-js");

async function nhenSearch(sock, chatId, search) {
  try {
    // const stringCode = String(code);
    const doujin = await nhentai.search(search);

    const { title, pages, link } = doujin;
    const thumbnail = doujin.thumbnails[0] || doujin.pages[0];

    let result = `📚 *nHentai Found!*\n`;
    result += `🔖 *Tags/Parodies*: ${search}\n`;
    result += `📚 *Title*: ${title}\n`;

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

module.exports = { nhenSearch };
