const truths = [
  "Apa hal gila yang pernah kamu lakukan malam hari?",
  "Apa kebiasaan gila dan buruk yang kamu miliki?",
  "Apa kebohongan paling gila yang pernah kamu sembunyikan?",
  "Sebutkan fetish dan kink kamu!",
  "Pernahkah kamu terobsesi pada sesuatu?",
  "Makanan apa yang pernah kamu makan, namun seharusnya tidak dimakan?",
  "Barang aneh apa yang kamu beli tapi tidak berguna dan berujung menjadi impulsif?",
  "Jika kamu memiliki sembilan nyawa maka apa yang akan kamu lakukan?",
  "Sebutkan 3 film favorite yang tidak bisa kamu lupakan!",
];

async function truthCommand(sock, chatId) {
  const randomTruth = truths[Math.floor(Math.random() * truths.length)];
  await sock.sendMessage(chatId, { text: `🔮 Truth: ${randomTruth}` });
}

module.exports = { truthCommand };
