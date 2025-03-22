const settings = require("../settings");
const fs = require("fs");

async function helpCommand(sock, chatId, channelLink) {
  const helpMessage = `
╔═══════════════════╗
   *🤖 ${settings.botName || "WhatsApp Bot"}*  
   Version: *${settings.version || "1.0.0"}*
   by ${settings.botOwner || "Unknown Owner"}
╚═══════════════════╝

*Available Commands:*

╔═══════════════════╗
🌐 *General Commands*:
║ ➤ .help or .menu
║ ➤ .tts <text>
║ ➤ .sticker or .s
║ ➤ .owner
║ ➤ .joke
║ ➤ .quote
║ ➤ .fact
║ ➤ .weather <city>
║ ➤ .news
║ ➤ .meme
║ ➤ .simage
║ ➤ .attp <text>
║ ➤ .lyrics "<artis>" "<song_title>"
║ ➤ .8ball <question>
╚═══════════════════╝

╔═══════════════════╗
🛠️ *Admin Commands*:
║ ➤ .ban @user
║ ➤ .promote @user
║ ➤ .demote @user
║ ➤ .mute <minutes>
║ ➤ .unmute
║ ➤ .delete or .del
║ ➤ .kick @user
║ ➤ .warnings @user
║ ➤ .warn @user
║ ➤ .antilink
║ ➤ .clear
║ ➤ .pokemon // gacha pokemon
║ ➤ .kbbi <kata>
║ ➤ .summary <anime>
╚═══════════════════╝

╔═══════════════════╗
🎮 *Game Commands*:
║ ➤ .tictactoe @user
║ ➤ .move <position>
║ ➤ .hangman
║ ➤ .guess <letter>
║ ➤ .trivia
║ ➤ .answer <answer>
║ ➤ .dare
║ ➤ .truth
╚═══════════════════╝

╔═══════════════════╗
👥 *Group Management*:
║ ➤ .tagall
║ ➤ .tag <message>
╚═══════════════════╝

╔═══════════════════╗
🎉 *Fun Commands*:
║ ➤ .compliment @user
║ ➤ .insult @user
╚═══════════════════╝

╔═══════════════════╗
🏆 *Other*:
║ ➤ .topmembers

╔═══════════════════╗
R18 commands
║ ➤ .hidden
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

module.exports = helpCommand;
