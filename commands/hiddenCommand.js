const settings = require("../settings");
const fs = require("fs");

async function hiddenCommand(sock, chatId, channelLink) {
  const helpMessage = `
╔═══════════════════╗
   *🤖 ${settings.botName || "WhatsApp Bot"}*  
   Version: *${settings.version || "1.0.0"}*
   by ${settings.botOwner || "Unknown Owner"}
╚═══════════════════╝

*Available Hidden Commands:*

╔═══════════════════╗
🌐 *Hidden Commands*:
║ ➤ .femboy 
║ ➤ .jomok
║ ➤ .nhen //Masukan kode atau gacha kode
║ ➤ .footpic
║ ➤ .freefuck
║ ➤ .femboy //Kirim random femboy
║ ➤ .goth //Kirim random goth
║ ➤ .waifu //Kirim random waifu
║ ➤ .trap //Kirim random trap
║ ➤ .nsfw //Kirim random NSFW

╚═══════════════════╝

@${settings.botName || "FionaBot"} 2024 v${settings.version || "1.0.0"}
`;

  try {
    const imagePath = "./assets/fiona.jpg";
    if (fs.existsSync(imagePath)) {
      const imageBuffer = fs.readFileSync(imagePath);
      await sock.sendMessage(chatId, {
        image: imageBuffer,
        caption: helpMessage,
      });
    } else {
      await sock.sendMessage(chatId, { text: helpMessage });
    }
  } catch (error) {
    await sock.sendMessage(chatId, {
      text: "An error occurred while sending the help message.",
    });
  }
}

module.exports = hiddenCommand;
