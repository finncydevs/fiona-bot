const sharp = require("sharp");
const fs = require("fs");
const fsPromises = require("fs/promises");
const fse = require("fs-extra");
const path = require("path");
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

const tempDir = "./temp";
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

const scheduleFileDeletion = (filePath) => {
  setTimeout(async () => {
    try {
      await fse.remove(filePath);
      console.log(`File deleted: ${filePath}`);
    } catch (error) {
      console.error(`Failed to delete file:`, error);
    }
  }, 5 * 60 * 1000); // 5 minutes
};

const convertStickerToImage = async (sock, quotedMessage, chatId) => {
  try {
    if (!quotedMessage || !quotedMessage.stickerMessage) {
      await sock.sendMessage(chatId, {
        text: "Reply to a sticker with .simage to convert it.",
      });
      return;
    }

    const timestamp = Date.now();
    const stickerFilePath = path.join(tempDir, `sticker_${timestamp}.webp`);
    const outputImagePath = path.join(
      tempDir,
      `converted_image_${timestamp}.png`
    );

    console.log("Downloading sticker...");
    const stream = await downloadContentFromMessage(
      quotedMessage.stickerMessage,
      "sticker"
    );
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);

    if (!buffer.length) {
      throw new Error("Failed to download sticker.");
    }

    console.log("Sticker downloaded. Saving to file...");
    await fsPromises.writeFile(stickerFilePath, buffer);
    console.log("Sticker saved at:", stickerFilePath);

    console.log("Converting sticker to PNG...");
    await sharp(stickerFilePath)
      .ensureAlpha() // Pastikan transparansi ada jika perlu
      .toFormat("png")
      .toFile(outputImagePath);
    console.log("Conversion complete. Image saved at:", outputImagePath);

    const imageBuffer = await fsPromises.readFile(outputImagePath);
    await sock.sendMessage(chatId, {
      image: imageBuffer,
      caption: "Here is the converted image!",
    });
    console.log("Image sent successfully!");

    scheduleFileDeletion(stickerFilePath);
    scheduleFileDeletion(outputImagePath);
  } catch (error) {
    console.error("Error converting sticker to image:", error);
    await sock.sendMessage(chatId, {
      text: "An error occurred while converting the sticker.",
    });
  }
};

module.exports = convertStickerToImage;
