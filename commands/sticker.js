const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const sharp = require("sharp");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
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

    if (!mediaMessage && msg.extendedTextMessage?.contextInfo?.quotedMessage) {
      const quotedMsg = msg.extendedTextMessage.contextInfo.quotedMessage;
      mediaMessage = quotedMsg.imageMessage || quotedMsg.videoMessage;
    }
  }

  if (!mediaMessage) {
    await sock.sendMessage(chatId, {
      text: "Tidak ditemukan media. Harap kirim gambar/video dengan caption atau balas media yang valid.",
    });
    return;
  }

  try {
    const mediaBuffer = await downloadMediaMessage(
      message,
      "buffer",
      {}, // Empty options
      { logger: undefined, reuploadRequest: sock.updateMediaMessage }
    );

    if (!mediaBuffer) {
      throw new Error("Failed to download the media.");
    }

    // Cek apakah media adalah gambar atau video
    if (mediaMessage.mimetype.startsWith("image/")) {
      // Jika Gambar, gunakan Sharp
      const stickerBuffer = await sharp(mediaBuffer).webp().toBuffer();

      await sock.sendMessage(chatId, {
        sticker: stickerBuffer,
        mimetype: "image/webp",
        packname: settings.packname || "My Pack",
        author: settings.author || "My Author",
      });
    } else if (mediaMessage.mimetype.startsWith("video/")) {
      // Jika Video, gunakan FFmpeg
      const tempInput = path.join(__dirname, "temp", `input_${Date.now()}.mp4`);
      const tempOutput = path.join(
        __dirname,
        "temp",
        `output_${Date.now()}.webp`
      );

      fs.writeFileSync(tempInput, mediaBuffer);

      await new Promise((resolve, reject) => {
        ffmpeg(tempInput)
          .outputOptions([
            "-vcodec libwebp", // Gunakan codec WebP
            "-vf scale=512:512:force_original_aspect_ratio=decrease", // Resize ke ukuran maksimal 512x512
            "-loop 0", // Looping animasi
            "-preset default",
            "-an", // Hapus audio
            "-vsync 0",
            "-s 512x512", // Ukuran output
          ])
          .toFormat("webp")
          .save(tempOutput)
          .on("end", resolve)
          .on("error", reject);
      });

      const stickerBuffer = fs.readFileSync(tempOutput);

      await sock.sendMessage(chatId, {
        sticker: stickerBuffer,
        mimetype: "image/webp",
        packname: settings.packname || "My Pack",
        author: settings.author || "My Author",
      });

      // Hapus file sementara setelah selesai
      fs.unlinkSync(tempInput);
      fs.unlinkSync(tempOutput);
    }
  } catch (error) {
    console.error("Error creating sticker:", error.message);
    await sock.sendMessage(chatId, {
      text: `Terjadi kesalahan saat membuat stiker: ${error.message}`,
    });
  }
}

module.exports = stickerCommand;
