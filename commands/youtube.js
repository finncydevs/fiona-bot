const ytdlp = require("ytdlp-nodejs");
const { createWriteStream } = require("fs");
const { error } = require("console");
const file = createWriteStream("./temp/video.mp4");

async function youtubeCommand(sock, chatId, urls) {
  if (!urls) {
    await sock.sendMessage(chatId, {
      text: "Masukkan URL video YouTube yang ingin diunduh.",
    });
    return;
  }
  try {
    const stream = ytdlp
      .stream(urls, {
        filter: "audioandvideo",
        quality: "highest",
      })
      .on("error", (error) => {
        console.error(error);
      })
      .pipe(file);

    ytdlp
      .download(urls, {
        filter: "mergevideo",
        quality: "highest",
        output: file,
        outdir: "./temp",
      })
      .on("progress", (chunkLength, downloaded, total) => {
        const percent = downloaded / total;
        console.log("Downloaded: ", percent);
      });
    const video = fs.readFileSync("./temp/video.mp4");
    await sock.sendMessage(chatId, {
      video: video,
      caption: "Berhasil mengunduh video!",
    });
    fs.unlinkSync(file);
  } catch (error) {}
}
module.exports = youtubeCommand;
