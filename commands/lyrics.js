const axios = require('axios');

async function lyricsCommand(sock, chatId,artist, songTitle, userMessageKey) {
    if (!songTitle) {
        await sock.sendMessage(chatId, { text: 'Please provide a song title! 🎵' });
        return;
    }

    try {
        await sock.sendMessage(chatId, {
            react: { text: '⌛', key: userMessageKey },
        });
        console.log(`Fetching lyrics for: ${songTitle}`);
        const response = await axios.get(`https://api.lyrics.ovh/v1/${artist}/${songTitle}`);
        console.log('API response:', response.data);
        
        const lyrics = response.data.lyrics || 'Lyrics not found.';
        await sock.sendMessage(chatId, { text: `🎶 *${songTitle}* 🎶\n\n${lyrics}` });
            
        
    } catch (error) {
        console.error('Error fetching lyrics:', error);
        await sock.sendMessage(chatId, { text: 'An error occurred while fetching the lyrics.' });

        await sock.sendMessage(chatId, {
            react: { text: null, key: userMessageKey },
        });
    }
}

module.exports = { lyricsCommand };
