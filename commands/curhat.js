async function curhatAi(sock, chatId, query) {
  try {
    const url = `https://api.mistra.top/ai/agent/curhat?prompt=${query}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    await sock.sendMessage(chatId, {
      text: data.result,
    });
  } catch (error) {}
}

module.exports = { curhatAi };
