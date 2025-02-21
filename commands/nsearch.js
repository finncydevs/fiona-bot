const nhentai = require("nhentai-js");

async function nsearch(sock, chatId, query) {
  try {
    const stringquery = String(query);
    const searchResult = await nhentai.search(stringquery);

    if (
      !searchResult ||
      !Array.isArray(searchResult.results) ||
      searchResult.results.length === 0
    ) {
      throw new Error("No results found.");
    }

    const firstResult = searchResult.results[0];
    if (!firstResult || !firstResult.title || !firstResult.bookId) {
      throw new Error("Invalid data in search result.");
    }

    const title = firstResult.title;
    const thumbnail = firstResult.thumbnail || null;
    const link = `https://nhentai.net/g/${firstResult.bookId}`;

    let result = `📚 *nHentai Found!*\n`;
    result += `🔖 *Code*: ${firstResult.bookId}\n`;
    result += `📚 *Title*: ${title}\n`;
    result += `🔗 *Link*: ${link}\n`;

    if (thumbnail) {
      await sock.sendMessage(chatId, {
        image: { url: thumbnail },
        caption: result,
      });
    } else {
      await sock.sendMessage(chatId, { text: result });
    }
  } catch (error) {
    console.error("Error in nsearch:", error.message);
    await sock.sendMessage(chatId, {
      text: `Failed to search for stockings: ${error.message}`,
    });
  }
}

module.exports = { nsearch };

