async function funfactsCommand(sock, chatId) {
  try {
    const url = "https://uselessfacts.jsph.pl/random.json?language=en";
    const response = await fetch(url);
    console.log(response);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.text) {
      throw new Error("No facts received from API.");
    }

    const fact = data.text; // API mengembalikan fakta di dalam properti 'text'
    console.log("Fact:", fact);

    await sock.sendMessage(chatId, {
      text: fact,
    });
  } catch (error) {
    console.error("Error during request:", error);
    await sock.sendMessage(chatId, {
      text: "Gagal mendapatkan fakta. Coba lagi nanti.",
    });
  }
}

module.exports = { funfactsCommand };
