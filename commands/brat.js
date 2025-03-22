async function bratGen(sock, chatId, query) {
  try {
    const url = `https://api.mistra.top/sticker/brat?prompt=${query}`;
    const response = await fetch(url);
    console.log(response);
    const data = await response.json();
    console.log(data);
    await sock.sendMessage(chatId, {
      text: data.result,
    });
  } catch (error) {}
}

module.exports = { bratGen };
