const ytdlp = require("ytdlp-nodejs");
const fs = require("fs");
const path = require("path");

async function youtubeCommand(sock, chatId, url) {
  if (!url) {
    await sock.sendMessage(chatId, {
      text: "Masukkan URL video YouTube yang ingin diunduh.",
    });
    return;
  }

  const tempDir = path.join(__dirname, "..", "temp"); // One level outside the current folder
  const outputPath = path.join(tempDir, "video.mp4");

  try {
    // Ensure the temp folder exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    console.log("Starting download...");
    const downloader = ytdlp.download(url, {
      filter: "audioandvideo",
      quality: "highest",
      outdir: tempDir,
      output: "video.mp4",
    });

    downloader
      .on("progress", (chunkLength, downloaded, total) => {
        const percent = (downloaded / total) * 100;
        console.log(`Downloaded: ${percent.toFixed(2)}%`);
      })
      .on("end", () => {
        console.log("Download completed successfully!");
      })
      .on("error", (err) => {
        console.error("Download error:", err);
      });
    console.log(tempDir);
    await downloader;

    // Check if the file exists
    if (!fs.existsSync(outputPath)) {
      throw new Error(`File not found at ${outputPath}`);
    }

    // Read and send the file
    const video = fs.readFileSync(outputPath);
    await sock.sendMessage(chatId, {
      video,
      caption: "Succes downloaded the video",
    });

    // Clean up the file
    fs.unlinkSync(outputPath);
    console.log("File sent and removed.");
  } catch (error) {
    console.error("Error during download or sending:", error);
    await sock.sendMessage(chatId, {
      text: "Error occured. try again later.",
    });
  }
}

module.exports = youtubeCommand;
