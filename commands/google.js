const axios = require("axios");

async function getRandomImage(sock, chatId, query) {
  const apiKey =
    "3f25d88eeaf104e5d92ad676985fee8f6412391eabc5dc7c28bf2f24e484201a"; // Replace with your SerpAPI key
  const searchEndpoint = "https://serpapi.com/search";

  try {
    // Make a request to SerpAPI
    const response = await axios.get(searchEndpoint, {
      params: {
        engine: "google_images",
        q: query,
        api_key: apiKey,
      },
    });

    const images = response.data.images_results.map((img) => img.original);

    if (images.length === 0) {
      await sock.sendMessage(chatId, {
        text: "Maaf, tidak dapat menemukan gambar untuk kata kunci tersebut.",
      });
      return;
    }

    const randomImage = images[Math.floor(Math.random() * images.length)];

    const imageResponse = await axios.get(randomImage, {
      responseType: "arraybuffer",
    });
    const buffer = Buffer.from(imageResponse.data, "binary");

    const godaan = [
      "nih memenya sayang",
      "nih azril",
      "nih buat kamu",
      "nih buat kamu sayang",
      "ini meme jomoknya buat kamuch",
      "muachh",
     ];

    const randomGodaan = godaan[Math.floor(Math.random() * godaan.length)];

    await sock.sendMessage(chatId, {
      image: buffer,
      caption: randomGodaan,
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    await sock.sendMessage(chatId, {
      text: "Coba lagi nanti, terjadi kesalahan saat mengambil gambar.",
    });
  }
}

module.exports = { getRandomImage };
