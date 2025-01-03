const nhentai = require("nhentai-js");

async function searchDoujinByCode(sock, chatId, code2) {
  // Check if the user provided a code
  if (!code2) {
    await sock.sendMessage(chatId, { text: "Silakan masukkan kode nHentai!" });
    return;
  }

  try {
    // Convert the provided code to string (ensure it's a valid code)
    const stringCode = String(code2);

    // Fetch the doujin using the provided code
    const doujin = await nhentai.getDoujin(stringCode);

    // Destructure the required fields from the doujin object
    const { title, tags = [], pages, link } = doujin;

    // Select the first thumbnail or fallback to the first page
    const thumbnail =
      doujin.thumbnails && doujin.thumbnails[0]
        ? doujin.thumbnails[0]
        : doujin.pages && doujin.pages[0]
        ? doujin.pages[0]
        : "default-image-url.jpg";

    // Build the message to send back to the user
    let resultMessage = `📚 *nHentai Found!*\n`;
    resultMessage += `🔖 *Code*: ${stringCode}\n`;
    resultMessage += `📚 *Title*: ${title}\n`;
    resultMessage += `🏷️ *Tags*: ${
      tags.length > 0 ? tags.join(", ") : "No tags available"
    }\n`;
    resultMessage += `🖼️ *Pages*: ${pages.length}\n`;
    resultMessage += `🔗 *Link*: ${link}\n`;

    // Send the message with the image and caption
    await sock.sendMessage(chatId, {
      image: { url: thumbnail },
      caption: resultMessage,
    });
  } catch (error) {
    console.error("Error fetching doujin:", error); // Detailed logging for debugging
    await sock.sendMessage(chatId, {
      text: "Oops! Something went wrong. Please try again later or check the code.",
    });
  }
}

module.exports = searchDoujinByCode;
