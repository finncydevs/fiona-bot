const compliments = [
    "Kamu baik sekali sih 😊🍆",
    "Kamu hebat banget!(❁´◡`❁)",
    "Anak pintar! (*/ω＼*)",
    "Kamu keren banget! (๑˃̵ᴗ˂̵)",
    "Kamu lucu banget! (´∀｀)♡",
    "Kamu pinter banget! (´∀｀)♡",
    "Kamu kawaii banget! (´∀｀)♡",
];

async function complimentCommand(sock, chatId, mentionedUser) {
    if (!mentionedUser) {
        await sock.sendMessage(chatId, { text: 'Please mention a user to compliment.' });
        return;
    }
    const cleanMention = mentionedUser.replace('@s.whatsapp.net', '');

    const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
    await sock.sendMessage(chatId, { text: `@${cleanMention} ${randomCompliment}`, mentions: [mentionedUser] });
}

module.exports = { complimentCommand };
