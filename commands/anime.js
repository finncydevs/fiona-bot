async function searchAnimeByPhoto(sock, chatId, message, apiKey) {
    const fileMessage = message.message?.imageMessage || message.message?.videoMessage;
    const buffer = await sock.downloadMediaMessage(message);

    if (!fileMessage || !buffer) {
        await sock.sendMessage(chatId, { text: 'Harap balas gambar atau video untuk mencari anime.' });
        return;
    }

    try {
        const sauceResponse = await fetchSauce(buffer, apiKey);
        if (!sauceResponse) {
            await sock.sendMessage(chatId, { text: 'Maaf, saya tidak menemukan hasil yang cocok.' });
            return;
        }

        const { title, similarity, episode, previewUrl } = sauceResponse;

        let resultMessage = `🔍 *Anime Found!*\n`;
        resultMessage += `🎥 *Title*: ${title}\n`;
        resultMessage += `📊 *Similarity*: ${similarity}%\n`;
        if (episode) resultMessage += `🎞️ *Episode*: ${episode}\n`;

        await sock.sendMessage(chatId, { text: resultMessage });

        if (previewUrl) {
            await sock.sendMessage(chatId, { image: { url: previewUrl }, caption: 'Preview Image' });
        }
    } catch (error) {
        console.error(error);
        await sock.sendMessage(chatId, { text: 'Terjadi kesalahan saat mencari anime. Silakan coba lagi nanti.' });
    }
}

async function fetchSauce(imageBuffer, apiKey) {
    const apiUrl = `https://saucenao.com/search.php`;
    const formData = new FormData();
    formData.append('file', imageBuffer, 'image.jpg');
    formData.append('api_key', apiKey);

    const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    const data = await response.json();
    if (!data.results || data.results.length === 0) return null;

    const bestMatch = data.results[0];
    return {
        title: bestMatch.data.title || 'Unknown',
        similarity: (bestMatch.header.similarity || 0).toFixed(2),
        episode: bestMatch.data.part || 'N/A',
        previewUrl: bestMatch.header.thumbnail,
    };
}
module.exports = searchCommand;