const insults = ["", "", "", "", "", ""];

async function insultCommand(sock, chatId, mentionedUser) {
  if (!mentionedUser) {
    await sock.sendMessage(chatId, {
      text: "Please mention a user to insult.",
    });
    return;
  }
  const cleanMention = mentionedUser.replace("@s.whatsapp.net", "");

  const randomInsult = insults[Math.floor(Math.random() * insults.length)];
  await sock.sendMessage(chatId, {
    text: `@${cleanMention} ${randomInsult}`,
    mentions: [mentionedUser],
  });
}
module.exports = { insultCommand };
