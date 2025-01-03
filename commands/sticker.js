const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const sharp = require("sharp");
const settings = require("../settings");

async function stickerCommand(sock, chatId, message) {
  let mediaMessage;

  if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
    const quotedMessage =
      message.message.extendedTextMessage.contextInfo.quotedMessage;
    mediaMessage = quotedMessage.imageMessage || quotedMessage.videoMessage;
    message = { message: quotedMessage }; // Update message to point to the quoted message
  } else {
    const msg = message.message || {};
    mediaMessage = msg.imageMessage || msg.videoMessage;

    // Additional fallback: Check if the message contains a quoted media in the context
    if (!mediaMessage && msg.extendedTextMessage?.contextInfo?.quotedMessage) {
      const quotedMsg = msg.extendedTextMessage.contextInfo.quotedMessage;
      mediaMessage = quotedMsg.imageMessage || quotedMsg.videoMessage;
    }
  }

  // If no media is found, send a message back to the user
  if (!mediaMessage) {
    await sock.sendMessage(chatId, {
      text: "Tidak ditemukan media. Harap kirim gambar/video dengan caption atau balas media yang valid.",
    });
    return;
  }

  try {
    // Download the media
    const mediaBuffer = await downloadMediaMessage(
      message,
      "buffer",
      {}, // Empty options
      { logger: undefined, reuploadRequest: sock.updateMediaMessage }
    );

    // If the media fails to download
    if (!mediaBuffer) {
      throw new Error("Failed to download the media.");
    }

    // Convert the media to a WebP sticker
    const stickerBuffer = await sharp(mediaBuffer)
      .resize(512, 512, { fit: "cover" }) // Ensure the sticker is square and resized
      .webp() // Convert to WebP format
      .toBuffer();

    // Send the sticker
    await sock.sendMessage(chatId, {
      sticker: stickerBuffer,
      mimetype: "image/webp",
      packname: settings.packname || "My Pack", // Default values if settings are undefined
      author: settings.author || "My Author",
    });
  } catch (error) {
    // Handle errors during media processing or sending
    console.error("Error creating sticker:", error.message);
    await sock.sendMessage(chatId, {
      text: `Terjadi kesalahan saat membuat stiker: ${error.message}`,
    });
  }
}

module.exports = stickerCommand;
