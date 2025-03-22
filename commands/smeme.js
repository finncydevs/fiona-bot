const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const sharp = require("sharp");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
const settings = require("../settings");
const { createCanvas, loadImage, registerFont } = require("canvas");

// Daftarkan font custom
registerFont(path.join(__dirname, "fonts", "Impact.ttf"), { family: "Impact" });

async function smemeCommand(sock, chatId, message, query) {
  try {
    let mediaMessage;

    // Cek apakah pesan yang dikutip ada media-nya
    if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
      const quotedMessage =
        message.message.extendedTextMessage.contextInfo.quotedMessage;
      mediaMessage = quotedMessage.imageMessage || quotedMessage.videoMessage;
      message = { message: quotedMessage };
    } else {
      const msg = message.message || {};
      mediaMessage = msg.imageMessage || msg.videoMessage;

      if (
        !mediaMessage &&
        msg.extendedTextMessage?.contextInfo?.quotedMessage
      ) {
        const quotedMsg = msg.extendedTextMessage.contextInfo.quotedMessage;
        mediaMessage = quotedMsg.imageMessage || quotedMsg.videoMessage;
      }
    }

    // Jika tidak ada media, kirim pesan error
    if (!mediaMessage) {
      await sock.sendMessage(chatId, {
        text:
          query ||
          "Tidak ditemukan media. Kirim gambar/video dengan caption atau balas media yang valid.",
      });
      return;
    }

    // Download media
    const mediaBuffer = await downloadMediaMessage(sock, message, "buffer", {});
    if (!mediaBuffer) {
      throw new Error("Gagal mengunduh media.");
    }

    // Jika media adalah gambar
    if (mediaMessage.mimetype.startsWith("image/")) {
      const img = await loadImage(mediaBuffer);
      const canvas = createCanvas(img.width, img.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(img, 0, 0, img.width, img.height);

      if (query) {
        // Atur font dan style teks
        const fontSize = Math.max(20, Math.floor(img.width / 10));
        ctx.font = `bold ${fontSize}px Impact`;
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = Math.floor(fontSize / 10);

        // Posisi teks di bawah gambar
        const textX = img.width / 2;
        const textY = img.height - 50;

        ctx.textAlign = "center";
        ctx.strokeText(query, textX, textY);
        ctx.fillText(query, textX, textY);
      }

      const stickerBuffer = await sharp(canvas.toBuffer())
        .resize(512, 512, { fit: "inside" })
        .webp()
        .toBuffer();

      if (!stickerBuffer || stickerBuffer.length === 0) {
        throw new Error("Gagal mengonversi gambar menjadi stiker.");
      }

      await sock.sendMessage(chatId, {
        sticker: stickerBuffer,
        mimetype: "image/webp",
        packname: settings.packname || "My Pack",
        author: settings.author || "My Author",
      });
    } else if (mediaMessage.mimetype.startsWith("video/")) {
      const tempDir = path.join(__dirname, "temp");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }

      const tempInput = path.join(tempDir, `input_${Date.now()}.mp4`);
      const tempOutput = path.join(tempDir, `output_${Date.now()}.webp`);

      fs.writeFileSync(tempInput, mediaBuffer);

      await new Promise((resolve, reject) => {
        ffmpeg(tempInput)
          .outputOptions([
            "-vcodec libwebp",
            "-vf scale=512:512:force_original_aspect_ratio=decrease",
            "-loop 0",
            "-preset default",
            "-an",
            "-vsync 0",
            "-s 512x512",
          ])
          .toFormat("webp")
          .save(tempOutput)
          .on("end", resolve)
          .on("error", reject);
      });

      if (!fs.existsSync(tempOutput)) {
        throw new Error("Gagal mengonversi video menjadi stiker.");
      }

      const stickerBuffer = fs.readFileSync(tempOutput);

      await sock.sendMessage(chatId, {
        sticker: stickerBuffer,
        mimetype: "image/webp",
        packname: settings.packname || "My Pack",
        author: settings.author || "My Author",
      });

      // Bersihkan file sementara
      if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput);
      if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);
    }
  } catch (error) {
    console.error("Error creating sticker:", error.message);
    await sock.sendMessage(chatId, {
      text: query || `Terjadi kesalahan saat membuat stiker: ${error.message}`,
    });
  }
}

module.exports = { smemeCommand };
