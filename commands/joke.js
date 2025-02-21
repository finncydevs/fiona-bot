const axios = require("axios");

async function getJoke(sock, chatId) {
  try {
    const url = "https://v2.jokeapi.dev/joke/Any";
    const response = await axios.get(url, {
      headers: { Accept: "application/json" },
    });

    const data = response.data;
    let joke;

    if (data.type === "twopart") {
      joke = ` Joke:\n${data.setup}\n\n ${data.delivery}`;
    } else {
      joke = ` Joke:\n${data.joke}`;
    }

    await sock.sendMessage(chatId, { text: joke });
  } catch (error) {
    console.error("Error fetching joke:", error);
    await sock.sendMessage(chatId, {
      text: "Sorry, I could not fetch a joke right now.",
    });
  }
}

module.exports = { getJoke };
