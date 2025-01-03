const dares = [
  "Hubungi seseorang yang sudah lama tidak kamu hubungi, namun orang tersebut penting untuk kamu!",
  "Tulis sebuah tulisan untuk dirimu sendiri dan bacakan di depan teman-teman kamu agar dapat selalu diingat!",
  "Beritahu perasaanmu kepada salah satu teman yang ada disini (dalam hal romantis)!",
  "Kirim temanmu foto selfie yang menurutmu aib!",
  "Gunakan nada pada setiap omongan mu selama 3 putaran permainan!",
  "Tunjukkan isi chat terakhir yang kamu lakukan kepada temanmu!",
  "Upload foto orang yang kamu dambakan pada Instagram dan gunakan emoticon love!",
  "WhatsApp pacarmu atau kekasih mu dan katakan “kamu selingkuh ya?”!",
  "Pijitin kaki salah satu temanmu hingga dia mengatakan cukup!",
  "Check out satu barang paling atas yang ada di keranjang e-commerce mu!",
];

async function dareCommand(sock, chatId) {
  const randomDare = dares[Math.floor(Math.random() * dares.length)];
  await sock.sendMessage(chatId, { text: `🔥 Dare: ${randomDare}` });
}

module.exports = { dareCommand };
