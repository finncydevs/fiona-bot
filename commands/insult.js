async function insultCommand(sock, chatId, mentionedUser) {
  try {
    if (!mentionedUser) {
      await sock.sendMessage(chatId, {
        text: "Please mention a user to insult.",
      });
      return;
    }

    let url = "https://evilinsult.com/generate_insult.php?lang=en&type=json";
    let response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    let data = await response.json();

    if (!data || !data.insult) {
      throw new Error("No insult received from API.");
    }

    let insult = data.insult;
    let cleanMention = mentionedUser.replace("@s.whatsapp.net", "");

    await sock.sendMessage(chatId, {
      text: `@${cleanMention} ${insult}`,
      mentions: [mentionedUser],
    });
  } catch (error) {
    console.error("Error during request:", error);
    await sock.sendMessage(chatId, {
      text: "Failed to generate an insult. Try again later.",
    });
  }
}

module.exports = { insultCommand };
